import './LoadingSpinner.scss';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
}

export function LoadingSpinner({ size = 32, message }: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner" role="status" aria-label="Loading">
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="loading-spinner__track"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="loading-spinner__arc"
        />
      </svg>
      {message && <p>{message}</p>}
    </div>
  );
}
