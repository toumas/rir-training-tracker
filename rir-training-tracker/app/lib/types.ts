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

export interface ExerciseTemplate {
  id: string;
  name: string;
  muscleGroup: string;
  equipment?: string;
  instructions?: string;
}
