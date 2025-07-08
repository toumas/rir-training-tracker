import { Workout, ExerciseTemplate, Cycle } from './types';
import { initialExercises } from './data';

const WORKOUTS_KEY = 'rir-workouts';
const EXERCISES_KEY = 'rir-exercises';
const CYCLES_KEY = 'rir-cycles';

// Workout storage functions
export const getWorkouts = (): Workout[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(WORKOUTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting workouts:', error);
    return [];
  }
};

export const saveWorkout = (workout: Workout): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const workouts = getWorkouts();
    const existingIndex = workouts.findIndex(w => w.id === workout.id);
    
    if (existingIndex >= 0) {
      workouts[existingIndex] = workout;
    } else {
      workouts.push(workout);
    }
    
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
  } catch (error) {
    console.error('Error saving workout:', error);
  }
};

export const deleteWorkout = (id: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const workouts = getWorkouts();
    const filtered = workouts.filter(w => w.id !== id);
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting workout:', error);
  }
};

export const getWorkoutById = (id: string): Workout | undefined => {
  return getWorkouts().find(w => w.id === id);
};

// Exercise template storage functions
export const getExerciseTemplates = (): ExerciseTemplate[] => {
  if (typeof window === 'undefined') return initialExercises;
  
  try {
    const stored = localStorage.getItem(EXERCISES_KEY);
    if (stored) {
      return JSON.parse(stored);
    } else {
      // Initialize with default exercises
      localStorage.setItem(EXERCISES_KEY, JSON.stringify(initialExercises));
      return initialExercises;
    }
  } catch (error) {
    console.error('Error getting exercise templates:', error);
    return initialExercises;
  }
};

export const saveExerciseTemplate = (exercise: ExerciseTemplate): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const exercises = getExerciseTemplates();
    const existingIndex = exercises.findIndex(e => e.id === exercise.id);
    
    if (existingIndex >= 0) {
      exercises[existingIndex] = exercise;
    } else {
      exercises.push(exercise);
    }
    
    localStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
  } catch (error) {
    console.error('Error saving exercise template:', error);
  }
};

export const getExerciseTemplateById = (id: string): ExerciseTemplate | undefined => {
  return getExerciseTemplates().find(e => e.id === id);
};

// Utility functions
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

// Cycle storage functions
export const getCycles = (): Cycle[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(CYCLES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting cycles:', error);
    return [];
  }
};

export const saveCycle = (cycle: Cycle): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const cycles = getCycles();
    const existingIndex = cycles.findIndex(c => c.id === cycle.id);
    
    if (existingIndex >= 0) {
      cycles[existingIndex] = cycle;
    } else {
      cycles.push(cycle);
    }
    
    localStorage.setItem(CYCLES_KEY, JSON.stringify(cycles));
  } catch (error) {
    console.error('Error saving cycle:', error);
  }
};

export const deleteCycle = (id: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const cycles = getCycles();
    const filtered = cycles.filter(c => c.id !== id);
    localStorage.setItem(CYCLES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting cycle:', error);
  }
};

export const getCycleById = (id: string): Cycle | undefined => {
  return getCycles().find(c => c.id === id);
};
