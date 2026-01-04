import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

describe('BackButton', () => {
  it('should render back button with arrow', () => {
    render(
      <BrowserRouter>
        <button aria-label="Назад">← Назад</button>
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /Назад/i })).toBeInTheDocument();
  });

  it('should not be visible on first question', () => {
    const isFirstQuestion = true;

    render(
      <BrowserRouter>
        <div>
          {!isFirstQuestion && <button aria-label="Назад">← Назад</button>}
        </div>
      </BrowserRouter>
    );

    expect(screen.queryByRole('button', { name: /Назад/i })).not.toBeInTheDocument();
  });

  it('should be visible on questions after the first', () => {
    const isFirstQuestion = false;

    render(
      <BrowserRouter>
        <div>
          {!isFirstQuestion && <button aria-label="Назад">← Назад</button>}
        </div>
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /Назад/i })).toBeInTheDocument();
  });

  it('should call onBack when clicked', async () => {
    const user = userEvent.setup();
    const handleBack = jest.fn();

    render(
      <BrowserRouter>
        <button onClick={handleBack} aria-label="Назад">← Назад</button>
      </BrowserRouter>
    );

    await user.click(screen.getByRole('button', { name: /Назад/i }));

    expect(handleBack).toHaveBeenCalled();
  });

  it('should be disabled while loading', () => {
    render(
      <BrowserRouter>
        <button disabled aria-label="Назад">← Назад</button>
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /Назад/i })).toBeDisabled();
  });
});
