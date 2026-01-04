import { getDatabase } from './database.js';
import type { Answer, AnswerValue } from '../../../shared/types/index.js';

interface AnswerRow {
  id: number;
  session_id: string;
  question_id: number;
  selected_option: string;
  answered_at: string;
}

export class AnswerService {
  submit(sessionId: string, questionId: number, selectedOption: AnswerValue): Answer {
    const db = getDatabase();

    // Use upsert (INSERT OR REPLACE) to handle answer updates
    db.prepare(
      `
      INSERT INTO answers (session_id, question_id, selected_option)
      VALUES (?, ?, ?)
      ON CONFLICT(session_id, question_id) DO UPDATE SET
        selected_option = excluded.selected_option,
        answered_at = CURRENT_TIMESTAMP
    `
    ).run(sessionId, questionId, selectedOption);

    return {
      questionId,
      selectedOption,
    };
  }

  getBySession(sessionId: string): Answer[] {
    const db = getDatabase();
    const rows = db
      .prepare('SELECT * FROM answers WHERE session_id = ? ORDER BY question_id')
      .all(sessionId) as AnswerRow[];

    return rows.map((row) => ({
      questionId: row.question_id,
      selectedOption: row.selected_option as AnswerValue,
    }));
  }

  getBySessionAndQuestion(sessionId: string, questionId: number): Answer | null {
    const db = getDatabase();
    const row = db
      .prepare('SELECT * FROM answers WHERE session_id = ? AND question_id = ?')
      .get(sessionId, questionId) as AnswerRow | undefined;

    if (!row) {
      return null;
    }

    return {
      questionId: row.question_id,
      selectedOption: row.selected_option as AnswerValue,
    };
  }

  countBySession(sessionId: string): number {
    const db = getDatabase();
    const result = db
      .prepare('SELECT COUNT(*) as count FROM answers WHERE session_id = ?')
      .get(sessionId) as { count: number };

    return result.count;
  }
}

export const answerService = new AnswerService();
