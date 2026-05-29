import { useEffect, useId, useRef, useState } from 'react';
import { quizVerbTimeOptions, type QuizVerbType } from '../../state';
import { a2VerbTimes } from '../../data/verbTime.ts';
import type { VerbTimeShortName } from '../../data/verbTypes.ts';

const verbTypeOptions = [
  { label: 'regular', value: 'regular' },
  { label: 'irregular', value: 'irregular' },
  { label: 'both', value: 'both' },
] as const;

interface SettingsButtonProps {
  onQuizVerbTimesChange(nextQuizVerbTimes: readonly VerbTimeShortName[]): void;
  onQuizVerbTypeChange(nextQuizVerbType: QuizVerbType): void;
  quizVerbTimes: readonly VerbTimeShortName[];
  quizVerbType: QuizVerbType;
}

export default function SettingsButton({
  onQuizVerbTimesChange,
  onQuizVerbTypeChange,
  quizVerbTimes,
  quizVerbType,
}: SettingsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement | null>(null);
  const popoverId = useId();

  function handleQuizVerbTimeChange(verbTime: VerbTimeShortName): void {
    const hasVerbTime = quizVerbTimes.includes(verbTime);

    if (hasVerbTime && quizVerbTimes.length === 1) {
      return;
    }

    const nextQuizVerbTimes = hasVerbTime
      ? quizVerbTimes.filter((currentVerbTime) => currentVerbTime !== verbTime)
      : quizVerbTimeOptions.filter(
          (currentVerbTime) => currentVerbTime === verbTime || quizVerbTimes.includes(currentVerbTime)
        );

    onQuizVerbTimesChange(nextQuizVerbTimes);
  }

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent): void => {
      if (settingsRef.current?.contains(event.target as Node)) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen]);

  return (
    <div className="settings" ref={settingsRef}>
      {isOpen && (
        <div className="settings-popover" id={popoverId} aria-label="formas" role="group">
          <div className="settings-popover__section">
            <p className="settings-popover__title">verbos:</p>
            {verbTypeOptions.map((option) => (
              <label className="settings-option" key={option.value}>
                <input
                  type="radio"
                  name="verb-type"
                  value={option.value}
                  checked={quizVerbType === option.value}
                  onChange={() => onQuizVerbTypeChange(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          <div className="settings-popover__section">
            <p className="settings-popover__title">tempos:</p>
            {quizVerbTimeOptions.map((verbTime) => (
              <label className="settings-option" key={verbTime}>
                <input
                  type="checkbox"
                  name="verb-time"
                  value={verbTime}
                  checked={quizVerbTimes.includes(verbTime)}
                  disabled={quizVerbTimes.includes(verbTime) && quizVerbTimes.length === 1}
                  onChange={() => handleQuizVerbTimeChange(verbTime)}
                />
                <span>{a2VerbTimes[verbTime].fullName}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      <button
        className="dock__button"
        type="button"
        aria-label="Definições"
        aria-controls={popoverId}
        aria-expanded={isOpen}
        data-tooltip="definições"
        onClick={() => setIsOpen((nextIsOpen) => !nextIsOpen)}
      >
        <svg className="dock__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Z" />
          <path d="m19.1 13.4.1-1.4-.1-1.4 2-1.5-2-3.4-2.5 1a9.3 9.3 0 0 0-2.4-1.4L13.8 2h-3.7l-.4 3.3a9.3 9.3 0 0 0-2.4 1.4l-2.5-1-2 3.4 2 1.5-.1 1.4.1 1.4-2 1.5 2 3.4 2.5-1a9.3 9.3 0 0 0 2.4 1.4l.4 3.3h3.7l.4-3.3a9.3 9.3 0 0 0 2.4-1.4l2.5 1 2-3.4-2-1.5Z" />
        </svg>
      </button>
    </div>
  );
}
