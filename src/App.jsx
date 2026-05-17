import { useEffect, useRef, useState } from "react";
import VerbQuiz from "./components/quiz/VerbQuiz";

const nextQuizDelay = 250;
const cairPresentAnswers = [
  { subject: "eu", answer: "caio" },
  { subject: "tu", answer: "cais" },
  { subject: "você/ele/ela", answer: "cai" },
  { subject: "nós", answer: "caímos" },
  { subject: "vocês/eles/elas", answer: "caem" },
];

function createStreamRow(answerIndex = 0) {
  return {
    answerIndex,
    id: crypto.randomUUID(),
    resolved: false,
  };
}

export default function App() {
  const [rows, setRows] = useState(() => [createStreamRow()]);
  const nextQuizTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      window.clearTimeout(nextQuizTimeoutRef.current);
    };
  }, []);

  function handleResolved(rowId) {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              resolved: true,
            }
          : row
      )
    );

    nextQuizTimeoutRef.current = window.setTimeout(() => {
      setRows((currentRows) => {
        const row = currentRows.find((item) => item.id === rowId);

        if (!row) {
          return currentRows;
        }

        const hasActiveRow = currentRows.some((item) => !item.resolved);

        if (hasActiveRow) {
          return currentRows;
        }

        return currentRows.concat(
          createStreamRow((row.answerIndex + 1) % cairPresentAnswers.length)
        );
      });
    }, nextQuizDelay);
  }

  return (
    <main className="page">
      <form
        className="quiz-flow"
        aria-label="Portuguese verb quiz"
        onSubmit={(event) => event.preventDefault()}
      >
        {rows.map((row, index) => {
          const currentAnswer = cairPresentAnswers[row.answerIndex];
          const isActive = !row.resolved;
          const isHistory = !isActive && index < rows.length - 1;

          return (
            <section
              className={isHistory ? "quiz quiz--history" : "quiz quiz--active"}
              key={row.id}
              style={{ "--row-offset": index - rows.length + 1 }}
            >
              <VerbQuiz
                answer={currentAnswer.answer}
                autoFocus={isActive}
                infinitiveForm="cair"
                isActive={isActive}
                onCorrect={() => handleResolved(row.id)}
                onWrong={() => handleResolved(row.id)}
                subject={currentAnswer.subject}
                time="presente"
              />
            </section>
          );
        })}
      </form>
    </main>
  );
}
