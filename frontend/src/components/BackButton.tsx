import './BackButton.css';

interface BackButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function BackButton({ onClick, disabled = false }: BackButtonProps): JSX.Element {
  return (
    <button
      className="back-button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Вернуться к предыдущему вопросу"
      type="button"
    >
      <span className="back-arrow" aria-hidden="true">←</span>
      <span className="back-text">Назад</span>
    </button>
  );
}
