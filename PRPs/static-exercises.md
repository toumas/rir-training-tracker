name: "Static Exercises v1 - Refactor exercise data storage"
description: |

  ## Purpose
  Refactor the application to source exercise data from a static JSON file instead of using local storage. This change will simplify the process of updating exercise data for all users.

  ## Core Principles
  1. **Context is King**: Include ALL necessary documentation, examples, and caveats
  2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
  3. **Information Dense**: Use keywords and patterns from the codebase
  4. **Progressive Success**: Start simple, validate, then enhance
  5. **Global rules**: Be sure to follow all rules in GEMINI_CLI.md

  ---

  ## Goal
  The goal is to move the storage of exercise templates from the browser's local storage to a static JSON file within the application. This will make it easier to manage and update the list of available exercises.

  ## Why
  - **Easier Updates**: Storing exercises in a static file allows for updates to be deployed with the application, eliminating the need for users to manually clear their local storage.
  - **Data Consistency**: Ensures all users have the same set of base exercises.
  - **Improved User Experience**: Users will no longer risk losing their workout history when exercise data is updated.

  ## What
  - The application will read exercise templates from a `exercises.json` file.
  - The existing local storage implementation for exercises will be removed.
  - The UI will be updated to reflect this change, removing any functionality related to adding or modifying exercise templates.

  ### Success Criteria
  - [ ] Exercise data is successfully loaded from `app/lib/exercises.json`.
  - [ ] The `getExerciseTemplates` function in `app/lib/storage.ts` is refactored to read from the JSON file.
  - [ ] The `saveExerciseTemplate` and `getExerciseTemplateById` functions are removed from `app/lib/storage.ts`.
  - [ ] All components that previously used the local storage-based functions are updated to use the new data-loading mechanism.
  - [ ] The application builds and runs without errors.

  ## All Needed Context

  ### Documentation & References
  ```yaml
  # MUST READ - Include these in your context window
  - file: rir-training-tracker/app/lib/storage.ts
    why: To understand the current implementation of data storage.
  - file: rir-training-tracker/app/lib/data.ts
    why: To see the initial exercise data that needs to be moved.
  - file: rir-training-tracker/app/exercises/page.tsx
    why: To see how the exercise data is currently being displayed.
  - file: rir-training-tracker/app/components/WorkoutForm.tsx
    why: To see how exercise templates are used in the workout form.
  - file: rir-training-tracker/app/components/CycleWorkoutForm.tsx
    why: To see how exercise templates are used in the cycle workout form.
  ```

  ### Current Codebase tree
  ```bash
  rir-training-tracker/
  ├── app/
  │   ├── lib/
  │   │   ├── data.ts
  │   │   ├── storage.ts
  │   │   └── types.ts
  │   ├── exercises/
  │   │   └── page.tsx
  │   └── components/
  │       ├── WorkoutForm.tsx
  │       └── CycleWorkoutForm.tsx
  ```

  ### Desired Codebase tree
  ```bash
  rir-training-tracker/
  ├── app/
  │   ├── lib/
  │   │   ├── exercises.json  <- NEW
  │   │   ├── storage.ts      <- MODIFIED
  │   │   └── types.ts
  │   ├── exercises/
  │   │   └── page.tsx        <- MODIFIED
  │   └── components/
  │       ├── WorkoutForm.tsx   <- MODIFIED
  │       └── CycleWorkoutForm.tsx <- MODIFIED
  ```

  ### Known Gotchas of our codebase & Library Quirks
  - The application is built with Next.js, so file-based data loading should be done in a way that is compatible with server-side rendering and static generation.

  ## Implementation Blueprint

  ### Data models and structure
  The existing `ExerciseTemplate` interface in `app/lib/types.ts` will be used. The `exercises.json` file will be an array of objects that conform to this interface.

  ### list of tasks to be completed to fullfill the PRP in the order they should be completed

  ```yaml
  Task 1:
  CREATE rir-training-tracker/app/lib/exercises.json:
    - Create a new file named `exercises.json` in the `rir-training-tracker/app/lib` directory.
    - Populate this file with the exercise data from `rir-training-tracker/app/lib/data.ts`.

  Task 2:
  MODIFY rir-training-tracker/app/lib/storage.ts:
    - Remove the `EXERCISES_KEY` constant.
    - Remove the `getExerciseTemplates`, `saveExerciseTemplate`, and `getExerciseTemplateById` functions.
    - Create a new function `getExerciseTemplates` that reads the `exercises.json` file and returns the data.
    - Create a new function `getExerciseTemplateById` that filters the data from `exercises.json`.

  Task 3:
  MODIFY rir-training-tracker/app/exercises/page.tsx:
    - Update the component to use the new `getExerciseTemplates` function from `app/lib/storage.ts`.

  Task 4:
  MODIFY rir-training-tracker/app/components/WorkoutForm.tsx:
    - Update the component to use the new `getExerciseTemplates` function from `app/lib/storage.ts`.

  Task 5:
  MODIFY rir-training-tracker/app/components/CycleWorkoutForm.tsx:
    - Update the component to use the new `getExerciseTemplates` function from `app/lib/storage.ts`.

  Task 6:
  DELETE rir-training-tracker/app/lib/data.ts:
    - The `data.ts` file is no longer needed and can be deleted.
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

  ## Final validation Checklist
  - [ ] All linting errors are resolved.
  - [ ] The application builds successfully.
  - [ ] The exercises page displays the list of exercises from the JSON file.
  - [ ] The workout form and cycle workout form populate the exercise dropdown from the JSON file.
  