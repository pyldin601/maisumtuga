import { useEffect, useMemo, useRef, useState } from "react";

const nextQuizDelay = 250;
const quizzes = [
  { subject: "eu", answer: "caio" },
  { subject: "tu", answer: "cais" },
  { subject: "você/ele/ela", answer: "cai" },
  { subject: "nós", answer: "caímos" },
  { subject: "vocês/eles/elas", answer: "caem" },
];

function getPromptParts(quiz) {
  return [
    { text: `${quiz.subject} ` },
    { text: "+", muted: true },
    { text: " cair " },
    { text: "/", muted: true },
    { text: " presente" },
  ];
}

function normalizeAnswer(value) {
  return value
    .trim()
    .toLocaleLowerCase("pt-PT")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

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

function StaticPrompt({ parts }) {
  return (
    <p>
      {parts.map((part) => (
        <span className={part.muted ? "muted" : undefined} key={part.text}>
          {part.text}
        </span>
      ))}
    </p>
  );
}

function createQuizRow(quizIndex = 0) {
  return {
    answer: "",
    id: crypto.randomUUID(),
    quizIndex,
    status: "active",
  };
}

export default function App() {
  const [rows, setRows] = useState(() => [createQuizRow()]);
  const activeInputRef = useRef(null);
  const nextQuizTimeoutRef = useRef(null);

  useEffect(() => {
    activeInputRef.current?.focus();
  }, [rows.length]);

  useEffect(() => {
    return () => {
      window.clearTimeout(nextQuizTimeoutRef.current);
    };
  }, []);

  function finishRow(rowId, answer, status) {
    setRows((currentRows) => {
      const row = currentRows.find((item) => item.id === rowId);

      if (!row || row.status !== "active") {
        return currentRows;
      }

      return currentRows
        .map((item) =>
          item.id === rowId
            ? {
                ...item,
                answer,
                status,
              }
            : item
        );
    });

    nextQuizTimeoutRef.current = window.setTimeout(() => {
      setRows((currentRows) => {
        const row = currentRows.find((item) => item.id === rowId);

        if (!row || row.status === "active") {
          return currentRows;
        }

        const hasActiveRow = currentRows.some((item) => item.status === "active");

        if (hasActiveRow) {
          return currentRows;
        }

        return currentRows.concat(
          createQuizRow((row.quizIndex + 1) % quizzes.length)
        );
      });
    }, nextQuizDelay);
  }

  function handleAnswerChange(rowId, value) {
    const normalizedValue = normalizeAnswer(value);

    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              answer: value,
            }
          : row
      )
    );

    const row = rows.find((item) => item.id === rowId);

    if (!row) {
      return;
    }

    const correctAnswer = quizzes[row.quizIndex].answer;

    if (normalizedValue === normalizeAnswer(correctAnswer)) {
      finishRow(rowId, correctAnswer, "correct");
    }
  }

  function handleAnswerKeyDown(event, row) {
    if (event.key !== "Enter" || !row.answer.trim() || row.status !== "active") {
      return;
    }

    event.preventDefault();
    finishRow(row.id, row.answer, "wrong");
  }

  return (
    <main className="page">
      <form
        className="quiz-flow"
        aria-label="Portuguese verb quiz"
        onSubmit={(event) => event.preventDefault()}
      >
        {rows.map((row, index) => {
          const quiz = quizzes[row.quizIndex];
          const promptParts = getPromptParts(quiz);
          const isActive = row.status === "active";
          const isHistory = !isActive && index < rows.length - 1;
          const isCorrect = row.status === "correct";
          const isWrong = row.status === "wrong";

          return (
            <section
              className={isHistory ? "quiz quiz--history" : "quiz quiz--active"}
              key={row.id}
              style={{ "--row-offset": index - rows.length + 1 }}
            >
              <div className="quiz__prompt">
                {isActive ? (
                  <AnimatedPrompt parts={promptParts} speed={22.5} />
                ) : (
                  <StaticPrompt parts={promptParts} />
                )}
              </div>

              <label className="quiz__answer-line">
                <span className="sr-only">Resposta</span>
                <span className="answer-display" aria-hidden="true">
                  {row.answer ? (
                    <span className="answer-text">{row.answer}</span>
                  ) : (
                    <span className="answer-placeholder">
                      escreve só forma verbal
                    </span>
                  )}
                  {isCorrect && <span className="check">✓</span>}
                  {isWrong && <span className="wrong">×</span>}
                </span>

                <span className="quiz__answer">
                  <input
                    autoComplete="off"
                    autoFocus={isActive}
                    disabled={!isActive}
                    inputMode="text"
                    ref={isActive ? activeInputRef : null}
                    spellCheck="false"
                    type="text"
                    value={row.answer}
                    onChange={(event) =>
                      handleAnswerChange(row.id, event.target.value)
                    }
                    onKeyDown={(event) => handleAnswerKeyDown(event, row)}
                  />
                </span>
              </label>
            </section>
          );
        })}
      </form>
    </main>
  );
}
