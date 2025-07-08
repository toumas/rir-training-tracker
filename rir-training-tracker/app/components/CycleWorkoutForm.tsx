'use client';

import { useState, useEffect } from 'react';
import { Workout, Exercise, ExerciseSet, ExerciseTemplate, Cycle } from '../lib/types';
import { getExerciseTemplates, generateId, formatDate, getWorkouts } from '../lib/storage';
import RIRGuide from './RIRGuide';

interface CycleWorkoutFormProps {
  cycle: Cycle;
  targetWeek: string; // 'week1', 'week2', etc.
  workout?: Workout;
  onSave: (workout: Workout) => void;
  onCancel: () => void;
}

interface ExerciseProgression {
  exerciseName: string;
  previousWeeks: {
    week: string;
    sets: ExerciseSet[];
    bestSet: ExerciseSet;
    totalVolume: number;
  }[];
}

export default function CycleWorkoutForm({ cycle, targetWeek, workout, onSave, onCancel }: CycleWorkoutFormProps) {
  const [workoutName, setWorkoutName] = useState(workout?.name || '');
  const [workoutDate, setWorkoutDate] = useState(workout?.date || formatDate(new Date()));
  const [notes, setNotes] = useState(workout?.notes || '');
  const [exercises, setExercises] = useState<Exercise[]>(workout?.exercises || []);
  const [exerciseTemplates, setExerciseTemplates] = useState<ExerciseTemplate[]>([]);
  const [showRIRGuide, setShowRIRGuide] = useState(false);
  const [progressionData, setProgressionData] = useState<{ [exerciseName: string]: ExerciseProgression }>({});

  useEffect(() => {
    setExerciseTemplates(getExerciseTemplates());
    
    const loadProgressionData = () => {
      const allWorkouts = getWorkouts();
      const progressions: { [exerciseName: string]: ExerciseProgression } = {};

      // Get all weeks before the target week
      const weekOrder = ['week1', 'week2', 'week3', 'week4', 'deload'];
      const targetWeekIndex = weekOrder.indexOf(targetWeek);
      const previousWeeks = weekOrder.slice(0, targetWeekIndex);

      // For each exercise that might be added, look for progression data
      getExerciseTemplates().forEach(template => {
        const progression: ExerciseProgression = {
          exerciseName: template.name,
          previousWeeks: []
        };

        previousWeeks.forEach((weekKey, weekIndex) => {
          const weekWorkoutIds = cycle.weeks[weekKey as keyof typeof cycle.weeks] || [];
          const weekWorkouts = weekWorkoutIds
            .map(id => allWorkouts.find(w => w.id === id))
            .filter((w): w is Workout => w !== undefined);

          // Find exercises with matching name in this week
          weekWorkouts.forEach(workout => {
            const matchingExercise = workout.exercises.find(ex => ex.name === template.name);
            if (matchingExercise && matchingExercise.sets.length > 0) {
              // Find the best set (highest weight * reps)
              const bestSet = matchingExercise.sets.reduce((best, current) => {
                const bestVolume = best.weight * best.reps;
                const currentVolume = current.weight * current.reps;
                return currentVolume > bestVolume ? current : best;
              });

              const totalVolume = matchingExercise.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0);

              progression.previousWeeks.push({
                week: `Week ${weekIndex + 1}`,
                sets: matchingExercise.sets,
                bestSet,
                totalVolume
              });
            }
          });
        });

        if (progression.previousWeeks.length > 0) {
          progressions[template.name] = progression;
        }
      });

      setProgressionData(progressions);
    };
    
    loadProgressionData();
  }, [cycle, targetWeek]);

  const addExercise = (templateId: string) => {
    const template = exerciseTemplates.find(t => t.id === templateId);
    if (!template) return;

    const progression = progressionData[template.name];
    let suggestedWeight = 0;
    let suggestedReps = 10;
    let suggestedRIR = 2;

    if (progression && progression.previousWeeks.length > 0) {
      const lastWeek = progression.previousWeeks[progression.previousWeeks.length - 1];
      const bestSet = lastWeek.bestSet;
      
      // Suggest progressive overload: +2.5-5 lbs or +1 rep
      suggestedWeight = bestSet.weight + 2.5;
      suggestedReps = bestSet.reps;
      suggestedRIR = Math.max(0, bestSet.rir - 0.5); // Slightly lower RIR for progression
    }

    const newExercise: Exercise = {
      id: generateId(),
      name: template.name,
      muscleGroup: template.muscleGroup,
      sets: [
        {
          id: generateId(),
          reps: suggestedReps,
          weight: suggestedWeight,
          rir: suggestedRIR
        }
      ]
    };

    setExercises([...exercises, newExercise]);
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter(e => e.id !== exerciseId));
  };

  const addSet = (exerciseId: string) => {
    const exercise = exercises.find(e => e.id === exerciseId);
    if (!exercise) return;

    // Use the last set as a template for the new set
    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet: ExerciseSet = {
      id: generateId(),
      reps: lastSet.reps,
      weight: lastSet.weight,
      rir: lastSet.rir
    };

    setExercises(exercises.map(ex => 
      ex.id === exerciseId 
        ? { ...ex, sets: [...ex.sets, newSet] }
        : ex
    ));
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setExercises(exercises.map(exercise => 
      exercise.id === exerciseId 
        ? { ...exercise, sets: exercise.sets.filter(s => s.id !== setId) }
        : exercise
    ));
  };

  const updateSet = (exerciseId: string, setId: string, field: keyof ExerciseSet, value: number) => {
    setExercises(exercises.map(exercise => 
      exercise.id === exerciseId 
        ? {
            ...exercise,
            sets: exercise.sets.map(set => 
              set.id === setId ? { ...set, [field]: value } : set
            )
          }
        : exercise
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workoutName.trim()) {
      alert('Please enter a workout name');
      return;
    }

    if (exercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    const newWorkout: Workout = {
      id: workout?.id || generateId(),
      name: workoutName.trim(),
      date: workoutDate,
      exercises,
      notes: notes.trim() || undefined
    };

    onSave(newWorkout);
  };

  const getRIRColor = (rir: number) => {
    if (rir <= 1) return 'bg-red-100 text-red-800';
    if (rir <= 2) return 'bg-orange-100 text-orange-800';
    if (rir <= 3) return 'bg-yellow-100 text-yellow-800';
    if (rir <= 4) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getWeekLabel = (weekKey: string) => {
    const labels: { [key: string]: string } = {
      week1: 'Week 1',
      week2: 'Week 2',
      week3: 'Week 3',
      week4: 'Week 4',
      deload: 'Deload Week'
    };
    return labels[weekKey] || weekKey;
  };

  const renderProgressionData = (exerciseName: string) => {
    const progression = progressionData[exerciseName];
    if (!progression || progression.previousWeeks.length === 0) {
      return (
        <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
          No previous data for this exercise in the current cycle.
        </div>
      );
    }

    // Get only the most recent week's data
    const lastWeekData = progression.previousWeeks[progression.previousWeeks.length - 1];

    return (
      <div className="bg-blue-50 p-3 rounded">
        <h5 className="text-sm font-medium text-blue-900 mb-2">Previous Week ({lastWeekData.week}):</h5>
        <div className="space-y-1">
          {lastWeekData.sets.map((set, setIndex) => (
            <div key={setIndex} className="text-xs text-blue-800 ml-2">
              #{setIndex + 1} {set.reps} × {set.weight}lbs @ {set.rir}
            </div>
          ))}
          <div className="text-xs text-blue-600 ml-2 mt-2">
            Volume: {lastWeekData.totalVolume}lbs
          </div>
        </div>
        <div className="mt-2 text-xs text-blue-700 break-words">
          💡 Try: +2.5lbs or +1 rep with -0.5 RIR
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {workout ? 'Edit Workout' : 'Create New Workout'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {cycle.name} - {getWeekLabel(targetWeek)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowRIRGuide(!showRIRGuide)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium self-start sm:self-auto"
        >
          {showRIRGuide ? 'Hide' : 'Show'} RIR Guide
        </button>
      </div>

      {showRIRGuide && <RIRGuide className="mb-6" />}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Workout Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="workoutName" className="block text-sm font-medium text-gray-700 mb-2">
              Workout Name *
            </label>
            <input
              type="text"
              id="workoutName"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="e.g., Push Day, Upper Body, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              required
            />
          </div>
          <div>
            <label htmlFor="workoutDate" className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              id="workoutDate"
              value={workoutDate}
              onChange={(e) => setWorkoutDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about this workout..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          />
        </div>

        {/* Add Exercise */}
        <div>
          <label htmlFor="addExercise" className="block text-sm font-medium text-gray-700 mb-2">
            Add Exercise
          </label>
          <select
            id="addExercise"
            onChange={(e) => {
              if (e.target.value) {
                addExercise(e.target.value);
                e.target.value = '';
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="">Select an exercise to add...</option>
            {exerciseTemplates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name} ({template.muscleGroup})
                {progressionData[template.name] && ' 📈'}
              </option>
            ))}
          </select>
        </div>

        {/* Exercises */}
        <div className="space-y-6">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {exercise.name}
                  <span className="text-sm text-gray-500 ml-2">({exercise.muscleGroup})</span>
                </h3>
                <button
                  type="button"
                  onClick={() => removeExercise(exercise.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove Exercise
                </button>
              </div>

              {/* Progression Data */}
              <div className="mb-4">
                {renderProgressionData(exercise.name)}
              </div>

              {/* Sets */}
              <div className="space-y-3">
                {/* Desktop header */}
                <div className="hidden sm:grid grid-cols-5 gap-2 text-sm font-medium text-gray-700 px-2">
                  <div>Set</div>
                  <div>Reps</div>
                  <div>Weight (lbs)</div>
                  <div>RIR</div>
                  <div></div>
                </div>

                {exercise.sets.map((set, setIndex) => (
                  <div key={set.id}>
                    {/* Desktop layout */}
                    <div className="hidden sm:grid grid-cols-5 gap-2 items-center">
                      <div className="text-sm text-gray-600 px-2">
                        {setIndex + 1}
                      </div>
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => updateSet(exercise.id, set.id, 'reps', parseInt(e.target.value) || 0)}
                        min="1"
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                      />
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) => updateSet(exercise.id, set.id, 'weight', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.5"
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                      />
                      <select
                        value={set.rir}
                        onChange={(e) => updateSet(exercise.id, set.id, 'rir', parseInt(e.target.value))}
                        className={`px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${getRIRColor(set.rir)}`}
                      >
                        {[0, 1, 2, 3, 4, 5].map(rir => (
                          <option key={rir} value={rir}>{rir}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeSet(exercise.id, set.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                        disabled={exercise.sets.length === 1}
                      >
                        ×
                      </button>
                    </div>

                    {/* Mobile layout */}
                    <div className="sm:hidden border border-gray-200 rounded-lg p-3 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Set {setIndex + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeSet(exercise.id, set.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                          disabled={exercise.sets.length === 1}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Reps</label>
                          <input
                            type="number"
                            value={set.reps}
                            onChange={(e) => updateSet(exercise.id, set.id, 'reps', parseInt(e.target.value) || 0)}
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Weight (lbs)</label>
                          <input
                            type="number"
                            value={set.weight}
                            onChange={(e) => updateSet(exercise.id, set.id, 'weight', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.5"
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">RIR</label>
                        <select
                          value={set.rir}
                          onChange={(e) => updateSet(exercise.id, set.id, 'rir', parseInt(e.target.value))}
                          className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${getRIRColor(set.rir)}`}
                        >
                          {[0, 1, 2, 3, 4, 5].map(rir => (
                            <option key={rir} value={rir}>{rir} RIR</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addSet(exercise.id)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Set
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            {workout ? 'Update Workout' : 'Save Workout'}
          </button>
        </div>
      </form>
    </div>
  );
}
