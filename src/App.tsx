import { type CSSProperties, useEffect, useRef, useState } from 'react';

import VerbQuiz from './components/quiz/VerbQuiz';
import { a2Verbs } from './data/a2IrregularVerbs';
import { LeitnerState } from './state';

const nextQuizDelay = 250;
const quizStream = a2Verbs.flatMap((verb) =>
  Object.entries(verb.times).flatMap(([time, forms]) =>
    forms.map((form) => ({
      answer: form.form,
      infinitiveForm: verb.infinitive,
      subjectFull: form.subjectFull,
      subjectShort: form.subjectShort,
      time,
    }))
  )
);

type StreamRow = {
  answerIndex: number;
  id: string;
  resolved: boolean;
};

type RowStyle = CSSProperties & {
  '--row-offset': number;
};

function createStreamRow(answerIndex = 0): StreamRow {
  return {
    answerIndex,
    id: crypto.randomUUID(),
    resolved: false,
  };
}

const state = LeitnerState.fromStorage();
const quizzes = quizStream.filter((quiz) => state.isItemDue(quiz));

export default function App() {
  const [rows, setRows] = useState(() => [createStreamRow()]);
  const nextQuizTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (nextQuizTimeoutRef.current) {
        window.clearTimeout(nextQuizTimeoutRef.current);
      }
    };
  }, []);

  function handleResolved(rowId: string): void {
    setRows((currentRows) => currentRows.map((row) => (row.id === rowId ? { ...row, resolved: true } : row)));

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

        return currentRows.concat(createStreamRow((row.answerIndex + 1) % quizzes.length));
      });
    }, nextQuizDelay);
  }

  function handleCorrect(rowId: string): void {
    const row = rows.find((item) => item.id === rowId);
    if (row) {
      const item = quizzes[row.answerIndex];
      state.moveItemToNextBox(item);
    }
    handleResolved(rowId);
  }

  function handleWrong(rowId: string): void {
    const row = rows.find((item) => item.id === rowId);
    if (row) {
      const item = quizzes[row.answerIndex];
      state.moveItemToFirstBox(item);
    }
    handleResolved(rowId);
  }

  return (
    <main className="page">
      <form className="quiz-flow" aria-label="Portuguese verb quiz" onSubmit={(event) => event.preventDefault()}>
        {rows.map((row, index) => {
          const currentQuiz = quizzes[row.answerIndex];
          const isActive = !row.resolved;
          const isHistory = !isActive && index < rows.length - 1;

          return (
            <section
              className={isHistory ? 'quiz quiz--history' : 'quiz quiz--active'}
              key={row.id}
              style={
                {
                  '--row-offset': index - rows.length + 1,
                } as RowStyle
              }
            >
              <VerbQuiz
                answer={currentQuiz.answer}
                autoFocus={isActive}
                infinitiveForm={currentQuiz.infinitiveForm}
                isActive={isActive}
                onCorrect={() => handleCorrect(row.id)}
                onWrong={() => handleWrong(row.id)}
                subject={currentQuiz.subjectFull}
                time={currentQuiz.time}
              />
            </section>
          );
        })}
      </form>
    </main>
  );
}
