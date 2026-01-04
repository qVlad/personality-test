import type { AnswerValue } from '../../../shared/types/question';
import './AnswerOption.css';

interface AnswerOptionProps {
  text: string;
  optionValue: AnswerValue;
  isSelected: boolean;
  onSelect: (value: AnswerValue) => void;
  disabled?: boolean;
}

export default function AnswerOption({
  text,
  optionValue,
  isSelected,
  onSelect,
  disabled = false,
}: AnswerOptionProps): JSX.Element {
  function handleClick(): void {
    if (!disabled) {
      onSelect(optionValue);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <button
      className={`answer-option ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-pressed={isSelected}
      type="button"
    >
      <span className="answer-indicator" aria-hidden="true">
        {isSelected ? '●' : '○'}
      </span>
      <span className="answer-text">{text}</span>
    </button>
  );
}
