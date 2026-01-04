# Data Model: Тест на определение типа личности

**Date**: 2026-01-04
**Branch**: `001-personality-test`

## Entities

### 1. Question (Static Data)

Represents a single test question with answer options.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | number | Unique question identifier | 1-20, primary key |
| text | string | Question text in Russian | Required, max 500 chars |
| dichotomy | enum | Which MBTI dichotomy this question measures | 'EI' \| 'SN' \| 'TF' \| 'JP' |
| options | Option[2] | Two answer options | Exactly 2 options |

**Option (embedded)**:
| Field | Type | Description |
|-------|------|-------------|
| text | string | Answer text in Russian |
| pole | char | Which pole this answer represents (E/I/S/N/T/F/J/P) |

**Distribution**: 5 questions per dichotomy (total 20)

**Storage**: Static JSON file (`backend/src/data/questions.json`)

---

### 2. PersonalityType (Static Data)

Represents one of 16 MBTI personality types with descriptions.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| code | string | 4-letter MBTI code | Primary key, e.g. "INTJ" |
| name | string | Russian name for the type | Required, e.g. "Стратег" |
| description | string | General description | Required, 200-500 chars |
| strengths | string[] | List of strengths | Min 3 items |
| growthAreas | string[] | Areas for development | Min 3 items |

**All 16 types**:
- ISTJ, ISFJ, INFJ, INTJ
- ISTP, ISFP, INFP, INTP
- ESTP, ESFP, ENFP, ENTP
- ESTJ, ESFJ, ENFJ, ENTJ

**Storage**: Static JSON file (`backend/src/data/personality-types.json`)

---

### 3. Session (Database)

Represents a user's test session, identified by session cookie.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | string | Session ID (UUID) | Primary key |
| currentQuestion | number | Current question index (0-based) | 0-19, default 0 |
| status | enum | Session status | 'in_progress' \| 'completed' |
| result | string \| null | MBTI result code | Null until completed, e.g. "INTJ" |
| createdAt | datetime | Session creation timestamp | Auto-generated |
| updatedAt | datetime | Last update timestamp | Auto-updated |

**Lifecycle**:
1. Created when user starts test → status: 'in_progress', currentQuestion: 0
2. Updated as user answers questions → currentQuestion increments
3. Completed when all questions answered → status: 'completed', result: calculated MBTI code

---

### 4. Answer (Database)

Represents a user's answer to a specific question within a session.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | integer | Auto-increment ID | Primary key |
| sessionId | string | Reference to Session | Foreign key, required |
| questionId | number | Reference to Question | 1-20, required |
| selectedPole | char | The pole selected (E/I/S/N/T/F/J/P) | Required |
| answeredAt | datetime | When answer was recorded | Auto-generated |

**Constraints**:
- Unique(sessionId, questionId) - one answer per question per session
- If user changes answer, existing record is updated (upsert)

---

## Database Schema (SQLite)

```sql
-- Sessions table
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  current_question INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  result TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Answers table
CREATE TABLE answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL CHECK (question_id BETWEEN 1 AND 20),
  selected_pole TEXT NOT NULL CHECK (selected_pole IN ('E', 'I', 'S', 'N', 'T', 'F', 'J', 'P')),
  answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(session_id, question_id)
);

-- Index for faster session lookups
CREATE INDEX idx_answers_session ON answers(session_id);

-- Trigger to update session timestamp
CREATE TRIGGER update_session_timestamp
AFTER UPDATE ON sessions
BEGIN
  UPDATE sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
```

---

## TypeScript Types (shared/types/)

### question.ts
```typescript
export type Dichotomy = 'EI' | 'SN' | 'TF' | 'JP';
export type Pole = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

export interface QuestionOption {
  text: string;
  pole: Pole;
}

export interface Question {
  id: number;
  text: string;
  dichotomy: Dichotomy;
  options: [QuestionOption, QuestionOption];
}
```

### personality.ts
```typescript
export type MBTICode =
  | 'ISTJ' | 'ISFJ' | 'INFJ' | 'INTJ'
  | 'ISTP' | 'ISFP' | 'INFP' | 'INTP'
  | 'ESTP' | 'ESFP' | 'ENFP' | 'ENTP'
  | 'ESTJ' | 'ESFJ' | 'ENFJ' | 'ENTJ';

export interface PersonalityType {
  code: MBTICode;
  name: string;
  description: string;
  strengths: string[];
  growthAreas: string[];
}
```

### session.ts
```typescript
import type { Pole, Question } from './question';
import type { MBTICode, PersonalityType } from './personality';

export type SessionStatus = 'in_progress' | 'completed';

export interface Session {
  id: string;
  currentQuestion: number;
  status: SessionStatus;
  result: MBTICode | null;
}

export interface Answer {
  questionId: number;
  selectedPole: Pole;
}

export interface SessionWithAnswers extends Session {
  answers: Answer[];
}

// API Response types
export interface QuestionResponse {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  previousAnswer: Pole | null;
}

export interface ResultResponse {
  personalityType: PersonalityType;
  answers: Answer[];
}
```

---

## Relationships

```
Session (1) ──────< (N) Answer
    │                    │
    │                    │ questionId references
    │                    ▼
    │               Question (static)
    │
    │ result references
    ▼
PersonalityType (static)
```

---

## Validation Rules

### Session
- `currentQuestion` must be 0-19
- `result` must be null when status is 'in_progress'
- `result` must be valid MBTICode when status is 'completed'

### Answer
- `questionId` must exist in Questions (1-20)
- `selectedPole` must match one of the poles in the referenced question's options
- One answer per question per session (upsert on conflict)

### Question (static validation on load)
- Exactly 20 questions
- 5 questions per dichotomy
- Each question has exactly 2 options with opposite poles

### PersonalityType (static validation on load)
- Exactly 16 types
- All combinations of E/I, S/N, T/F, J/P present
