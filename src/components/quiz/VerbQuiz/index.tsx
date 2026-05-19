import { type ChangeEvent, type KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import type { VerbTimeShortName } from '../../../data/a2IrregularVerbs';

const promptAnimationSpeed = 22.5;

type PromptPart = {
  className?: string;
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
  autoFocus?: boolean;
  infinitiveForm: string;
  isActive?: boolean;
  onCorrect?: (result: QuizResult) => void;
  onWrong?: (result: QuizResult) => void;
  subject: string;
  time: string;
  timeShortName: VerbTimeShortName;
};

type PromptInput = Pick<VerbQuizProps, 'infinitiveForm' | 'subject' | 'time' | 'timeShortName'>;

function getPromptPartClassName(part: PromptPart): string | undefined {
  return classNames(part.className, {
    muted: part.muted,
  });
}

function getPromptParts({ infinitiveForm, subject, time, timeShortName }: PromptInput): PromptPart[] {
  return [
    { text: `${subject} ` },
    { text: '+', muted: true },
    { text: ` ${infinitiveForm} ` },
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
        <span className={getPromptPartClassName(part)} key={index}>
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
      {parts.map((part) => (
        <span className={getPromptPartClassName(part)} key={part.text}>
          {part.text}
        </span>
      ))}
    </p>
  );
}

export default function VerbQuiz({
  answer,
  autoFocus = false,
  infinitiveForm,
  isActive = true,
  onCorrect = () => {},
  onWrong = () => {},
  subject,
  time,
  timeShortName,
}: VerbQuizProps) {
  const [typedAnswer, setTypedAnswer] = useState('');
  const [status, setStatus] = useState('active');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const promptParts = useMemo(
    () => getPromptParts({ infinitiveForm, subject, time, timeShortName }),
    [infinitiveForm, subject, time, timeShortName]
  );
  const isCorrect = status === 'correct';
  const isWrong = status === 'wrong';
  const isResolved = isCorrect || isWrong;

  useEffect(() => {
    if (autoFocus && isActive) {
      inputRef.current?.focus();
    }
  }, [autoFocus, isActive]);

  function resolveCorrect(): void {
    setTypedAnswer(answer);
    setStatus('correct');
    onCorrect({
      answer,
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

    if (normalizeAnswer(value) === normalizeAnswer(answer)) {
      resolveCorrect();
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
