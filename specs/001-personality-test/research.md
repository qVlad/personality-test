# Research: Тест на определение типа личности

**Date**: 2026-01-04
**Branch**: `001-personality-test`

## Technology Decisions

### 1. Backend Framework: Express.js

**Decision**: Use Express.js with TypeScript for the backend API.

**Rationale**:
- Constitution mandates Node.js 18+ and TypeScript 5+
- Express is the most widely adopted Node.js framework with excellent TypeScript support
- Minimal learning curve, extensive middleware ecosystem
- Perfect fit for simple REST API requirements

**Alternatives Considered**:
- Fastify: Higher performance but more complex setup; overkill for this scale
- NestJS: Full-featured but adds unnecessary abstraction for a simple API
- Koa: Less ecosystem support than Express

### 2. Database: SQLite with better-sqlite3

**Decision**: Use SQLite with better-sqlite3 driver.

**Rationale**:
- Clarification confirmed SQLite as the database choice
- better-sqlite3 is synchronous, simpler API, better performance than sqlite3
- No external database server needed - single file storage
- Perfect for session-based data with low concurrency

**Alternatives Considered**:
- PostgreSQL: Overkill for single-user sessions; requires external server
- MySQL: Same as PostgreSQL
- In-memory: Doesn't meet session persistence requirement

### 3. Session Management: express-session with cookie-based identification

**Decision**: Use express-session with SQLite session store.

**Rationale**:
- Clarification confirmed session persistence via cookies
- express-session is the standard solution for Express apps
- connect-session-knex or better-sqlite3-session-store for SQLite persistence
- No user registration required - anonymous sessions only

**Alternatives Considered**:
- JWT tokens: More complex, stateless approach not needed here
- Custom cookie handling: Reinventing the wheel

### 4. Frontend: React 18 with TypeScript

**Decision**: Use React 18 with TypeScript, Vite as build tool.

**Rationale**:
- Constitution mandates React 18+ and TypeScript 5+
- Vite provides fast development experience and optimized builds
- Simple SPA architecture fits the quiz flow perfectly

**Alternatives Considered**:
- Next.js: SSR not needed for this simple quiz app; adds complexity
- Create React App: Deprecated, slower than Vite

### 5. Styling: CSS Modules or Tailwind CSS

**Decision**: Use CSS Modules for component-scoped styling.

**Rationale**:
- Mobile-first responsive design requirement
- CSS Modules provide scoped styles without additional dependencies
- Simple and predictable; aligns with YAGNI principle

**Alternatives Considered**:
- Tailwind CSS: Powerful but adds learning curve and bundle size
- Styled-components: Runtime CSS-in-JS adds complexity
- Plain CSS: Global scope issues

### 6. MBTI Scoring Algorithm

**Decision**: Simple majority voting per dichotomy.

**Rationale**:
- Spec states: "Результат определяется простым подсчётом преобладающих ответов по каждой дихотомии"
- 5 questions per dichotomy → count answers for each pole
- Majority determines the letter (E/I, S/N, T/F, J/P)
- Tie-breaker: Default to first option (E, S, T, J) or random

**Algorithm**:
```
For each dichotomy (E/I, S/N, T/F, J/P):
  count_first_pole = count of answers favoring first pole
  count_second_pole = 5 - count_first_pole
  if count_first_pole >= count_second_pole:
    result += first_pole_letter
  else:
    result += second_pole_letter
```

### 7. Question Data Structure

**Decision**: Store questions as static JSON, load at app startup.

**Rationale**:
- 20 fixed questions - no dynamic content needed
- Static data can be bundled with backend
- Simplifies deployment; no database migrations for question changes

**Structure**:
```typescript
interface Question {
  id: number;
  text: string;
  dichotomy: 'EI' | 'SN' | 'TF' | 'JP';
  options: [
    { text: string; pole: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P' },
    { text: string; pole: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P' }
  ];
}
```

### 8. Personality Type Descriptions

**Decision**: Store 16 personality type descriptions as static JSON.

**Rationale**:
- Fixed content for all 16 MBTI types
- Each type includes: code, name, description, strengths, growth areas
- Static data bundled with backend

## Best Practices Applied

### Express.js + TypeScript
- Use strict TypeScript configuration
- Typed request/response handlers with generics
- Middleware for session handling and error management
- Input validation with zod or similar

### React + TypeScript
- Functional components with hooks
- Typed props and state
- Custom hooks for API calls and state management
- Error boundaries for graceful error handling

### SQLite Best Practices
- Use prepared statements for all queries
- Enable WAL mode for better concurrency
- Proper connection management (single connection for this scale)
- Database file in backend/data/ with .gitignore

### Testing Strategy
- Backend: Unit tests for scoring logic, integration tests for API endpoints
- Frontend: Component tests with React Testing Library
- Focus on user journeys: start test → answer questions → view result

## Open Items

None - all technical decisions resolved during clarification phase.
