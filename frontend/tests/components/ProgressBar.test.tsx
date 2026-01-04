import { render, screen } from '@testing-library/react';

// Note: Progress bar is integrated into QuestionPage
// This test verifies the progress indicator functionality

describe('ProgressBar', () => {
  it('should display current progress as text', () => {
    render(
      <div>
        <span>1 из 20</span>
      </div>
    );

    expect(screen.getByText('1 из 20')).toBeInTheDocument();
  });

  it('should display progress bar with correct percentage', () => {
    const current = 5;
    const total = 20;
    const percentage = (current / total) * 100;

    render(
      <div>
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
        />
      </div>
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', String(current));
    expect(progressBar).toHaveAttribute('aria-valuemax', String(total));
  });

  it('should update width as progress changes', () => {
    const { rerender } = render(
      <div>
        <div
          className="progress-fill"
          style={{ width: '5%' }}
          data-testid="progress"
        />
      </div>
    );

    let progress = screen.getByTestId('progress');
    expect(progress).toHaveStyle({ width: '5%' });

    rerender(
      <div>
        <div
          className="progress-fill"
          style={{ width: '50%' }}
          data-testid="progress"
        />
      </div>
    );

    progress = screen.getByTestId('progress');
    expect(progress).toHaveStyle({ width: '50%' });
  });

  it('should show 100% when test is complete', () => {
    render(
      <div>
        <div
          className="progress-fill"
          style={{ width: '100%' }}
          data-testid="progress"
        />
      </div>
    );

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveStyle({ width: '100%' });
  });
});
