import { useEffect, useId, useRef, useState } from 'react';
import type { QuizVerbType } from '../../state';

const verbTypeOptions = [
  { label: 'regular', value: 'regular' },
  { label: 'irregular', value: 'irregular' },
  { label: 'both', value: 'both' },
] as const;

interface SettingsButtonProps {
  onQuizVerbTypeChange(nextQuizVerbType: QuizVerbType): void;
  quizVerbType: QuizVerbType;
}

export default function SettingsButton({ onQuizVerbTypeChange, quizVerbType }: SettingsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement | null>(null);
  const popoverId = useId();

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
        <div className="settings-popover" id={popoverId} role="group" aria-label="verbos">
          <p className="settings-popover__title">verbos:</p>
          <div className="settings-popover__options">
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
        </div>
      )}
      <button
        className="dock__button"
        type="button"
        aria-label="Definicoes"
        aria-controls={popoverId}
        aria-expanded={isOpen}
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
