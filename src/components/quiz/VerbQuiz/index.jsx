import { useEffect, useMemo, useRef, useState } from 'react';

const promptAnimationSpeed = 22.5;

function getPromptParts({ infinitiveForm, subject, time }) {
  return [
    { text: `${subject} ` },
    { text: '+', muted: true },
    { text: ` ${infinitiveForm} ` },
    { text: '/', muted: true },
    { text: ` ${time}` },
  ];
}

function normalizeAnswer(value) {
  return value
    .trim()
    .toLocaleLowerCase('pt-PT')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

function AnimatedPrompt({ parts, speed = promptAnimationSpeed }) {
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
                  muted: part.muted,
                  text: visibleText,
                })
              : result.items,
          };
        },
        { consumedCharacters: 0, items: [] }
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
        <span className={part.muted ? 'muted' : undefined} key={index}>
          {part.text}
        </span>
      ))}
      {visibleLength < text.length && <span className="typing-caret" aria-hidden="true" />}
    </p>
  );
}

function StaticPrompt({ parts }) {
  return (
    <p>
      {parts.map((part) => (
        <span className={part.muted ? 'muted' : undefined} key={part.text}>
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
}) {
  const [typedAnswer, setTypedAnswer] = useState('');
  const [status, setStatus] = useState('active');
  const inputRef = useRef(null);
  const promptParts = useMemo(() => getPromptParts({ infinitiveForm, subject, time }), [infinitiveForm, subject, time]);
  const isCorrect = status === 'correct';
  const isWrong = status === 'wrong';
  const isResolved = isCorrect || isWrong;

  useEffect(() => {
    if (autoFocus && isActive) {
      inputRef.current?.focus();
    }
  }, [autoFocus, isActive]);

  function resolveCorrect() {
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

  function resolveWrong() {
    setStatus('wrong');
    onWrong({
      answer: typedAnswer,
      expectedAnswer: answer,
      infinitiveForm,
      subject,
      time,
    });
  }

  function handleAnswerChange(event) {
    const value = event.target.value;

    setTypedAnswer(value);

    if (normalizeAnswer(value) === normalizeAnswer(answer)) {
      resolveCorrect();
    }
  }

  function handleAnswerKeyDown(event) {
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

      <label className="quiz__answer-line">
        <span className="sr-only">Resposta</span>
        <span className="answer-display" aria-hidden="true">
          {typedAnswer ? (
            <span className="answer-text">{typedAnswer}</span>
          ) : (
            <span className="answer-placeholder">escreve só forma verbal</span>
          )}
          {isCorrect && <span className="check">✓</span>}
          {isWrong && <span className="wrong">×</span>}
        </span>

        <span className="quiz__answer">
          <input
            autoComplete="off"
            autoFocus={autoFocus}
            disabled={!isActive || isResolved}
            inputMode="text"
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
