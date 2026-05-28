import AuthButton from '../auth/AuthButton';
import type { QuizVerbType } from '../../state';
import SettingsButton from './SettingsButton';
import type { VerbTimeShortName } from '../../data/verbTypes.ts';

interface AppDockProps {
  onQuizVerbTimesChange(nextQuizVerbTimes: readonly VerbTimeShortName[]): void;
  onQuizVerbTypeChange(nextQuizVerbType: QuizVerbType): void;
  quizVerbTimes: readonly VerbTimeShortName[];
  quizVerbType: QuizVerbType;
}

export default function AppDock({
  onQuizVerbTimesChange,
  onQuizVerbTypeChange,
  quizVerbTimes,
  quizVerbType,
}: AppDockProps) {
  return (
    <nav className="app-dock" aria-label="Aplicacao">
      <AuthButton />
      <SettingsButton
        onQuizVerbTimesChange={onQuizVerbTimesChange}
        onQuizVerbTypeChange={onQuizVerbTypeChange}
        quizVerbTimes={quizVerbTimes}
        quizVerbType={quizVerbType}
      />
    </nav>
  );
}
