'use client';

import { useState, useEffect } from 'react';
import { Cycle, Workout } from '../lib/types';
import { getWorkouts, generateId, formatDate, saveWorkout } from '../lib/storage';
import CycleWorkoutForm from './CycleWorkoutForm';

interface CycleFormProps {
  cycle?: Cycle;
  onSave: (cycle: Cycle) => void;
  onCancel: () => void;
}

export default function CycleForm({ cycle, onSave, onCancel }: CycleFormProps) {
  const [cycleName, setCycleName] = useState(cycle?.name || '');
  const [startDate, setStartDate] = useState(cycle?.startDate || formatDate(new Date()));
  const [notes, setNotes] = useState(cycle?.notes || '');
  const [weeks, setWeeks] = useState(cycle?.weeks || {
    week1: [],
    week2: [],
    week3: [],
    week4: [],
    deload: []
  });
  const [availableWorkouts, setAvailableWorkouts] = useState<Workout[]>([]);
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [currentWeekForWorkout, setCurrentWeekForWorkout] = useState<string>('');

  useEffect(() => {
    setAvailableWorkouts(getWorkouts());
  }, []);

  const addWorkoutToWeek = (weekKey: keyof typeof weeks, workoutId: string) => {
    if (!workoutId) return;
    
    setWeeks(prev => ({
      ...prev,
      [weekKey]: [...prev[weekKey], workoutId]
    }));
  };

  const removeWorkoutFromWeek = (weekKey: keyof typeof weeks, workoutId: string) => {
    setWeeks(prev => ({
      ...prev,
      [weekKey]: prev[weekKey].filter(id => id !== workoutId)
    }));
  };

  const getWorkoutName = (workoutId: string) => {
    const workout = availableWorkouts.find(w => w.id === workoutId);
    return workout ? workout.name : 'Unknown Workout';
  };

  const getAvailableWorkoutsForWeek = (weekKey: keyof typeof weeks) => {
    const usedWorkoutIds = Object.entries(weeks)
      .filter(([key]) => key !== weekKey)
      .flatMap(([, workoutIds]) => workoutIds);
    
    return availableWorkouts.filter(w => !usedWorkoutIds.includes(w.id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cycleName.trim()) {
      alert('Please enter a cycle name');
      return;
    }

    if (!startDate) {
      alert('Please select a start date');
      return;
    }

    const newCycle: Cycle = {
      id: cycle?.id || generateId(),
      name: cycleName.trim(),
      startDate,
      weeks,
      notes: notes.trim() || undefined
    };

    onSave(newCycle);
  };

  const handleCreateWorkout = (weekKey: string) => {
    setCurrentWeekForWorkout(weekKey);
    setShowWorkoutForm(true);
  };

  const handleWorkoutSave = (workout: Workout) => {
    // Save the workout to storage
    saveWorkout(workout);
    
    // Add it to the current week
    setWeeks(prev => ({
      ...prev,
      [currentWeekForWorkout]: [...prev[currentWeekForWorkout as keyof typeof prev], workout.id]
    }));
    
    // Refresh available workouts
    setAvailableWorkouts(getWorkouts());
    
    // Close the form
    setShowWorkoutForm(false);
    setCurrentWeekForWorkout('');
  };

  const handleWorkoutCancel = () => {
    setShowWorkoutForm(false);
    setCurrentWeekForWorkout('');
  };

  const weekLabels = {
    week1: 'Week 1',
    week2: 'Week 2', 
    week3: 'Week 3',
    week4: 'Week 4',
    deload: 'Deload Week'
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {showWorkoutForm ? (
        <CycleWorkoutForm
          cycle={{
            id: cycle?.id || generateId(),
            name: cycleName.trim() || 'New Cycle',
            startDate,
            weeks,
            notes: notes.trim() || undefined
          }}
          targetWeek={currentWeekForWorkout}
          onSave={handleWorkoutSave}
          onCancel={handleWorkoutCancel}
        />
      ) : (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {cycle ? 'Edit Cycle' : 'Create New Cycle'}
          </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cycle Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cycleName" className="block text-sm font-medium text-gray-700 mb-2">
              Cycle Name *
            </label>
            <input
              type="text"
              id="cycleName"
              value={cycleName}
              onChange={(e) => setCycleName(e.target.value)}
              placeholder="e.g., Strength Block 1, Hypertrophy Phase"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              required
            />
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
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
            placeholder="Add any notes about this training cycle..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          />
        </div>

        {/* Weekly Workout Assignment */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Assign Workouts to Weeks</h3>
          
          {Object.entries(weeks).map(([weekKey, workoutIds]) => (
            <div key={weekKey} className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 mb-3">
                {weekLabels[weekKey as keyof typeof weekLabels]}
              </h4>
              
              {/* Add Workout Dropdown */}
              <div className="mb-3 space-y-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addWorkoutToWeek(weekKey as keyof typeof weeks, e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Add existing workout to this week...</option>
                  {getAvailableWorkoutsForWeek(weekKey as keyof typeof weeks).map(workout => (
                    <option key={workout.id} value={workout.id}>
                      {workout.name} ({new Date(workout.date).toLocaleDateString()})
                    </option>
                  ))}
                </select>
                
                <button
                  type="button"
                  onClick={() => handleCreateWorkout(weekKey)}
                  className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium transition-colors"
                >
                  + Create New Workout for {weekLabels[weekKey as keyof typeof weekLabels]}
                </button>
              </div>

              {/* Assigned Workouts */}
              <div className="space-y-2">
                {workoutIds.map(workoutId => (
                  <div key={workoutId} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-900">{getWorkoutName(workoutId)}</span>
                    <button
                      type="button"
                      onClick={() => removeWorkoutFromWeek(weekKey as keyof typeof weeks, workoutId)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {workoutIds.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No workouts assigned to this week</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Training Cycle Guidelines</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Weeks 1-4: Progressive overload with decreasing RIR</li>
            <li>• Deload Week: Reduced volume and intensity for recovery</li>
            <li>• You can assign multiple workouts per week or reuse workouts</li>
            <li>• Each workout can only be assigned to one week at a time</li>
          </ul>
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
            {cycle ? 'Update Cycle' : 'Save Cycle'}
          </button>
        </div>
      </form>
      </>
      )}
    </div>
  );
}
