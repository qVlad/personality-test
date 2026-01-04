import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from './database.js';
import type { Session, SessionStatus, MBTICode } from '../../../shared/types/index.js';

interface SessionRow {
  id: string;
  current_question: number;
  status: string;
  result: string | null;
  created_at: string;
  updated_at: string;
}

export class SessionService {
  create(): Session {
    const db = getDatabase();
    const id = uuidv4();

    db.prepare('INSERT INTO sessions (id) VALUES (?)').run(id);

    return {
      id,
      currentQuestion: 0,
      status: 'in_progress',
      result: null,
    };
  }

  getById(id: string): Session | null {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM sessions WHERE id = ?').get(id) as SessionRow | undefined;

    if (!row) {
      return null;
    }

    return this.rowToSession(row);
  }

  update(
    id: string,
    updates: Partial<Pick<Session, 'currentQuestion' | 'status' | 'result'>>
  ): Session | null {
    const db = getDatabase();

    const setClauses: string[] = [];
    const values: (string | number | null)[] = [];

    if (updates.currentQuestion !== undefined) {
      setClauses.push('current_question = ?');
      values.push(updates.currentQuestion);
    }

    if (updates.status !== undefined) {
      setClauses.push('status = ?');
      values.push(updates.status);
    }

    if (updates.result !== undefined) {
      setClauses.push('result = ?');
      values.push(updates.result);
    }

    if (setClauses.length === 0) {
      return this.getById(id);
    }

    values.push(id);
    db.prepare(`UPDATE sessions SET ${setClauses.join(', ')} WHERE id = ?`).run(...values);

    return this.getById(id);
  }

  delete(id: string): boolean {
    const db = getDatabase();
    const result = db.prepare('DELETE FROM sessions WHERE id = ?').run(id);
    return result.changes > 0;
  }

  private rowToSession(row: SessionRow): Session {
    return {
      id: row.id,
      currentQuestion: row.current_question,
      status: row.status as SessionStatus,
      result: row.result as MBTICode | null,
    };
  }
}

export const sessionService = new SessionService();
