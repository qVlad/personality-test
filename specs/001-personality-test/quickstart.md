# Quickstart: MBTI Personality Test

## Prerequisites

- Node.js 18+
- npm or yarn

## Project Setup

### 1. Initialize Monorepo Structure

```bash
# Create directory structure
mkdir -p backend/src/{models,services,api,data}
mkdir -p backend/tests/{unit,integration}
mkdir -p frontend/src/{components,pages,services,types}
mkdir -p frontend/tests/components
mkdir -p shared/types

# Initialize packages
cd backend && npm init -y
cd ../frontend && npm init -y
cd ../shared && npm init -y
cd ..
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install express better-sqlite3 express-session uuid cors
npm install -D typescript @types/node @types/express @types/better-sqlite3 \
  @types/express-session @types/uuid @types/cors \
  jest @types/jest ts-jest supertest @types/supertest \
  ts-node nodemon
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm create vite@latest . -- --template react-ts
npm install
npm install -D jest @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event jsdom @types/jest
```

### 4. Install Shared Types Package

```bash
cd shared
npm install -D typescript
```

### 5. Configure TypeScript

**backend/tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "tests"]
}
```

**frontend/tsconfig.json** (extend Vite default):
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "paths": {
      "@shared/*": ["../shared/types/*"]
    }
  }
}
```

**shared/tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "declaration": true,
    "outDir": "./dist"
  },
  "include": ["types/**/*"]
}
```

## Development Workflow

### Start Backend (development)
```bash
cd backend
npm run dev
# Runs on http://localhost:3001
```

### Start Frontend (development)
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173 (Vite default)
```

### Run Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# All tests (from root)
npm test --workspaces
```

## Key Files to Create First

### 1. Shared Types (TDD: types first)
- `shared/types/question.ts` - Question, Pole, Dichotomy types
- `shared/types/personality.ts` - PersonalityType, MBTICode types
- `shared/types/session.ts` - Session, Answer types

### 2. Static Data
- `backend/src/data/questions.json` - 20 MBTI questions
- `backend/src/data/personality-types.json` - 16 type descriptions

### 3. Database Setup
- `backend/src/services/database.ts` - SQLite initialization
- `backend/src/services/session.service.ts` - Session CRUD operations

### 4. API Routes
- `backend/src/api/session.routes.ts` - Session endpoints
- `backend/src/api/question.routes.ts` - Question endpoints
- `backend/src/api/answer.routes.ts` - Answer submission
- `backend/src/api/result.routes.ts` - Result retrieval

### 5. Frontend Components
- `frontend/src/pages/HomePage.tsx` - Start screen
- `frontend/src/pages/QuestionPage.tsx` - Question display
- `frontend/src/pages/ResultPage.tsx` - Result display
- `frontend/src/components/ProgressBar.tsx` - Progress indicator
- `frontend/src/components/AnswerOption.tsx` - Answer button

## API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/session | Start/resume session |
| GET | /api/session | Get current session |
| DELETE | /api/session | Reset session |
| GET | /api/questions/current | Get current question |
| GET | /api/questions/:id | Get specific question |
| POST | /api/answers | Submit answer |
| GET | /api/result | Get test result |

## Environment Variables

**backend/.env**:
```
PORT=3001
SESSION_SECRET=your-secret-key-here
NODE_ENV=development
```

**frontend/.env**:
```
VITE_API_URL=http://localhost:3001/api
```

## Testing Strategy

1. **Unit Tests First** (TDD Red phase)
   - Scoring service: test MBTI calculation logic
   - Session service: test CRUD operations
   - React components: test render and interactions

2. **Integration Tests**
   - API endpoints with supertest
   - Full user flow: start → answer → result

3. **Component Tests**
   - Question display with options
   - Progress bar updates
   - Result page rendering
