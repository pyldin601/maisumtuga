import { useState } from 'react';

import AppDock from './components/dock/AppDock';
import VerbQuizSession from './components/quiz/VerbQuizSession';
import { readQuizVerbType, writeQuizVerbType, type QuizVerbType } from './state';

export default function App() {
  const [quizVerbType, setQuizVerbType] = useState(readQuizVerbType);

  function handleQuizVerbTypeChange(nextQuizVerbType: QuizVerbType): void {
    setQuizVerbType(nextQuizVerbType);
    writeQuizVerbType(nextQuizVerbType);
  }

  return (
    <main className="page">
      <AppDock onQuizVerbTypeChange={handleQuizVerbTypeChange} quizVerbType={quizVerbType} />
      <VerbQuizSession quizVerbType={quizVerbType} />
    </main>
  );
}
