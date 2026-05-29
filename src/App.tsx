import { useState } from 'react';

import AppDock from './components/dock/AppDock';
import VerbQuizSession from './components/quiz/VerbQuizSession';
import { useScheduleBootstrap } from './hooks/useScheduleBootstrap.ts';
import { readQuizVerbTimes, readQuizVerbType, type QuizVerbType, writeQuizVerbTimes, writeQuizVerbType } from './state';
import type { VerbTimeShortName } from './data/verbTypes.ts';

export default function App() {
  const [quizVerbType, setQuizVerbType] = useState(readQuizVerbType);
  const [quizVerbTimes, setQuizVerbTimes] = useState(readQuizVerbTimes);
  const scheduleBootstrap = useScheduleBootstrap();

  function handleQuizVerbTypeChange(nextQuizVerbType: QuizVerbType): void {
    setQuizVerbType(nextQuizVerbType);
    writeQuizVerbType(nextQuizVerbType);
  }

  function handleQuizVerbTimesChange(nextQuizVerbTimes: readonly VerbTimeShortName[]): void {
    setQuizVerbTimes(nextQuizVerbTimes);
    writeQuizVerbTimes(nextQuizVerbTimes);
  }

  return (
    <main className="page">
      {scheduleBootstrap.status === 'ready' && (
        <>
          <img className="fry-peek" src={`${import.meta.env.BASE_URL}fry-meme-bg.png`} alt="" aria-hidden="true" />
          <AppDock
            onQuizVerbTimesChange={handleQuizVerbTimesChange}
            onQuizVerbTypeChange={handleQuizVerbTypeChange}
            quizVerbTimes={quizVerbTimes}
            quizVerbType={quizVerbType}
          />
          <VerbQuizSession
            leitnerState={scheduleBootstrap.leitnerState}
            quizVerbTimes={quizVerbTimes}
            quizVerbType={quizVerbType}
          />
        </>
      )}
    </main>
  );
}
