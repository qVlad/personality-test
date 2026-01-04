import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  text?: string;
}

export default function LoadingSpinner({ text = 'Загрузка...' }: LoadingSpinnerProps): JSX.Element {
  return (
    <div className="loading-spinner" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <span className="loading-text">{text}</span>
    </div>
  );
}
