import { initTestDatabase, getDatabase, closeDatabase, resetDatabase } from '../../src/services/database';

describe('Database Service', () => {
  beforeEach(() => {
    initTestDatabase();
  });

  afterEach(() => {
    closeDatabase();
  });

  describe('initTestDatabase', () => {
    it('should create sessions table', () => {
      const db = getDatabase();
      const result = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='sessions'").get();
      expect(result).toBeDefined();
      expect((result as { name: string }).name).toBe('sessions');
    });

    it('should create answers table', () => {
      const db = getDatabase();
      const result = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='answers'").get();
      expect(result).toBeDefined();
      expect((result as { name: string }).name).toBe('answers');
    });

    it('should create index on answers table', () => {
      const db = getDatabase();
      const result = db.prepare("SELECT name FROM sqlite_master WHERE type='index' AND name='idx_answers_session'").get();
      expect(result).toBeDefined();
    });
  });

  describe('sessions table', () => {
    it('should insert a session with default values', () => {
      const db = getDatabase();
      const sessionId = 'test-session-id';

      db.prepare('INSERT INTO sessions (id) VALUES (?)').run(sessionId);

      const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(sessionId) as {
        id: string;
        current_question: number;
        status: string;
        result: string | null;
      };

      expect(session.id).toBe(sessionId);
      expect(session.current_question).toBe(0);
      expect(session.status).toBe('in_progress');
      expect(session.result).toBeNull();
    });

    it('should enforce valid status values', () => {
      const db = getDatabase();

      expect(() => {
        db.prepare("INSERT INTO sessions (id, status) VALUES ('test', 'invalid')").run();
      }).toThrow();
    });

    it('should update session current_question', () => {
      const db = getDatabase();
      const sessionId = 'test-session-id';

      db.prepare('INSERT INTO sessions (id) VALUES (?)').run(sessionId);
      db.prepare('UPDATE sessions SET current_question = ? WHERE id = ?').run(5, sessionId);

      const session = db.prepare('SELECT current_question FROM sessions WHERE id = ?').get(sessionId) as {
        current_question: number;
      };

      expect(session.current_question).toBe(5);
    });
  });

  describe('answers table', () => {
    it('should insert an answer for a session', () => {
      const db = getDatabase();
      const sessionId = 'test-session-id';

      db.prepare('INSERT INTO sessions (id) VALUES (?)').run(sessionId);
      db.prepare('INSERT INTO answers (session_id, question_id, selected_pole) VALUES (?, ?, ?)').run(sessionId, 1, 'E');

      const answer = db.prepare('SELECT * FROM answers WHERE session_id = ?').get(sessionId) as {
        session_id: string;
        question_id: number;
        selected_pole: string;
      };

      expect(answer.session_id).toBe(sessionId);
      expect(answer.question_id).toBe(1);
      expect(answer.selected_pole).toBe('E');
    });

    it('should enforce unique session_id + question_id', () => {
      const db = getDatabase();
      const sessionId = 'test-session-id';

      db.prepare('INSERT INTO sessions (id) VALUES (?)').run(sessionId);
      db.prepare('INSERT INTO answers (session_id, question_id, selected_pole) VALUES (?, ?, ?)').run(sessionId, 1, 'E');

      expect(() => {
        db.prepare('INSERT INTO answers (session_id, question_id, selected_pole) VALUES (?, ?, ?)').run(sessionId, 1, 'I');
      }).toThrow();
    });

    it('should enforce valid pole values', () => {
      const db = getDatabase();
      const sessionId = 'test-session-id';

      db.prepare('INSERT INTO sessions (id) VALUES (?)').run(sessionId);

      expect(() => {
        db.prepare('INSERT INTO answers (session_id, question_id, selected_pole) VALUES (?, ?, ?)').run(sessionId, 1, 'X');
      }).toThrow();
    });

    it('should enforce valid question_id range (1-20)', () => {
      const db = getDatabase();
      const sessionId = 'test-session-id';

      db.prepare('INSERT INTO sessions (id) VALUES (?)').run(sessionId);

      expect(() => {
        db.prepare('INSERT INTO answers (session_id, question_id, selected_pole) VALUES (?, ?, ?)').run(sessionId, 0, 'E');
      }).toThrow();

      expect(() => {
        db.prepare('INSERT INTO answers (session_id, question_id, selected_pole) VALUES (?, ?, ?)').run(sessionId, 21, 'E');
      }).toThrow();
    });

    it('should cascade delete answers when session is deleted', () => {
      const db = getDatabase();
      const sessionId = 'test-session-id';

      db.prepare('INSERT INTO sessions (id) VALUES (?)').run(sessionId);
      db.prepare('INSERT INTO answers (session_id, question_id, selected_pole) VALUES (?, ?, ?)').run(sessionId, 1, 'E');
      db.prepare('INSERT INTO answers (session_id, question_id, selected_pole) VALUES (?, ?, ?)').run(sessionId, 2, 'S');

      db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);

      const answers = db.prepare('SELECT * FROM answers WHERE session_id = ?').all(sessionId);
      expect(answers).toHaveLength(0);
    });
  });

  describe('resetDatabase', () => {
    it('should clear all data', () => {
      const db = getDatabase();

      db.prepare('INSERT INTO sessions (id) VALUES (?)').run('session-1');
      db.prepare('INSERT INTO sessions (id) VALUES (?)').run('session-2');
      db.prepare('INSERT INTO answers (session_id, question_id, selected_pole) VALUES (?, ?, ?)').run('session-1', 1, 'E');

      resetDatabase();

      const sessions = db.prepare('SELECT * FROM sessions').all();
      const answers = db.prepare('SELECT * FROM answers').all();

      expect(sessions).toHaveLength(0);
      expect(answers).toHaveLength(0);
    });
  });
});
