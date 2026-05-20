import AuthButton from './components/auth/AuthButton';
import VerbQuizSession from './components/quiz/VerbQuizSession';

export default function App() {
  return (
    <main className="page">
      <AuthButton />
      <VerbQuizSession />
    </main>
  );
}
