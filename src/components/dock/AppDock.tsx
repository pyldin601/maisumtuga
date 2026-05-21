import AuthButton from '../auth/AuthButton';
import type { QuizVerbType } from '../../state';
import SettingsButton from './SettingsButton';

interface AppDockProps {
  onQuizVerbTypeChange(nextQuizVerbType: QuizVerbType): void;
  quizVerbType: QuizVerbType;
}

export default function AppDock({ onQuizVerbTypeChange, quizVerbType }: AppDockProps) {
  return (
    <nav className="app-dock" aria-label="Aplicacao">
      <AuthButton />
      <SettingsButton onQuizVerbTypeChange={onQuizVerbTypeChange} quizVerbType={quizVerbType} />
    </nav>
  );
}
