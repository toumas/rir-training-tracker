name: "PRP for RIR Training Tracker App"
description: |
  This PRP guides an AI agent to implement the RIR Training Tracker application.

## Purpose
To build a comprehensive RIR Training Tracker web application with full CRUD functionality for managing workouts and exercises, based on the specifications in INITIAL.md.

## Core Principles
1.  **Context is King**: All necessary documentation and requirements are referenced from INITIAL.md.
2.  **Validation Loops**: Provide executable commands for the AI to self-validate.
3.  **Information Dense**: Use keywords and patterns from the Next.js and Tailwind CSS ecosystem.
4.  **Progressive Success**: Start with data models, then build UI components, and finally integrate logic.
5.  **Global rules**: Be sure to follow all rules in GEMINI_CLI.md

---

## Goal
Implement the RIR Training Tracker application as described in INITIAL.md. The final product should be a functional, multi-page Next.js application that allows users to create, read, update, and delete workouts and exercises, storing all data in the browser's localStorage.

## Why
-   To provide users with a tool to effectively track their training using the Reps in Reserve (RIR) methodology.
-   To create a practical application for personal fitness management.
-   This solves the problem of manual and inconsistent workout logging.

## What
A multi-page Next.js application featuring:
-   Dashboard with training statistics.
-   Exercise database with pre-loaded and custom exercises.
-   Workout creation and editing forms.
-   Workout history and progress analytics.
-   Full CRUD operations for all features.

### Success Criteria
-   [ ] All features described in INITIAL.md are implemented.
-   [ ] The application is responsive and works on desktop and mobile.
-   [ ] Data persists between browser sessions using localStorage.
-   [ ] The application builds without errors.

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- docfile: [INITIAL.md]
  why: [This file contains the complete feature description, user stories, and technical requirements for the application.]
```

### Current Codebase tree
```bash
/Users/tuomas.ukkola/projects/context-engineering-intro/
├───.gitattributes
├───.gitignore
├───GEMINI_CLI.md
├───INITIAL_EXAMPLE.md
├───INITIAL.md
├───LICENSE
├───README.md
├───.gemini/
│   ├───settings.local.json
│   └───commands/
│       ├───execute-prp.md
│       └───generate-prp.md
├───.git/...
├───.vscode/
│   └───settings.json
├───examples/
│   └───.gitkeep
├───PRPs/
│   ├───EXAMPLE_multi_agent_prp.md
│   └───templates/
│       └───prp_base.md
└───rir-training-tracker/
    ├───.gitignore
    ├───eslint.config.mjs
    ├───next-env.d.ts
    ├───next.config.ts
    ├───package-lock.json
    ├───package.json
    ├───postcss.config.mjs
    ├───README.md
    ├───tsconfig.json
    ├───app/
    │   ├───favicon.ico
    │   ├───globals.css
    │   ├───layout.tsx
    │   └───page.tsx
    ├───node_modules/...
    └───public/
        ├───file.svg
        ├───globe.svg
        ├───next.svg
        ├───vercel.svg
        └───window.svg
```

### Desired Codebase tree with files to be added and responsibility of file
```bash
rir-training-tracker/
├───app/
│   ├───components/
│   │   ├───Header.tsx           # Site header with navigation
│   │   ├───WorkoutForm.tsx      # Form for creating/editing workouts
│   │   ├───ExerciseCard.tsx     # Card to display exercise info
│   │   └───RIRGuide.tsx         # Component explaining RIR scale
│   ├───dashboard/
│   │   └───page.tsx             # Dashboard page
│   ├───workouts/
│   │   ├───page.tsx             # Workouts history page
│   │   └───[id]/
│   │       └───page.tsx         # Page for a single workout
│   ├───exercises/
│   │   ├───page.tsx             # Exercise database page
│   │   └───[id]/
│   │       └───page.tsx         # Page for a single exercise
│   └───lib/
│       ├───storage.ts           # Functions for interacting with localStorage
│       └───types.ts             # TypeScript types for the application
│       └───data.ts              # Initial seed data for exercises
└─── ... (rest of the files)
```

### Known Gotchas of our codebase & Library Quirks
```typescript
// CRITICAL: All data will be stored in localStorage. This is a hard requirement.
// CRITICAL: Use React hooks for state management. Do not introduce state management libraries like Redux or Zustand.
// CRITICAL: Styling must be done using Tailwind CSS.
```

## Implementation Blueprint

### Data models and structure
Create the core data models in `rir-training-tracker/app/lib/types.ts`.

```typescript
export interface ExerciseSet {
  id: string;
  reps: number;
  weight: number;
  rir: number;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: ExerciseSet[];
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  exercises: Exercise[];
  notes?: string;
}
```

### list of tasks to be completed to fullfill the PRP in the order they should be completed

```yaml
Task 1: Setup Core Structure
  - CREATE rir-training-tracker/app/lib/types.ts: Add the data models from above.
  - CREATE rir-training-tracker/app/lib/data.ts: Add initial exercise data.
  - CREATE rir-training-tracker/app/lib/storage.ts: Implement functions to get/set data in localStorage.
  - CREATE rir-training-tracker/app/components/Header.tsx: Create the main navigation header.
  - MODIFY rir-training-tracker/app/layout.tsx: Add the Header component.

Task 2: Implement Exercise Database
  - CREATE rir-training-tracker/app/exercises/page.tsx: Display a list of all exercises from localStorage.
  - CREATE rir-training-tracker/app/components/ExerciseCard.tsx: Create a component to display a single exercise.
  - CREATE rir-training-tracker/app/exercises/[id]/page.tsx: Display details for a single exercise.

Task 3: Implement Workout CRUD
  - CREATE rir-training-tracker/app/components/WorkoutForm.tsx: Create a form to add and edit workouts.
  - CREATE rir-training-tracker/app/workouts/page.tsx: Display a list of all workouts.
  - CREATE rir-training-tracker/app/workouts/[id]/page.tsx: Display details for a single workout, allowing for editing and deletion.

Task 4: Build the Dashboard
  - MODIFY rir-training-tracker/app/page.tsx to be the dashboard.
  - Display summary statistics (total workouts, avg RIR).
  - Show a list of recent workouts.

Task 5: Final Touches
  - CREATE rir-training-tracker/app/components/RIRGuide.tsx: Create a component that explains the RIR scale.
  - Integrate the RIRGuide component into the WorkoutForm.
  - Ensure all forms have proper validation.
  - Ensure responsive design for all pages.
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST - fix any errors before proceeding
npm run lint

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Build
```bash
# Run and iterate until passing:
npm run build

# If failing: Read error, understand root cause, fix code, re-run
```

### Level 3: Manual Testing
- [ ] Can you create a new workout?
- [ ] Can you view the created workout in the history?
- [ ] Can you edit the workout?
- [ ] Can you delete the workout?
- [ ] Can you add a new exercise to the database?
- [ ] Is the data still there after refreshing the page?

## Final validation Checklist
- [ ] All tests pass: `npm run lint` and `npm run build`
- [ ] No linting errors: `npm run lint`
- [ ] Manual tests successful
- [ ] Error cases handled gracefully
- [ ] The app is responsive on mobile and desktop.

---

## Anti-Patterns to Avoid
- ❌ Don't use any backend or server-side rendering for data. Everything is client-side with localStorage.
- ❌ Don't install new libraries without a very good reason. Stick to the existing stack.
- ❌ Don't deviate from the data models defined in this PRP.
