import { useState } from 'react';

import AppDock from './components/dock/AppDock';
import VerbQuizSession from './components/quiz/VerbQuizSession';
import { useScheduleBootstrap } from './hooks/useScheduleBootstrap.ts';
import { readQuizVerbTimes, readQuizVerbType, type QuizVerbType, writeQuizVerbTimes, writeQuizVerbType } from './state';
import type { VerbTimeShortName } from './data/verbTypes.ts';

const fryHintPeekCountKey = 'maisumtuga.fry.hintPeekCount';
const fryShownKey = 'maisumtuga.fry.shown';
const fryHintPeekThreshold = 5;

function readSessionNumber(key: string): number {
  const value = Number(window.sessionStorage.getItem(key));

  return Number.isFinite(value) ? value : 0;
}

export default function App() {
  const [quizVerbType, setQuizVerbType] = useState(readQuizVerbType);
  const [quizVerbTimes, setQuizVerbTimes] = useState(readQuizVerbTimes);
  const [isFryVisible, setIsFryVisible] = useState(false);
  const scheduleBootstrap = useScheduleBootstrap();

  function handleQuizVerbTypeChange(nextQuizVerbType: QuizVerbType): void {
    setQuizVerbType(nextQuizVerbType);
    writeQuizVerbType(nextQuizVerbType);
  }

  function handleQuizVerbTimesChange(nextQuizVerbTimes: readonly VerbTimeShortName[]): void {
    setQuizVerbTimes(nextQuizVerbTimes);
    writeQuizVerbTimes(nextQuizVerbTimes);
  }

  function handleHintPeek(): void {
    if (window.sessionStorage.getItem(fryShownKey) === 'true') {
      return;
    }

    const nextHintPeekCount = readSessionNumber(fryHintPeekCountKey) + 1;

    window.sessionStorage.setItem(fryHintPeekCountKey, String(nextHintPeekCount));

    if (nextHintPeekCount >= fryHintPeekThreshold) {
      window.sessionStorage.setItem(fryShownKey, 'true');
      setIsFryVisible(true);
    }
  }

  return (
    <main className="page">
      {scheduleBootstrap.status === 'ready' && (
        <>
          {isFryVisible && (
            <img className="fry-peek" src={`${import.meta.env.BASE_URL}fry-meme-bg.png`} alt="" aria-hidden="true" />
          )}
          <AppDock
            onQuizVerbTimesChange={handleQuizVerbTimesChange}
            onQuizVerbTypeChange={handleQuizVerbTypeChange}
            quizVerbTimes={quizVerbTimes}
            quizVerbType={quizVerbType}
          />
          <VerbQuizSession
            leitnerState={scheduleBootstrap.leitnerState}
            onHintPeek={handleHintPeek}
            quizVerbTimes={quizVerbTimes}
            quizVerbType={quizVerbType}
          />
        </>
      )}
    </main>
  );
}
