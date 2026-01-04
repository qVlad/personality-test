# Tasks: Тест на определение типа личности (16 типов)

**Input**: Design documents from `/specs/001-personality-test/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Included (TDD required by constitution - Principle I)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`, `shared/types/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project directory structure per implementation plan (backend/, frontend/, shared/)
- [X] T002 [P] Initialize backend Node.js project with TypeScript in backend/package.json
- [X] T003 [P] Initialize frontend React project with Vite and TypeScript in frontend/package.json
- [X] T004 [P] Initialize shared types package in shared/package.json
- [X] T005 [P] Configure TypeScript strict mode in backend/tsconfig.json
- [X] T006 [P] Configure TypeScript strict mode in frontend/tsconfig.json
- [X] T007 [P] Configure TypeScript strict mode in shared/tsconfig.json
- [X] T008 [P] Setup Jest and supertest for backend testing in backend/package.json
- [X] T009 [P] Setup Jest and React Testing Library for frontend testing in frontend/package.json
- [X] T010 [P] Configure ESLint and Prettier for backend in backend/.eslintrc.js
- [X] T011 [P] Configure ESLint and Prettier for frontend in frontend/.eslintrc.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Shared Types

- [X] T012 [P] Create Question and Pole types in shared/types/question.ts (from data-model.md)
- [X] T013 [P] Create PersonalityType and MBTICode types in shared/types/personality.ts (from data-model.md)
- [X] T014 [P] Create Session and Answer types in shared/types/session.ts (from data-model.md)
- [X] T015 Create shared types index export in shared/types/index.ts

### Static Data

- [X] T016 [P] Create 20 MBTI questions data in backend/src/data/questions.json (5 per dichotomy: EI, SN, TF, JP)
- [X] T017 [P] Create 16 personality type descriptions in backend/src/data/personality-types.json (all MBTI codes with Russian names)

### Database Setup

- [X] T018 Create SQLite database initialization in backend/src/services/database.ts (schema from data-model.md)
- [X] T019 Write unit test for database service in backend/tests/unit/database.test.ts

### Express App Foundation

- [X] T020 Create Express app entry point with CORS and session middleware in backend/src/index.ts
- [X] T021 [P] Create error handling middleware in backend/src/middleware/errorHandler.ts
- [X] T022 [P] Create session middleware configuration in backend/src/middleware/session.ts
- [X] T023 Write integration test for Express app startup in backend/tests/integration/app.test.ts

### Frontend Foundation

- [X] T024 Create API client service in frontend/src/services/api.ts
- [X] T025 Create base CSS with mobile-first responsive styles in frontend/src/index.css
- [X] T026 Create App component with routing structure in frontend/src/App.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Прохождение теста (Priority: P1) 🎯 MVP

**Goal**: User can complete the full 20-question test and receive their personality type result with description

**Independent Test**: Start test → answer all 20 questions → see result page with MBTI type and description

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T027 [P] [US1] Write contract test for POST /api/session in backend/tests/integration/session.test.ts
- [X] T028 [P] [US1] Write contract test for GET /api/questions/current in backend/tests/integration/questions.test.ts
- [X] T029 [P] [US1] Write contract test for POST /api/answers in backend/tests/integration/answers.test.ts
- [X] T030 [P] [US1] Write contract test for GET /api/result in backend/tests/integration/result.test.ts
- [X] T031 [P] [US1] Write unit test for scoring service in backend/tests/unit/scoring.test.ts
- [X] T032 [P] [US1] Write component test for HomePage in frontend/tests/components/HomePage.test.tsx
- [X] T033 [P] [US1] Write component test for QuestionPage in frontend/tests/components/QuestionPage.test.tsx
- [X] T034 [P] [US1] Write component test for ResultPage in frontend/tests/components/ResultPage.test.tsx

### Backend Implementation for User Story 1

- [X] T035 [US1] Implement SessionService with create/get/update in backend/src/services/session.service.ts
- [X] T036 [US1] Implement QuestionService with getCurrent/getById in backend/src/services/question.service.ts
- [X] T037 [US1] Implement AnswerService with submit/getBySession in backend/src/services/answer.service.ts
- [X] T038 [US1] Implement ScoringService with calculateMBTI in backend/src/services/scoring.service.ts
- [X] T039 [US1] Implement PersonalityService with getByCode in backend/src/services/personality.service.ts
- [X] T040 [US1] Create session routes (POST, GET) in backend/src/api/session.routes.ts
- [X] T041 [US1] Create questions routes (GET /current) in backend/src/api/questions.routes.ts
- [X] T042 [US1] Create answers route (POST) in backend/src/api/answers.routes.ts
- [X] T043 [US1] Create result route (GET) in backend/src/api/result.routes.ts
- [X] T044 [US1] Register all routes in Express app in backend/src/index.ts

### Frontend Implementation for User Story 1

- [X] T045 [P] [US1] Create HomePage component (start test button) in frontend/src/pages/HomePage.tsx
- [X] T046 [P] [US1] Create AnswerOption component in frontend/src/components/AnswerOption.tsx
- [X] T047 [US1] Create QuestionPage component (question display, answer selection) in frontend/src/pages/QuestionPage.tsx
- [X] T048 [US1] Create ResultPage component (personality type display) in frontend/src/pages/ResultPage.tsx
- [X] T049 [US1] Add routing for Home → Question → Result in frontend/src/App.tsx
- [X] T050 [US1] Style all US1 components with mobile-first CSS in frontend/src/pages/*.css

**Checkpoint**: User Story 1 complete - full test flow works: start → answer 20 questions → see result

---

## Phase 4: User Story 2 - Просмотр прогресса теста (Priority: P2)

**Goal**: User sees progress indicator showing "N из 20" during the test

**Independent Test**: Start test → verify progress shows "1 из 20" → answer question → verify progress updates to "2 из 20"

### Tests for User Story 2 ⚠️

- [X] T051 [P] [US2] Write component test for ProgressBar in frontend/tests/components/ProgressBar.test.tsx

### Implementation for User Story 2

- [X] T052 [US2] Create ProgressBar component in frontend/src/components/ProgressBar.tsx
- [X] T053 [US2] Integrate ProgressBar into QuestionPage in frontend/src/pages/QuestionPage.tsx
- [X] T054 [US2] Style ProgressBar with mobile-first CSS in frontend/src/components/ProgressBar.css

**Checkpoint**: User Story 2 complete - progress indicator visible and updates correctly

---

## Phase 5: User Story 3 - Возврат к предыдущему вопросу (Priority: P3)

**Goal**: User can navigate back to previous questions and change answers

**Independent Test**: Answer questions 1-3 → click back → verify question 2 shown with previous answer → change answer → verify new answer saved

### Tests for User Story 3 ⚠️

- [X] T055 [P] [US3] Write contract test for GET /api/questions/:id in backend/tests/integration/questions.test.ts
- [X] T056 [P] [US3] Write component test for BackButton in frontend/tests/components/BackButton.test.tsx
- [X] T057 [P] [US3] Write integration test for answer update flow in backend/tests/integration/answers.test.ts

### Backend Implementation for User Story 3

- [X] T058 [US3] Add getQuestion(id) route in backend/src/api/questions.routes.ts
- [X] T059 [US3] Implement answer upsert (update on conflict) in backend/src/services/answer.service.ts

### Frontend Implementation for User Story 3

- [X] T060 [US3] Create BackButton component in frontend/src/components/BackButton.tsx
- [X] T061 [US3] Integrate BackButton into QuestionPage (hidden on question 1) in frontend/src/pages/QuestionPage.tsx
- [X] T062 [US3] Handle previousAnswer display in QuestionPage in frontend/src/pages/QuestionPage.tsx
- [X] T063 [US3] Style BackButton with mobile-first CSS in frontend/src/components/BackButton.css

**Checkpoint**: User Story 3 complete - back navigation works, answers can be changed

---

## Phase 6: Session Persistence (Edge Case)

**Goal**: User can resume unfinished test after closing browser

**Independent Test**: Start test → answer 5 questions → close browser → reopen → verify test resumes at question 6

### Tests for Session Persistence ⚠️

- [X] T064 [P] Write integration test for session resume in backend/tests/integration/session.test.ts
- [X] T065 [P] Write component test for session resume in frontend in frontend/tests/components/HomePage.test.tsx

### Implementation

- [X] T066 Implement session resume logic in POST /api/session in backend/src/api/session.routes.ts
- [X] T067 Handle existing session detection on HomePage in frontend/src/pages/HomePage.tsx
- [X] T068 Add "Продолжить тест" button for existing sessions in frontend/src/pages/HomePage.tsx

**Checkpoint**: Session persistence complete - users can resume tests

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T069 [P] Add input validation with error messages for all endpoints in backend/src/middleware/validation.ts
- [X] T070 [P] Add loading states to all frontend pages in frontend/src/components/LoadingSpinner.tsx
- [X] T071 [P] Add error boundary and error display in frontend/src/components/ErrorBoundary.tsx
- [X] T072 Implement DELETE /api/session (reset test) in backend/src/api/session.routes.ts
- [X] T073 Add "Начать заново" button on ResultPage in frontend/src/pages/ResultPage.tsx
- [X] T074 [P] Add accessibility attributes (ARIA) to all interactive components
- [X] T075 Run full test suite and fix any failures
- [X] T076 Validate against quickstart.md scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
- **Session Persistence (Phase 6)**: Depends on User Story 1 (Phase 3)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 QuestionPage
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Integrates with US1 QuestionPage

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- Services before routes
- Routes before frontend pages
- Core implementation before integration

### Parallel Opportunities

**Phase 1 (Setup)**:
- T002, T003, T004 (package.json files) can run in parallel
- T005, T006, T007 (tsconfig files) can run in parallel
- T008, T009 (test setup) can run in parallel
- T010, T011 (linting) can run in parallel

**Phase 2 (Foundational)**:
- T012, T013, T014 (shared types) can run in parallel
- T016, T017 (static data) can run in parallel
- T021, T022 (middleware) can run in parallel

**Phase 3 (User Story 1)**:
- All test tasks (T027-T034) can run in parallel
- T045, T046 (independent components) can run in parallel

**Phase 4, 5, 6, 7**:
- All test tasks marked [P] can run in parallel
- Tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all backend tests for User Story 1 together:
Task: "Write contract test for POST /api/session in backend/tests/integration/session.test.ts"
Task: "Write contract test for GET /api/questions/current in backend/tests/integration/questions.test.ts"
Task: "Write contract test for POST /api/answers in backend/tests/integration/answers.test.ts"
Task: "Write contract test for GET /api/result in backend/tests/integration/result.test.ts"
Task: "Write unit test for scoring service in backend/tests/unit/scoring.test.ts"

# Launch all frontend tests for User Story 1 together:
Task: "Write component test for HomePage in frontend/tests/components/HomePage.test.tsx"
Task: "Write component test for QuestionPage in frontend/tests/components/QuestionPage.test.tsx"
Task: "Write component test for ResultPage in frontend/tests/components/ResultPage.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Full test flow works
5. Deploy/demo if ready - users can take the test and get results

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → MVP: Full test works
3. Add User Story 2 → Progress indicator visible
4. Add User Story 3 → Back navigation enabled
5. Add Session Persistence → Resume capability
6. Polish → Production ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (backend)
   - Developer B: User Story 1 (frontend)
3. After US1:
   - Developer A: User Story 2
   - Developer B: User Story 3
4. Together: Session Persistence + Polish

---

## Summary

| Phase | Task Count | Description |
|-------|------------|-------------|
| Phase 1: Setup | 11 | Project initialization |
| Phase 2: Foundational | 15 | Core infrastructure |
| Phase 3: US1 - Прохождение теста | 24 | MVP - full test flow |
| Phase 4: US2 - Прогресс | 4 | Progress indicator |
| Phase 5: US3 - Возврат | 9 | Back navigation |
| Phase 6: Session Persistence | 5 | Resume capability |
| Phase 7: Polish | 8 | Final improvements |
| **Total** | **76** | |

### MVP Scope

Complete Phases 1-3 for minimum viable product:
- Users can take the 20-question MBTI test
- Users receive their personality type result with description
- **26 tasks for MVP** (Setup + Foundational + US1)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently testable
- Verify tests fail before implementing (TDD)
- Commit after each task or logical group
- All tests include TDD compliance per constitution Principle I
