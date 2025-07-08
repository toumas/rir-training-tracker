'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Workout } from '../../lib/types';
import { getWorkoutById, deleteWorkout, saveWorkout } from '../../lib/storage';
import WorkoutForm from '../../components/WorkoutForm';

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (params.id) {
      const workoutId = Array.isArray(params.id) ? params.id[0] : params.id;
      const foundWorkout = getWorkoutById(workoutId);
      setWorkout(foundWorkout || null);
      setLoading(false);
    }
  }, [params.id]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = (updatedWorkout: Workout) => {
    saveWorkout(updatedWorkout);
    setWorkout(updatedWorkout);
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setEditing(false);
  };

  const handleDelete = () => {
    if (workout && confirm('Are you sure you want to delete this workout? This action cannot be undone.')) {
      deleteWorkout(workout.id);
      router.push('/workouts');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTotalVolume = (workout: Workout) => {
    return workout.exercises.reduce((total, exercise) => {
      return total + exercise.sets.reduce((setTotal, set) => {
        return setTotal + (set.reps * set.weight);
      }, 0);
    }, 0);
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

  const getRIRColor = (rir: number) => {
    if (rir <= 1) return 'bg-red-100 text-red-800';
    if (rir <= 2) return 'bg-orange-100 text-orange-800';
    if (rir <= 3) return 'bg-yellow-100 text-yellow-800';
    if (rir <= 4) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getIntensityLabel = (avgRIR: number) => {
    if (avgRIR <= 1) return 'Very High';
    if (avgRIR <= 2) return 'High';
    if (avgRIR <= 3) return 'Moderate-High';
    if (avgRIR <= 4) return 'Moderate';
    return 'Light';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Workout Not Found</h1>
          <p className="text-gray-600 mb-6">
            The workout you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/workouts"
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Workouts
          </Link>
        </div>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <WorkoutForm
          workout={workout}
          onSave={handleSave}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  const avgRIR = getAverageRIR(workout);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/workouts"
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          ← Back to Workouts
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{workout.name}</h1>
            <p className="text-lg text-gray-600 mb-4">{formatDate(workout.date)}</p>
            
            {workout.notes && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
                <p className="text-gray-700">{workout.notes}</p>
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleEdit}
              className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Edit Workout
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition-colors"
            >
              Delete Workout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{workout.exercises.length}</div>
            <div className="text-sm text-gray-600">Exercise{workout.exercises.length !== 1 ? 's' : ''}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{getTotalSets(workout)}</div>
            <div className="text-sm text-gray-600">Total Sets</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{getTotalVolume(workout).toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Volume (lbs)</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className={`inline-block px-3 py-1 rounded-full text-lg font-bold ${getRIRColor(avgRIR)}`}>
              {avgRIR.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Avg RIR ({getIntensityLabel(avgRIR)})
            </div>
          </div>
        </div>

        {/* Exercises */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Exercises</h2>
          
          {workout.exercises.map((exercise, exerciseIndex) => (
            <div key={exercise.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {exerciseIndex + 1}. {exercise.name}
                </h3>
                <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {exercise.muscleGroup}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-sm font-medium text-gray-700">Set</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-700">Reps</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-700">Weight (lbs)</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-700">RIR</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-700">Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercise.sets.map((set, setIndex) => (
                      <tr key={set.id} className="border-b border-gray-100">
                        <td className="py-2 text-sm text-gray-900">{setIndex + 1}</td>
                        <td className="py-2 text-sm text-gray-900">{set.reps}</td>
                        <td className="py-2 text-sm text-gray-900">{set.weight}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getRIRColor(set.rir)}`}>
                            {set.rir}
                          </span>
                        </td>
                        <td className="py-2 text-sm text-gray-900">
                          {(set.reps * set.weight).toLocaleString()} lbs
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Exercise Summary */}
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium text-gray-900">{exercise.sets.length}</div>
                  <div className="text-gray-600">Sets</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">
                    {exercise.sets.reduce((sum, set) => sum + (set.reps * set.weight), 0).toLocaleString()}
                  </div>
                  <div className="text-gray-600">Volume (lbs)</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">
                    {(exercise.sets.reduce((sum, set) => sum + set.rir, 0) / exercise.sets.length).toFixed(1)}
                  </div>
                  <div className="text-gray-600">Avg RIR</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
