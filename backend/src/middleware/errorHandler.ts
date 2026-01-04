import type { Request, Response, NextFunction } from 'express';
import type { ErrorResponse } from '../../../shared/types/session.js';

export class AppError extends Error {
  public statusCode: number;
  public details?: Record<string, unknown>;

  constructor(message: string, statusCode: number, details?: Record<string, unknown>) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction
): void {
  console.error('Error:', err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
      details: err.details,
    });
    return;
  }

  res.status(500).json({
    error: 'InternalServerError',
    message: 'An unexpected error occurred',
  });
}

export function notFoundHandler(_req: Request, res: Response<ErrorResponse>): void {
  res.status(404).json({
    error: 'NotFound',
    message: 'The requested resource was not found',
  });
}
