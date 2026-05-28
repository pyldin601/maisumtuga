import { type CSSProperties, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import VerbQuiz from '../VerbQuiz';
import { LeitnerState, type QuizVerbType, type VerbReviewSchedule } from '../../../state';
import { useVerbQuizSession } from './useVerbQuizSession';
import { createQuizStream } from '../../../data/quizStream.ts';
import type { VerbQuizQuestion, VerbTimeShortName } from '../../../data/verbTypes.ts';
import { firebaseAuth } from '../../../firebase.ts';
import {
  loadVerbReviewSchedule,
  patchVerbReviewScheduleItem,
  saveVerbReviewSchedule,
} from '../../../services/verbReviewSchedule.ts';

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
  return quizStream
    .filter((quiz) => selectedVerbTimes.has(quiz.time.shortName) && state.isItemDue(quiz))
    .slice(0, sessionQuestionLimit);
}

function getStoredSchedule(): VerbReviewSchedule {
  return LeitnerState.readFromStorage() ?? { items: {}, updatedAt: 0 };
}

function getHasStoredItems(schedule: VerbReviewSchedule): boolean {
  return Object.keys(schedule.items).length > 0;
}

function getSchedulesHaveSameItems(firstSchedule: VerbReviewSchedule, secondSchedule: VerbReviewSchedule): boolean {
  const firstEntries = Object.entries(firstSchedule.items);
  const secondEntries = Object.entries(secondSchedule.items);

  if (firstEntries.length !== secondEntries.length) {
    return false;
  }

  return firstEntries.every(([key, firstItem]) => {
    const secondItem = secondSchedule.items[key];

    return Boolean(secondItem) && firstItem.box === secondItem.box && firstItem.due === secondItem.due;
  });
}

function createLeitnerState(userId?: string, schedule = getStoredSchedule()): LeitnerState {
  if (!userId) {
    return LeitnerState.fromProgress(schedule.items, undefined, schedule.updatedAt);
  }

  return LeitnerState.fromProgress(
    schedule.items,
    ({ key, updatedAt, value }) => {
      void patchVerbReviewScheduleItem(userId, key, updatedAt, value).catch(() => {
        // Keep local progress authoritative for the current session if remote sync fails.
      });
    },
    schedule.updatedAt
  );
}

async function loadUserSchedule(userId: string): Promise<VerbReviewSchedule> {
  const legacySchedule = LeitnerState.readLegacyFromStorage();

  if (legacySchedule) {
    await saveVerbReviewSchedule(userId, {
      items: legacySchedule.items,
      updatedAt: Date.now(),
    });
    LeitnerState.removeLegacyFromStorage();
  }

  const localSchedule = getStoredSchedule();
  const remoteSchedule = await loadVerbReviewSchedule(userId);

  if (!remoteSchedule) {
    if (localSchedule.updatedAt > 0 || getHasStoredItems(localSchedule)) {
      await saveVerbReviewSchedule(userId, localSchedule);
    }

    return localSchedule;
  }

  if (localSchedule.updatedAt > remoteSchedule.updatedAt) {
    await saveVerbReviewSchedule(userId, localSchedule);
    return localSchedule;
  }

  return remoteSchedule;
}

interface VerbQuizSessionProps {
  quizVerbTimes: readonly VerbTimeShortName[];
  quizVerbType: QuizVerbType;
}

export default function VerbQuizSession({ quizVerbTimes, quizVerbType }: VerbQuizSessionProps) {
  const [leitnerState, setLeitnerState] = useState(() => createLeitnerState());
  const [initialQuestions] = useState(() => createSessionQuestions(leitnerState, quizVerbType, quizVerbTimes));
  const { continueSession, isClosed, items, resolveCorrectQuestion, resolveWrongQuestion, showNextQuestion } =
    useVerbQuizSession(initialQuestions);
  const authLoadIdRef = useRef(0);
  const nextQuizTimeoutRef = useRef<number | null>(null);
  const quizVerbTimesRef = useRef(quizVerbTimes);
  const quizVerbTypeRef = useRef(quizVerbType);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      const authLoadId = authLoadIdRef.current + 1;
      authLoadIdRef.current = authLoadId;

      if (!user) {
        setLeitnerState(createLeitnerState());
        return;
      }

      void loadUserSchedule(user.uid)
        .then((schedule) => {
          if (authLoadIdRef.current !== authLoadId) {
            return;
          }

          const currentSchedule = getStoredSchedule();
          const nextState = createLeitnerState(user.uid, schedule);
          nextState.saveWithUpdatedAt(schedule.updatedAt);
          setLeitnerState(nextState);

          if (!getSchedulesHaveSameItems(currentSchedule, schedule)) {
            continueSession(createSessionQuestions(nextState, quizVerbType, quizVerbTimes));
          }
        })
        .catch(() => {
          if (authLoadIdRef.current !== authLoadId) {
            return;
          }

          setLeitnerState(createLeitnerState(user.uid));
        });
    });

    return () => {
      authLoadIdRef.current += 1;
      unsubscribe();
    };
  }, [continueSession, quizVerbTimes, quizVerbType]);

  useEffect(() => {
    if (quizVerbTypeRef.current === quizVerbType && quizVerbTimesRef.current === quizVerbTimes) {
      return;
    }

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
