import { type CSSProperties, useEffect, useRef, useState } from 'react';

import VerbQuiz from '../VerbQuiz';
import { LeitnerState, type QuizVerbType } from '../../../state';
import { useVerbQuizSession } from './useVerbQuizSession';
import { createQuizStream } from '../../../data/quizStream.ts';
import type { VerbQuizQuestion, VerbTimeShortName } from '../../../data/verbTypes.ts';

const nextQuizDelay = 250;
const sessionQuestionLimit = 60;

type RowStyle = CSSProperties & {
  '--row-offset': number;
};

function createSessionQuestions(
  state: LeitnerState,
  quizVerbType: QuizVerbType,
  quizVerbTimes: readonly VerbTimeShortName[]
): readonly VerbQuizQuestion[] {
  const selectedVerbTimes = new Set(quizVerbTimes);
  const quizStream = createQuizStream(quizVerbType);
  const dueQuestions: VerbQuizQuestion[] = [];
  const newQuestions: VerbQuizQuestion[] = [];

  quizStream.forEach((quiz) => {
    if (!selectedVerbTimes.has(quiz.time.shortName)) {
      return;
    }

    const progress = state.getItemProgress(quiz);

    if (!progress) {
      newQuestions.push(quiz);
      return;
    }

    if (Date.now() >= progress.due) {
      dueQuestions.push(quiz);
    }
  });

  return [...dueQuestions, ...newQuestions].slice(0, sessionQuestionLimit);
}

interface VerbQuizSessionProps {
  leitnerState: LeitnerState;
  quizVerbTimes: readonly VerbTimeShortName[];
  quizVerbType: QuizVerbType;
}

export default function VerbQuizSession({ leitnerState, quizVerbTimes, quizVerbType }: VerbQuizSessionProps) {
  const [initialQuestions] = useState(() => createSessionQuestions(leitnerState, quizVerbType, quizVerbTimes));
  const { continueSession, isClosed, items, resolveCorrectQuestion, resolveWrongQuestion, showNextQuestion } =
    useVerbQuizSession(initialQuestions);
  const nextQuizTimeoutRef = useRef<number | null>(null);
  const leitnerStateRef = useRef(leitnerState);
  const quizVerbTimesRef = useRef(quizVerbTimes);
  const quizVerbTypeRef = useRef(quizVerbType);

  useEffect(() => {
    if (
      leitnerStateRef.current === leitnerState &&
      quizVerbTypeRef.current === quizVerbType &&
      quizVerbTimesRef.current === quizVerbTimes
    ) {
      return;
    }

    leitnerStateRef.current = leitnerState;
    quizVerbTypeRef.current = quizVerbType;
    quizVerbTimesRef.current = quizVerbTimes;

    if (nextQuizTimeoutRef.current) {
      window.clearTimeout(nextQuizTimeoutRef.current);
      nextQuizTimeoutRef.current = null;
    }

    continueSession(createSessionQuestions(leitnerState, quizVerbType, quizVerbTimes));
  }, [continueSession, leitnerState, quizVerbTimes, quizVerbType]);

  useEffect(() => {
    return () => {
      // Prevent pending UI timers from appending questions after unmount.
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
    continueSession(createSessionQuestions(leitnerState, quizVerbType, quizVerbTimes));
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
