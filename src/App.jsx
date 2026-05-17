import { useEffect, useMemo, useState } from "react";

const correctAnswer = "caem";
const promptParts = [
  { text: "vocês/eles/elas " },
  { text: "+", muted: true },
  { text: " cair " },
  { text: "/", muted: true },
  { text: " presente" },
];

function AnimatedPrompt({ parts, speed = 45 }) {
  const [visibleLength, setVisibleLength] = useState(0);
  const text = useMemo(() => parts.map((part) => part.text).join(""), [parts]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reduceMotion.matches) {
      setVisibleLength(text.length);
      return undefined;
    }

    setVisibleLength(0);

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
  }, [speed, text]);

  let remainingCharacters = visibleLength;

  return (
    <p aria-label={text}>
      {parts.map((part) => {
        const visibleText = part.text.slice(0, remainingCharacters);
        remainingCharacters -= visibleText.length;

        if (!visibleText) {
          return null;
        }

        return (
          <span className={part.muted ? "muted" : undefined} key={part.text}>
            {visibleText}
          </span>
        );
      })}
      {visibleLength < text.length && (
        <span className="typing-caret" aria-hidden="true" />
      )}
    </p>
  );
}

export default function App() {
  const [answer, setAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const normalizedAnswer = answer.trim().toLocaleLowerCase("pt-PT");
  const isCorrect = normalizedAnswer === correctAnswer;
  const isWrong = isSubmitted && !isCorrect;
  const isLocked = isCorrect || isWrong;

  function handleAnswerChange(event) {
    setAnswer(event.target.value);
  }

  function handleAnswerKeyDown(event) {
    if (event.key !== "Enter" || !normalizedAnswer || isLocked) {
      return;
    }

    event.preventDefault();
    setIsSubmitted(true);
  }

  return (
    <main className="page">
      <form
        className="quiz"
        aria-label="Portuguese verb quiz"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="quiz__prompt">
          <AnimatedPrompt parts={promptParts} speed={22.5} />
        </div>

        <label className="quiz__answer-line">
          <span className="sr-only">Resposta</span>
          <span className="answer-display" aria-hidden="true">
            {answer ? (
              <span className="answer-text">{answer}</span>
            ) : (
              <span className="answer-placeholder">escreve só forma verbal</span>
            )}
            {isCorrect && <span className="check">✓</span>}
            {isWrong && <span className="wrong">×</span>}
          </span>

          <span className="quiz__answer">
            <input
              autoComplete="off"
              autoFocus
              inputMode="text"
              spellCheck="false"
              type="text"
              value={answer}
              disabled={isLocked}
              onChange={handleAnswerChange}
              onKeyDown={handleAnswerKeyDown}
            />
          </span>
        </label>
      </form>
    </main>
  );
}
