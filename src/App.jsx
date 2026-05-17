import { useEffect, useRef, useState } from 'react';

import VerbQuiz from './components/quiz/VerbQuiz';
import { a2Verbs } from './data/a2IrregularVerbs';

const nextQuizDelay = 250;
const quizStream = a2Verbs.flatMap((verb) =>
  Object.entries(verb.times).flatMap(([time, forms]) =>
    forms.map((form) => ({
      answer: form.form,
      infinitiveForm: verb.infinitive,
      subject: form.subject,
      time,
    }))
  )
);

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
        row.id === rowId ? { ...row, resolved: true } : row
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
          createStreamRow((row.answerIndex + 1) % quizStream.length)
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
          const currentQuiz = quizStream[row.answerIndex];
          const isActive = !row.resolved;
          const isHistory = !isActive && index < rows.length - 1;

          return (
            <section
              className={isHistory ? 'quiz quiz--history' : 'quiz quiz--active'}
              key={row.id}
              style={{
                '--row-offset': index - rows.length + 1,
              }}
            >
              <VerbQuiz
                answer={currentQuiz.answer}
                autoFocus={isActive}
                infinitiveForm={currentQuiz.infinitiveForm}
                isActive={isActive}
                onCorrect={() => handleResolved(row.id)}
                onWrong={() => handleResolved(row.id)}
                subject={currentQuiz.subject}
                time={currentQuiz.time}
              />
            </section>
          );
        })}
      </form>
    </main>
  );
}
