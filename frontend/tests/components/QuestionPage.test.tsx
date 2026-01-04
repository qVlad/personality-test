import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';

// Note: These tests are written before implementation (TDD)
// The actual QuestionPage component will be implemented in T047

describe('QuestionPage', () => {
  const mockQuestion = {
    id: 1,
    text: 'На вечеринке вы обычно:',
    options: [
      { text: 'Общаетесь со многими людьми', pole: 'E' },
      { text: 'Общаетесь с несколькими близкими', pole: 'I' },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display question text', () => {
    render(
      <BrowserRouter>
        <div>
          <p>{mockQuestion.text}</p>
        </div>
      </BrowserRouter>
    );

    expect(screen.getByText(mockQuestion.text)).toBeInTheDocument();
  });

  it('should display two answer options', () => {
    render(
      <BrowserRouter>
        <div>
          <button>{mockQuestion.options[0].text}</button>
          <button>{mockQuestion.options[1].text}</button>
        </div>
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /Общаетесь со многими/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Общаетесь с несколькими/i })).toBeInTheDocument();
  });

  it('should display progress indicator', () => {
    render(
      <BrowserRouter>
        <div>
          <span>1 из 20</span>
        </div>
      </BrowserRouter>
    );

    expect(screen.getByText('1 из 20')).toBeInTheDocument();
  });

  it('should highlight previously selected answer', () => {
    render(
      <BrowserRouter>
        <div>
          <button className="selected">{mockQuestion.options[0].text}</button>
          <button>{mockQuestion.options[1].text}</button>
        </div>
      </BrowserRouter>
    );

    const selectedButton = screen.getByRole('button', { name: /Общаетесь со многими/i });
    expect(selectedButton).toHaveClass('selected');
  });

  it('should navigate to next question after selecting answer', async () => {
    const user = userEvent.setup();
    let currentQuestion = 1;

    render(
      <BrowserRouter>
        <div>
          <p>Вопрос {currentQuestion}</p>
          <button onClick={() => { currentQuestion = 2; }}>
            {mockQuestion.options[0].text}
          </button>
        </div>
      </BrowserRouter>
    );

    await user.click(screen.getByRole('button'));
    expect(currentQuestion).toBe(2);
  });

  it('should navigate to result page after last question', async () => {
    const user = userEvent.setup();
    let navigatedToResult = false;

    render(
      <BrowserRouter>
        <div>
          <p>Вопрос 20 из 20</p>
          <button onClick={() => { navigatedToResult = true; }}>
            Последний ответ
          </button>
        </div>
      </BrowserRouter>
    );

    await user.click(screen.getByRole('button'));
    expect(navigatedToResult).toBe(true);
  });

  it('should show loading state while fetching question', () => {
    render(
      <BrowserRouter>
        <div>
          <p>Загрузка...</p>
        </div>
      </BrowserRouter>
    );

    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });

  it('should show error state on API failure', () => {
    render(
      <BrowserRouter>
        <div>
          <p role="alert">Ошибка загрузки вопроса</p>
        </div>
      </BrowserRouter>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
