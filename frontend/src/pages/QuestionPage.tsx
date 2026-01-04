import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, ApiError } from '../services/api';
import AnswerOption from '../components/AnswerOption';
import BackButton from '../components/BackButton';
import type { QuestionResponse, Pole } from '../../../shared/types/index';
import './QuestionPage.css';

export default function QuestionPage(): JSX.Element {
  const navigate = useNavigate();
  const { questionId } = useParams<{ questionId?: string }>();

  const [questionData, setQuestionData] = useState<QuestionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [navigatingBack, setNavigatingBack] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<Pole | null>(null);

  useEffect(() => {
    loadQuestion();
  }, [questionId]);

  async function loadQuestion(): Promise<void> {
    setLoading(true);
    setError(null);

    try {
      let response: QuestionResponse;

      if (questionId) {
        response = await api.getQuestion(parseInt(questionId, 10));
      } else {
        response = await api.getCurrentQuestion();
      }

      setQuestionData(response);
      setSelectedAnswer(response.previousAnswer);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.statusCode === 404) {
          // No session, redirect to home
          navigate('/');
          return;
        }
        if (err.statusCode === 400 && err.message.includes('completed')) {
          // Test completed, go to result
          navigate('/result');
          return;
        }
        setError(err.message);
      } else {
        setError('Ошибка загрузки вопроса');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectAnswer(pole: Pole): Promise<void> {
    if (!questionData || submitting) return;

    setSelectedAnswer(pole);
    setSubmitting(true);
    setError(null);

    try {
      const response = await api.submitAnswer({
        questionId: questionData.question.id,
        selectedPole: pole,
      });

      if ('completed' in response && response.completed) {
        // Test completed
        navigate('/result');
      } else {
        // Navigate to next question
        setQuestionData(response);
        setSelectedAnswer(response.previousAnswer);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Ошибка сохранения ответа');
      }
      // Revert selection on error
      setSelectedAnswer(questionData.previousAnswer);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="question-page">
        <div className="card">
          <p className="loading-text">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error && !questionData) {
    return (
      <div className="question-page">
        <div className="card">
          <p className="error-message" role="alert">
            {error}
          </p>
          <button className="btn btn-primary" onClick={loadQuestion}>
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!questionData) {
    return (
      <div className="question-page">
        <div className="card">
          <p>Вопрос не найден</p>
        </div>
      </div>
    );
  }

  const { question, currentIndex, totalQuestions } = questionData;
  const isFirstQuestion = currentIndex === 0;

  async function handleBack(): Promise<void> {
    if (isFirstQuestion || navigatingBack) return;

    setNavigatingBack(true);
    setError(null);

    try {
      const prevQuestionId = question.id - 1;
      const response = await api.getQuestion(prevQuestionId);
      setQuestionData(response);
      setSelectedAnswer(response.previousAnswer);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Ошибка при возврате к предыдущему вопросу');
      }
    } finally {
      setNavigatingBack(false);
    }
  }

  return (
    <div className="question-page">
      <div className="card">
        <div className="question-header">
          <div className="back-button-container">
            {!isFirstQuestion && (
              <BackButton
                onClick={handleBack}
                disabled={submitting || navigatingBack}
              />
            )}
          </div>
          <div className="progress-info">
            <span className="progress-text">
              {currentIndex + 1} из {totalQuestions}
            </span>
          </div>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            role="progressbar"
            aria-valuenow={currentIndex + 1}
            aria-valuemin={0}
            aria-valuemax={totalQuestions}
          />
        </div>

        <h2 className="question-text">{question.text}</h2>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        <div className="answers-container">
          {question.options.map((option) => (
            <AnswerOption
              key={option.pole}
              text={option.text}
              pole={option.pole}
              isSelected={selectedAnswer === option.pole}
              onSelect={handleSelectAnswer}
              disabled={submitting || navigatingBack}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
