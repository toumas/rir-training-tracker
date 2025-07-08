'use client';

import { useState, useEffect } from 'react';
import { Workout, Exercise, ExerciseSet, ExerciseTemplate } from '../lib/types';
import { getExerciseTemplates, generateId, formatDate } from '../lib/storage';
import RIRGuide from './RIRGuide';

interface WorkoutFormProps {
  workout?: Workout;
  onSave: (workout: Workout) => void;
  onCancel: () => void;
}

export default function WorkoutForm({ workout, onSave, onCancel }: WorkoutFormProps) {
  const [workoutName, setWorkoutName] = useState(workout?.name || '');
  const [workoutDate, setWorkoutDate] = useState(workout?.date || formatDate(new Date()));
  const [notes, setNotes] = useState(workout?.notes || '');
  const [exercises, setExercises] = useState<Exercise[]>(workout?.exercises || []);
  const [exerciseTemplates, setExerciseTemplates] = useState<ExerciseTemplate[]>([]);
  const [showRIRGuide, setShowRIRGuide] = useState(false);

  useEffect(() => {
    setExerciseTemplates(getExerciseTemplates());
  }, []);

  const addExercise = (templateId: string) => {
    const template = exerciseTemplates.find(t => t.id === templateId);
    if (!template) return;

    const newExercise: Exercise = {
      id: generateId(),
      name: template.name,
      muscleGroup: template.muscleGroup,
      sets: [
        {
          id: generateId(),
          reps: 10,
          weight: 0,
          rir: 2
        }
      ]
    };

    setExercises([...exercises, newExercise]);
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter(e => e.id !== exerciseId));
  };

  const addSet = (exerciseId: string) => {
    const newSet: ExerciseSet = {
      id: generateId(),
      reps: 10,
      weight: 0,
      rir: 2
    };

    setExercises(exercises.map(exercise => 
      exercise.id === exerciseId 
        ? { ...exercise, sets: [...exercise.sets, newSet] }
        : exercise
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {workout ? 'Edit Workout' : 'Create New Workout'}
        </h2>
        <button
          type="button"
          onClick={() => setShowRIRGuide(!showRIRGuide)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
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
              }              }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="">Select an exercise to add...</option>
            {exerciseTemplates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name} ({template.muscleGroup})
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

              {/* Sets */}
              <div className="space-y-3">
                <div className="grid grid-cols-5 gap-2 text-sm font-medium text-gray-700 px-2">
                  <div>Set</div>
                  <div>Reps</div>
                  <div>Weight (lbs)</div>
                  <div>RIR</div>
                  <div></div>
                </div>

                {exercise.sets.map((set, setIndex) => (
                  <div key={set.id} className="grid grid-cols-5 gap-2 items-center">
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
                    <div className="flex items-center space-x-1">
                      <select
                        value={set.rir}
                        onChange={(e) => updateSet(exercise.id, set.id, 'rir', parseInt(e.target.value))}
                        className={`px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${getRIRColor(set.rir)}`}
                      >
                        {[0, 1, 2, 3, 4, 5].map(rir => (
                          <option key={rir} value={rir}>{rir}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSet(exercise.id, set.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      disabled={exercise.sets.length === 1}
                    >
                      ×
                    </button>
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
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            {workout ? 'Update Workout' : 'Save Workout'}
          </button>
        </div>
      </form>
    </div>
  );
}
