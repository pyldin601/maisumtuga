import { type CSSProperties, useEffect, useRef, useState } from 'react';

import VerbQuiz from '../VerbQuiz';
import { LeitnerState } from '../../../state';
import { useVerbQuizSession } from './useVerbQuizSession';
import { createQuizStream } from '../../../data/quizStream.ts';
import type { VerbQuizQuestion } from '../../../data/verbTypes.ts';

const nextQuizDelay = 250;
const sessionQuestionLimit = 60;

type RowStyle = CSSProperties & {
  '--row-offset': number;
};

function createSessionQuestions(state: LeitnerState): readonly VerbQuizQuestion[] {
  const quizStream = createQuizStream();
  return quizStream.filter((quiz) => state.isItemDue(quiz)).slice(0, sessionQuestionLimit);
}

export default function VerbQuizSession() {
  const [leitnerState] = useState(() => LeitnerState.fromStorage());
  const [initialQuestions] = useState(() => createSessionQuestions(leitnerState));
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
      leitnerState.moveItemToNextBox(item.question);
    }

    resolveCorrectQuestion(answerId, typedAnswer);
    scheduleNextQuestion();
  }

  function handleWrong(answerId: string, typedAnswer: string): void {
    const item = items.find((currentItem) => currentItem.answer.answerId === answerId);

    if (item) {
      leitnerState.moveItemToFirstBox(item.question);
    }

    resolveWrongQuestion(answerId, typedAnswer);
    scheduleNextQuestion();
  }

  function handleContinue(): void {
    continueSession(createSessionQuestions(leitnerState));
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
              showHints={!isHistory}
              subject={item.question.subjectFull}
              time={item.question.time.fullName}
              timeShortName={item.question.time.shortName}
              translations={item.question.translations}
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
