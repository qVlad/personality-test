import type {
  SessionResponse,
  QuestionResponse,
  ResultResponse,
  AnswerRequest,
  TestCompletedResponse,
  ErrorResponse,
} from '../../../shared/types/session.js';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

class ApiError extends Error {
  public statusCode: number;
  public response: ErrorResponse;

  constructor(statusCode: number, response: ErrorResponse) {
    super(response.message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = (await response.json()) as ErrorResponse;
    throw new ApiError(response.status, errorData);
  }
  return response.json() as Promise<T>;
}

export const api = {
  async startSession(): Promise<SessionResponse> {
    const response = await fetch(`${API_BASE}/session`, {
      method: 'POST',
      credentials: 'include',
    });
    return handleResponse<SessionResponse>(response);
  },

  async getSession(): Promise<SessionResponse> {
    const response = await fetch(`${API_BASE}/session`, {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse<SessionResponse>(response);
  },

  async resetSession(): Promise<SessionResponse> {
    const response = await fetch(`${API_BASE}/session`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return handleResponse<SessionResponse>(response);
  },

  async getCurrentQuestion(): Promise<QuestionResponse> {
    const response = await fetch(`${API_BASE}/questions/current`, {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse<QuestionResponse>(response);
  },

  async getQuestion(questionId: number): Promise<QuestionResponse> {
    const response = await fetch(`${API_BASE}/questions/${questionId}`, {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse<QuestionResponse>(response);
  },

  async submitAnswer(
    answer: AnswerRequest
  ): Promise<QuestionResponse | TestCompletedResponse> {
    const response = await fetch(`${API_BASE}/answers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(answer),
    });
    return handleResponse<QuestionResponse | TestCompletedResponse>(response);
  },

  async getResult(): Promise<ResultResponse> {
    const response = await fetch(`${API_BASE}/result`, {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse<ResultResponse>(response);
  },
};

export { ApiError };
