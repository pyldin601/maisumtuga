import { useState } from 'react';

import AppDock from './components/dock/AppDock';
import VerbQuizSession from './components/quiz/VerbQuizSession';
import { readQuizVerbTimes, readQuizVerbType, writeQuizVerbTimes, writeQuizVerbType, type QuizVerbType } from './state';
import type { VerbTimeShortName } from './data/verbTypes.ts';

export default function App() {
  const [quizVerbType, setQuizVerbType] = useState(readQuizVerbType);
  const [quizVerbTimes, setQuizVerbTimes] = useState(readQuizVerbTimes);

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
      <AppDock
        onQuizVerbTimesChange={handleQuizVerbTimesChange}
        onQuizVerbTypeChange={handleQuizVerbTypeChange}
        quizVerbTimes={quizVerbTimes}
        quizVerbType={quizVerbType}
      />
      <VerbQuizSession quizVerbTimes={quizVerbTimes} quizVerbType={quizVerbType} />
    </main>
  );
}
