import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError } from '../services/api';
import type { ResultResponse } from '../../../shared/types/index';
import './ResultPage.css';

export default function ResultPage(): JSX.Element {
  const navigate = useNavigate();
  const [result, setResult] = useState<ResultResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResult();
  }, []);

  async function loadResult(): Promise<void> {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getResult();
      setResult(response);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.statusCode === 404 || err.statusCode === 400) {
          // No session or test not completed
          navigate('/');
          return;
        }
        setError(err.message);
      } else {
        setError('Ошибка загрузки результата');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRestartTest(): Promise<void> {
    try {
      await api.resetSession();
      navigate('/');
    } catch (err) {
      setError('Ошибка сброса теста');
    }
  }

  if (loading) {
    return (
      <div className="result-page">
        <div className="card">
          <p className="loading-text">Загрузка результата...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="result-page">
        <div className="card">
          <p className="error-message" role="alert">
            {error}
          </p>
          <button className="btn btn-primary" onClick={loadResult}>
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="result-page">
        <div className="card">
          <p>Результат не найден</p>
        </div>
      </div>
    );
  }

  const { personalityType } = result;

  return (
    <div className="result-page">
      <div className="card">
        <div className="result-header">
          <p className="result-label">Ваш тип личности</p>
          <h1 className="personality-code">{personalityType.code}</h1>
          <h2 className="personality-name">{personalityType.name}</h2>
        </div>

        <p className="personality-description">{personalityType.description}</p>

        <div className="traits-section">
          <div className="trait-group">
            <h3>Сильные стороны</h3>
            <ul className="trait-list strengths">
              {personalityType.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>

          <div className="trait-group">
            <h3>Зоны роста</h3>
            <ul className="trait-list growth">
              {personalityType.growthAreas.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="actions">
          <button className="btn btn-secondary" onClick={handleRestartTest}>
            Пройти тест заново
          </button>
        </div>
      </div>
    </div>
  );
}
