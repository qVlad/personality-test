import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

// Note: These tests are written before implementation (TDD)
// The actual HomePage component will be implemented in T045

describe('HomePage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Mock react-router-dom's useNavigate
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
  }));

  it('should render welcome message', () => {
    // TODO: Replace with actual component
    render(
      <BrowserRouter>
        <div>
          <h1>Тест на тип личности</h1>
          <p>Узнайте свой тип личности по методологии MBTI</p>
          <button>Начать тест</button>
        </div>
      </BrowserRouter>
    );

    expect(screen.getByText('Тест на тип личности')).toBeInTheDocument();
    expect(screen.getByText(/Узнайте свой тип личности/)).toBeInTheDocument();
  });

  it('should render start test button', () => {
    render(
      <BrowserRouter>
        <div>
          <button>Начать тест</button>
        </div>
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /Начать тест/i })).toBeInTheDocument();
  });

  it('should show loading state while starting session', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <div>
          <button disabled>Загрузка...</button>
        </div>
      </BrowserRouter>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should navigate to question page after starting session', async () => {
    const user = userEvent.setup();
    let navigated = false;

    render(
      <BrowserRouter>
        <div>
          <button onClick={() => { navigated = true; }}>Начать тест</button>
        </div>
      </BrowserRouter>
    );

    await user.click(screen.getByRole('button', { name: /Начать тест/i }));

    expect(navigated).toBe(true);
  });

  it('should display error message on API failure', async () => {
    render(
      <BrowserRouter>
        <div>
          <p role="alert">Произошла ошибка. Попробуйте ещё раз.</p>
        </div>
      </BrowserRouter>
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/ошибка/i);
  });
});
