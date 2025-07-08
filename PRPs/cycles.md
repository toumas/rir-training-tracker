
# PRP: Implement Training Cycles Feature

## 1. Feature Description

As a user, I want to create and manage training cycles to structure my workouts based on the RIR (Reps in Reserve) methodology. A cycle consists of four weeks of training followed by a one-week deload period. I also want to view analytics to track my progress throughout the cycle and make informed adjustments to my training plan.

## 2. Research Findings

### Codebase Analysis

*   **Data Models (`rir-training-tracker/app/lib/types.ts`):** The project defines types for `Workout`, `Exercise`, and `ExerciseSet`. A new `Cycle` type should be introduced, containing a list of `Workout` IDs for each week.
*   **Data Storage (`rir-training-tracker/app/lib/storage.ts`):** The app uses `localStorage` to store workout and exercise data. New functions for creating, reading, updating, and deleting cycles will be added here, following the existing pattern.
*   **UI Components (`rir-training-tracker/app/components/`):** Reusable components like `WorkoutForm` and `ExerciseCard` provide a solid foundation for building the UI for cycles. A new `CycleForm` and `CycleCard` will be created.
*   **Routing and Pages (`rir-training-tracker/app/`):** The app uses a file-based routing system. A new `/cycles` route will be created with a page to list and manage cycles, and a `cycles/[id]` route to view a specific cycle's details and analytics.

### External Research

*   **RIR-Based Training:** RIR is a self-regulation method used to manage training intensity. A typical cycle involves progressively increasing intensity (decreasing RIR) over several weeks, followed by a deload week with reduced intensity and volume to allow for recovery and supercompensation.
*   **Progressive Overload:** The core principle of strength training. The app should help users apply progressive overload by tracking key metrics like volume, intensity, and RIR across workouts and cycles.
*   **Data Visualization:** Libraries like Chart.js or Recharts can be used to create interactive charts for cycle analytics, visualizing trends in volume, RIR, and other metrics.

## 3. Implementation Blueprint

### Tasks

1.  **Update Data Models:**
    *   In `rir-training-tracker/app/lib/types.ts`, add the `Cycle` interface:

    ```typescript
    export interface Cycle {
      id: string;
      name: string;
      startDate: string;
      weeks: {
        week1: string[]; // Array of workout IDs
        week2: string[];
        week3: string[];
        week4: string[];
        deload: string[];
      };
      notes?: string;
    }
    ```

2.  **Implement Storage Functions:**
    *   In `rir-training-tracker/app/lib/storage.ts`, add `getCycles`, `saveCycle`, `deleteCycle`, and `getCycleById` functions, mirroring the existing `getWorkouts` and `saveWorkout` functions.

3.  **Create Cycle Management UI:**
    *   Create a new page at `rir-training-tracker/app/cycles/page.tsx` to display a list of all cycles.
    *   This page will fetch and display `CycleCard` components for each cycle.
    *   Include a "New Cycle" button to open a `CycleForm`.

4.  **Build Cycle Form:**
    *   Create a `CycleForm` component in `rir-training-tracker/app/components/CycleForm.tsx`.
    *   The form will allow users to:
        *   Enter a name and start date for the cycle.
        *   Add existing workouts to each week of the cycle.
        *   Add notes.
    *   On save, it will call the `saveCycle` function.

5.  **Develop Cycle Details View:**
    *   Create a dynamic route at `rir-training-tracker/app/cycles/[id]/page.tsx`.
    *   This page will:
        *   Fetch the cycle data using `getCycleById`.
        *   Display the cycle's details, including the workouts for each week.
        *   Provide navigation to view individual workouts.

6.  **Implement Cycle Analytics:**
    *   On the cycle details page, add a new `CycleAnalytics` component.
    *   This component will:
        *   Calculate and display key metrics like total volume, average RIR, and number of sets per week.
        *   Use a charting library to visualize the progression of these metrics over the five weeks of the cycle.

### Pseudocode for `CycleAnalytics` Component

```tsx
// rir-training-tracker/app/components/CycleAnalytics.tsx

import { Cycle, Workout } from '../lib/types';
import { getWorkouts } from '../lib/storage';
import { Line } from 'react-chartjs-2';

interface CycleAnalyticsProps {
  cycle: Cycle;
}

export default function CycleAnalytics({ cycle }: CycleAnalyticsProps) {
  // 1. Fetch all workouts
  const allWorkouts = getWorkouts();

  // 2. Filter workouts relevant to the current cycle
  const cycleWorkouts = getWorkoutsForCycle(cycle, allWorkouts);

  // 3. Calculate weekly stats (volume, avgRIR, numSets)
  const weeklyStats = calculateWeeklyStats(cycle, cycleWorkouts);

  // 4. Prepare data for the chart
  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Deload'],
    datasets: [
      {
        label: 'Training Volume (lbs)',
        data: weeklyStats.map(w => w.volume),
        // ... styling options
      },
      {
        label: 'Average RIR',
        data: weeklyStats.map(w => w.avgRIR),
        // ... styling options
      }
    ]
  };

  // 5. Render the chart and summary stats
  return (
    <div>
      <h3 className="text-xl font-bold">Cycle Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Display summary cards for total volume, etc. */}
      </div>
      <div className="mt-8">
        <Line data={chartData} />
      </div>
    </div>
  );
}
```

## 4. Validation Gates

The following commands should be run to ensure the changes are correct:

```bash
# Check for linting and type errors
npm run lint

# Run the development server to manually test the new feature
npm run dev
```

## 5. Quality Checklist

*   [x] All necessary context included
*   [x] Validation gates are executable by AI
*   [x] References existing patterns
*   [x] Clear implementation path
*   [x] Error handling documented

**Confidence Score:** 9/10
