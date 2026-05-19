import { type CSSProperties, useEffect, useRef, useState } from 'react';

import { a2Verbs } from '../../../data/a2IrregularVerbs';
import { LeitnerState } from '../../../state';
import VerbQuiz from '../VerbQuiz';
import { type VerbQuizSessionQuestion, useVerbQuizSession } from './useVerbQuizSession';

const nextQuizDelay = 250;
const sessionQuestionLimit = 60;
const quizStream: readonly VerbQuizSessionQuestion[] = a2Verbs.flatMap((verb) =>
  Object.entries(verb.times).flatMap(([time, forms]) =>
    forms.map((form) => ({
      correctAnswer: form.form,
      infinitiveForm: verb.infinitive,
      subjectFull: form.subjectFull,
      subjectShort: form.subjectShort,
      time,
    }))
  )
);

type RowStyle = CSSProperties & {
  '--row-offset': number;
};

function createSessionQuestions(): readonly VerbQuizSessionQuestion[] {
  const state = LeitnerState.fromStorage();

  return quizStream.filter((quiz) => state.isItemDue(quiz)).slice(0, sessionQuestionLimit);
}

export default function VerbQuizSession() {
  const [initialQuestions] = useState(createSessionQuestions);
  const { continueSession, isClosed, items, resolveCorrectQuestion, resolveWrongQuestion, showNextQuestion } =
    useVerbQuizSession(initialQuestions);
  const nextQuizTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (nextQuizTimeoutRef.current) {
        window.clearTimeout(nextQuizTimeoutRef.current);
      }
    };
  }, []);

  function scheduleNextQuestion(): void {
    nextQuizTimeoutRef.current = window.setTimeout(() => {
      showNextQuestion();
    }, nextQuizDelay);
  }

  function handleCorrect(answerId: string, typedAnswer: string): void {
    const item = items.find((currentItem) => currentItem.answer.answerId === answerId);

    if (item) {
      LeitnerState.fromStorage().moveItemToNextBox(item.question);
    }

    resolveCorrectQuestion(answerId, typedAnswer);
    scheduleNextQuestion();
  }

  function handleWrong(answerId: string, typedAnswer: string): void {
    const item = items.find((currentItem) => currentItem.answer.answerId === answerId);

    if (item) {
      LeitnerState.fromStorage().moveItemToFirstBox(item.question);
    }

    resolveWrongQuestion(answerId, typedAnswer);
    scheduleNextQuestion();
  }

  function handleContinue(): void {
    continueSession(createSessionQuestions());
  }

  const rowCount = items.length + (isClosed ? 1 : 0);

  return (
    <form className="quiz-flow" aria-label="Portuguese verb quiz" onSubmit={(event) => event.preventDefault()}>
      {items.map((item, index) => {
        const isActive = item.answer.answerStatus === 'pending';
        const isHistory = !isActive && (isClosed || index < items.length - 1);

        return (
          <section
            className={isHistory ? 'quiz quiz--history' : 'quiz quiz--active'}
            key={item.answer.answerId}
            style={
              {
                '--row-offset': index - rowCount + 1,
              } as RowStyle
            }
          >
            <VerbQuiz
              answer={item.question.correctAnswer}
              autoFocus={isActive}
              infinitiveForm={item.question.infinitiveForm}
              isActive={isActive}
              onCorrect={(result) => handleCorrect(item.answer.answerId, result.answer)}
              onWrong={(result) => handleWrong(item.answer.answerId, result.answer)}
              subject={item.question.subjectFull}
              time={item.question.time}
            />
          </section>
        );
      })}

      {isClosed && (
        <section
          className="quiz quiz--active session-closed"
          style={
            {
              '--row-offset': 0,
            } as RowStyle
          }
        >
          <p>por agora, está feito</p>
          <button type="button" onClick={handleContinue}>
            continuar
          </button>
        </section>
      )}
    </form>
  );
}
