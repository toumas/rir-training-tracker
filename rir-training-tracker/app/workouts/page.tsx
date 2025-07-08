'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Workout } from '../lib/types';
import { getWorkouts, saveWorkout, deleteWorkout } from '../lib/storage';
import WorkoutForm from '../components/WorkoutForm';

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | undefined>();
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = () => {
    const loadedWorkouts = getWorkouts();
    setWorkouts(loadedWorkouts);
  };

  const sortedWorkouts = [...workouts].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    } else {
      return sortOrder === 'desc' 
        ? b.name.localeCompare(a.name)
        : a.name.localeCompare(b.name);
    }
  });

  const handleSaveWorkout = (workout: Workout) => {
    saveWorkout(workout);
    loadWorkouts();
    setShowForm(false);
    setEditingWorkout(undefined);
  };

  const handleEditWorkout = (workout: Workout) => {
    setEditingWorkout(workout);
    setShowForm(true);
  };

  const handleDeleteWorkout = (id: string) => {
    if (confirm('Are you sure you want to delete this workout? This action cannot be undone.')) {
      deleteWorkout(id);
      loadWorkouts();
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingWorkout(undefined);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTotalSets = (workout: Workout) => {
    return workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
  };

  const getAverageRIR = (workout: Workout): number => {
    const allSets = workout.exercises.flatMap(exercise => exercise.sets);
    if (allSets.length === 0) return 0;
    const totalRIR = allSets.reduce((sum, set) => sum + set.rir, 0);
    return totalRIR / allSets.length;
  };

  const getRIRColor = (avgRIR: number) => {
    if (avgRIR <= 1.5) return 'bg-red-100 text-red-800';
    if (avgRIR <= 2.5) return 'bg-orange-100 text-orange-800';
    if (avgRIR <= 3.5) return 'bg-yellow-100 text-yellow-800';
    if (avgRIR <= 4.5) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <WorkoutForm
          workout={editingWorkout}
          onSave={handleSaveWorkout}
          onCancel={handleCancelForm}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Workout History</h1>
          <p className="text-gray-600">
            View and manage your training sessions.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          New Workout
        </button>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏋️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workouts yet</h3>
          <p className="text-gray-600 mb-6">
            Start tracking your training by creating your first workout.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Create First Workout
          </button>
        </div>
      ) : (
        <>
          {/* Sort Controls */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Order:</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="desc">Newest first</option>
                  <option value="asc">Oldest first</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">
                {workouts.length} workout{workouts.length !== 1 ? 's' : ''} total
              </div>
            </div>
          </div>

          {/* Workouts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedWorkouts.map((workout) => {
              const avgRIR = getAverageRIR(workout);
              return (
                <div key={workout.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {workout.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(workout.date)}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getRIRColor(avgRIR)}`}
                    >
                      Avg RIR: {avgRIR.toFixed(1)}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">{workout.exercises.length}</span> exercise{workout.exercises.length !== 1 ? 's' : ''}
                      {' • '}
                      <span className="font-medium">{getTotalSets(workout)}</span> total sets
                    </p>
                    
                    {workout.exercises.length > 0 && (
                      <div className="text-xs text-gray-500">
                        {workout.exercises.slice(0, 3).map(ex => ex.name).join(', ')}
                        {workout.exercises.length > 3 && ` +${workout.exercises.length - 3} more`}
                      </div>
                    )}
                  </div>

                  {workout.notes && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {workout.notes}
                    </p>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <Link
                      href={`/workouts/${workout.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details
                    </Link>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditWorkout(workout)}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteWorkout(workout.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
