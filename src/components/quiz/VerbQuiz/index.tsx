import { type ChangeEvent, type KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import type { VerbTimeShortName } from '../../../data/verbTypes.ts';

const promptAnimationSpeed = 22.5;

type PromptPart = {
  className?: string;
  hint?: string;
  muted?: boolean;
  text: string;
};

type PromptProps = {
  parts: PromptPart[];
};

type AnimatedPromptProps = PromptProps & {
  speed?: number;
};

type QuizResult = {
  answer: string;
  expectedAnswer: string;
  infinitiveForm: string;
  subject: string;
  time: string;
};

type VerbQuizProps = {
  answer: string;
  acceptedAnswers?: readonly string[];
  autoFocus?: boolean;
  infinitiveForm: string;
  isActive?: boolean;
  onCorrect?: (result: QuizResult) => void;
  onWrong?: (result: QuizResult) => void;
  showHints?: boolean;
  subject: string;
  time: string;
  timeShortName: VerbTimeShortName;
  translations: readonly string[];
};

type PromptInput = Pick<
  VerbQuizProps,
  'infinitiveForm' | 'showHints' | 'subject' | 'time' | 'timeShortName' | 'translations'
>;

function getPromptPartClassName(part: PromptPart): string | undefined {
  return classNames(part.className, {
    muted: part.muted,
    'prompt-part--hint': part.hint,
  });
}

function getPromptParts({
  infinitiveForm,
  showHints,
  subject,
  time,
  timeShortName,
  translations,
}: PromptInput): PromptPart[] {
  const translationHint = showHints ? translations.join(', ') : undefined;

  return [
    { text: `${subject} ` },
    { text: '+', muted: true },
    { text: ' ' },
    { hint: translationHint, text: infinitiveForm },
    { text: ' ' },
    { text: '/', muted: true },
    { className: `tense-label tense-label--${timeShortName}`, text: ` ${time}` },
  ];
}

function normalizeAnswer(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('pt-PT')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

function isAcceptedAnswer(value: string, acceptedAnswers: readonly string[]): boolean {
  const normalizedValue = normalizeAnswer(value);

  return acceptedAnswers.some((acceptedAnswer) => normalizeAnswer(acceptedAnswer) === normalizedValue);
}

function AnimatedPrompt({ parts, speed = promptAnimationSpeed }: AnimatedPromptProps) {
  const text = useMemo(() => parts.map((part) => part.text).join(''), [parts]);
  const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [visibleLength, setVisibleLength] = useState(() => (shouldReduceMotion ? text.length : 0));
  const visibleParts = useMemo(
    () =>
      parts.reduce(
        (result, part) => {
          const availableCharacters = Math.max(visibleLength - result.consumedCharacters, 0);
          const visibleText = part.text.slice(0, availableCharacters);

          return {
            consumedCharacters: result.consumedCharacters + part.text.length,
            items: visibleText
              ? result.items.concat({
                  className: part.className,
                  hint: part.hint,
                  muted: part.muted,
                  text: visibleText,
                })
              : result.items,
          };
        },
        { consumedCharacters: 0, items: [] as PromptPart[] }
      ).items,
    [parts, visibleLength]
  );

  useEffect(() => {
    if (shouldReduceMotion) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setVisibleLength((length) => {
        if (length >= text.length) {
          window.clearInterval(intervalId);
          return length;
        }

        return length + 1;
      });
    }, speed);

    return () => window.clearInterval(intervalId);
  }, [shouldReduceMotion, speed, text.length]);

  return (
    <p aria-label={text}>
      {visibleParts.map((part, index) => (
        <span className={getPromptPartClassName(part)} data-hint={part.hint} key={index}>
          {part.text}
        </span>
      ))}
      {visibleLength < text.length && <span className="typing-caret" aria-hidden="true" />}
    </p>
  );
}

function StaticPrompt({ parts }: PromptProps) {
  return (
    <p>
      {parts.map((part, index) => (
        <span className={getPromptPartClassName(part)} data-hint={part.hint} key={`${part.text}-${index}`}>
          {part.text}
        </span>
      ))}
    </p>
  );
}

export default function VerbQuiz({
  answer,
  acceptedAnswers = [answer],
  autoFocus = false,
  infinitiveForm,
  isActive = true,
  onCorrect = () => {},
  onWrong = () => {},
  showHints = true,
  subject,
  time,
  timeShortName,
  translations,
}: VerbQuizProps) {
  const [typedAnswer, setTypedAnswer] = useState('');
  const [status, setStatus] = useState('active');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const promptParts = useMemo(
    () => getPromptParts({ infinitiveForm, showHints, subject, time, timeShortName, translations }),
    [infinitiveForm, showHints, subject, time, timeShortName, translations]
  );
  const isCorrect = status === 'correct';
  const isWrong = status === 'wrong';
  const isResolved = isCorrect || isWrong;

  useEffect(() => {
    if (autoFocus && isActive) {
      inputRef.current?.focus();
    }
  }, [autoFocus, isActive]);

  function resolveCorrect(typedAnswer: string): void {
    setTypedAnswer(typedAnswer);
    setStatus('correct');
    onCorrect({
      answer: typedAnswer,
      expectedAnswer: answer,
      infinitiveForm,
      subject,
      time,
    });
  }

  function resolveWrong(): void {
    setStatus('wrong');
    onWrong({
      answer: typedAnswer,
      expectedAnswer: answer,
      infinitiveForm,
      subject,
      time,
    });
  }

  function handleAnswerChange(event: ChangeEvent<HTMLInputElement>): void {
    const value = event.target.value;

    setTypedAnswer(value);

    if (isAcceptedAnswer(value, acceptedAnswers)) {
      resolveCorrect(value);
    }
  }

  function handleAnswerKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key !== 'Enter' || !typedAnswer.trim() || isResolved) {
      return;
    }

    event.preventDefault();
    resolveWrong();
  }

  return (
    <>
      <div className="quiz__prompt">
        {isActive ? <AnimatedPrompt parts={promptParts} /> : <StaticPrompt parts={promptParts} />}
      </div>

      <label
        className={classNames('quiz__answer-line', {
          'quiz__answer-line--wrong': isWrong,
        })}
      >
        <span className="sr-only">Resposta</span>
        <span className="answer-display" aria-hidden="true">
          {typedAnswer ? (
            <span
              className={classNames('answer-text', {
                'answer-text--wrong': isWrong,
              })}
            >
              {typedAnswer}
            </span>
          ) : (
            <span className="answer-placeholder">escreve só forma verbal</span>
          )}
          {isCorrect && <span className="check">✓</span>}
          {isWrong && <>{answer}</>}
        </span>

        <span className="quiz__answer">
          <input
            autoComplete="off"
            autoFocus={autoFocus}
            inputMode="text"
            readOnly={!isActive || isResolved}
            ref={inputRef}
            spellCheck="false"
            type="text"
            value={typedAnswer}
            onChange={handleAnswerChange}
            onKeyDown={handleAnswerKeyDown}
          />
        </span>
      </label>
    </>
  );
}
