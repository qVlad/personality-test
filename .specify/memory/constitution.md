<!--
Sync Impact Report
==================
Version change: (new) → 1.0.0
Added principles:
  - I. Test-Driven Development (TDD)
  - II. Type Safety
  - III. API-First Design
  - IV. UX-First Approach
  - V. Simplicity (YAGNI)
Added sections:
  - Technology Stack
  - Development Workflow
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ (compatible, uses Constitution Check)
  - .specify/templates/spec-template.md ✅ (compatible, priority-based stories)
  - .specify/templates/tasks-template.md ✅ (compatible, supports TDD workflow)
Follow-up TODOs: none
-->

# test1 Constitution

## Core Principles

### I. Test-Driven Development (TDD)

TDD is **NON-NEGOTIABLE** for all feature development.

- Tests MUST be written BEFORE implementation code
- Red-Green-Refactor cycle MUST be strictly followed:
  1. Write a failing test (Red)
  2. Write minimal code to pass (Green)
  3. Refactor while keeping tests green
- No feature code may be merged without corresponding tests
- Test coverage MUST include: unit tests for business logic, integration tests for API endpoints, component tests for React UI

### II. Type Safety

Strict TypeScript typing is **MANDATORY** throughout the codebase.

- `strict: true` MUST be enabled in all tsconfig.json files
- `any` type is PROHIBITED except in rare, documented exceptions
- All function parameters and return types MUST be explicitly typed
- Shared types between frontend and backend MUST be defined in a common package
- Type guards MUST be used for runtime validation of external data (API responses, user input)

### III. API-First Design

API contracts MUST be defined before implementation.

- OpenAPI/Swagger specification MUST be created before coding endpoints
- Frontend and backend teams MUST agree on contracts before parallel development
- API versioning MUST follow semantic versioning (v1, v2, etc.)
- All endpoints MUST return consistent error response structure
- Breaking changes MUST increment major API version

### IV. UX-First Approach

User experience is the primary driver for all design decisions.

- Every feature MUST start with user journey mapping
- Questionnaire flow MUST be validated with users before full implementation
- Loading states, error messages, and empty states MUST be designed explicitly
- Accessibility (WCAG 2.1 AA) MUST be maintained for all UI components
- Mobile-first responsive design is REQUIRED

### V. Simplicity (YAGNI)

Keep it simple. You Aren't Gonna Need It.

- Implement only what is explicitly required NOW
- No speculative features or "just in case" abstractions
- Prefer duplication over wrong abstraction
- Maximum 3 levels of component nesting in React
- Dependencies MUST be justified; prefer standard library solutions
- If a feature can be removed without breaking core functionality, question its necessity

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | React | 18+ |
| Backend | Node.js | 18+ |
| Language | TypeScript | 5+ |
| Package Manager | npm or yarn | Latest stable |
| Testing | Jest + React Testing Library | Latest stable |
| API Spec | OpenAPI 3.0 | - |

**Constraints**:
- All dependencies MUST have active maintenance (updated within last 6 months)
- Security vulnerabilities MUST be addressed within 48 hours of discovery
- Bundle size MUST be monitored; no single dependency > 100KB gzipped without justification

## Development Workflow

### Code Review Requirements

- All changes MUST be reviewed by at least one team member
- Review checklist MUST include:
  - [ ] Tests present and passing
  - [ ] Types are strict (no `any`)
  - [ ] API contract updated if endpoints changed
  - [ ] No unnecessary complexity added
  - [ ] Accessibility verified for UI changes

### Quality Gates

- CI pipeline MUST pass before merge:
  - TypeScript compilation with zero errors
  - All tests passing
  - Linting (ESLint) with zero errors
  - Type coverage > 95%

### Commit Standards

- Conventional Commits format REQUIRED: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore
- Commits MUST be atomic and focused

## Governance

This Constitution is the supreme authority for all development decisions in the test1 project.

- All pull requests MUST demonstrate compliance with Core Principles
- Principle violations MUST be explicitly justified and documented
- Amendments to this Constitution require:
  1. Written proposal with rationale
  2. Impact analysis on existing code
  3. Team consensus
  4. Version increment following semantic versioning

**Version**: 1.0.0 | **Ratified**: 2026-01-04 | **Last Amended**: 2026-01-04
