import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError } from '../services/api';
import type { SessionResponse } from '../../../shared/types/index';
import './HomePage.css';

export default function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingSession, setExistingSession] = useState<SessionResponse | null>(null);

  useEffect(() => {
    checkExistingSession();
  }, []);

  async function checkExistingSession(): Promise<void> {
    try {
      const session = await api.getSession();
      if (session.status === 'in_progress' && session.currentQuestion > 0) {
        setExistingSession(session);
      }
    } catch (err) {
      // No existing session, that's fine
    } finally {
      setLoading(false);
    }
  }

  async function handleStartTest(): Promise<void> {
    setActionLoading(true);
    setError(null);

    try {
      const session = await api.startSession();

      if (session.status === 'completed') {
        navigate('/result');
      } else {
        navigate('/question');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Произошла ошибка. Попробуйте ещё раз.');
      }
      setActionLoading(false);
    }
  }

  async function handleContinueTest(): Promise<void> {
    setActionLoading(true);
    setError(null);

    try {
      navigate('/question');
    } catch (err) {
      setError('Произошла ошибка. Попробуйте ещё раз.');
      setActionLoading(false);
    }
  }

  async function handleRestartTest(): Promise<void> {
    setActionLoading(true);
    setError(null);

    try {
      await api.resetSession();
      setExistingSession(null);
      navigate('/question');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Произошла ошибка. Попробуйте ещё раз.');
      }
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="home-page">
        <div className="card text-center">
          <p className="loading-text">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="card text-center">
        <h1>Тест на тип личности</h1>
        <p className="description">
          Узнайте свой тип личности по методологии MBTI.
          Ответьте на 20 вопросов, чтобы определить один из 16 типов личности.
        </p>

        <div className="info-section">
          <h2>Как это работает?</h2>
          <ul>
            <li>Тест содержит 20 вопросов</li>
            <li>Выберите ответ, который лучше описывает вас</li>
            <li>Вы можете вернуться к предыдущим вопросам</li>
            <li>Ваш прогресс сохраняется автоматически</li>
          </ul>
        </div>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {existingSession ? (
          <div className="session-actions">
            <p className="session-info">
              У вас есть незавершённый тест ({existingSession.currentQuestion} из {existingSession.totalQuestions} вопросов)
            </p>
            <button
              className="btn btn-primary continue-button"
              onClick={handleContinueTest}
              disabled={actionLoading}
              aria-busy={actionLoading}
            >
              {actionLoading ? 'Загрузка...' : 'Продолжить тест'}
            </button>
            <button
              className="btn btn-secondary restart-button"
              onClick={handleRestartTest}
              disabled={actionLoading}
            >
              Начать заново
            </button>
          </div>
        ) : (
          <button
            className="btn btn-primary start-button"
            onClick={handleStartTest}
            disabled={actionLoading}
            aria-busy={actionLoading}
          >
            {actionLoading ? 'Загрузка...' : 'Начать тест'}
          </button>
        )}
      </div>
    </div>
  );
}
