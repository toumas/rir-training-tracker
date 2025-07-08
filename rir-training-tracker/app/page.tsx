'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Workout } from './lib/types';
import { getWorkouts } from './lib/storage';
import { useWeightDisplay } from './lib/unitConversion';

export default function Dashboard() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const { formatWeight, unit } = useWeightDisplay();

  useEffect(() => {
    const loadedWorkouts = getWorkouts();
    setWorkouts(loadedWorkouts);
    setLoading(false);
  }, []);

  const getRecentWorkouts = () => {
    return [...workouts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  const getTotalSets = () => {
    return workouts.reduce((total, workout) => {
      return total + workout.exercises.reduce((setTotal, exercise) => {
        return setTotal + exercise.sets.length;
      }, 0);
    }, 0);
  };

  const getTotalVolume = () => {
    const totalVolumeInKg = workouts.reduce((total, workout) => {
      return total + workout.exercises.reduce((workoutTotal, exercise) => {
        return workoutTotal + exercise.sets.reduce((setTotal, set) => {
          return setTotal + (set.reps * set.weight);
        }, 0);
      }, 0);
    }, 0);
    
    // Convert from kg (stored format) to display format
    const displayValue = formatWeight(totalVolumeInKg, 'kg');
    // Extract just the numeric value for display
    return parseFloat(displayValue.split(' ')[0]);
  };

  const getAverageRIR = (): number => {
    const allSets = workouts.flatMap(workout => 
      workout.exercises.flatMap(exercise => exercise.sets)
    );
    if (allSets.length === 0) return 0;
    const totalRIR = allSets.reduce((sum, set) => sum + set.rir, 0);
    return totalRIR / allSets.length;
  };

  const getWorkoutFrequency = () => {
    if (workouts.length < 2) return 0;
    
    const sortedWorkouts = [...workouts].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const firstDate = new Date(sortedWorkouts[0].date);
    const lastDate = new Date(sortedWorkouts[sortedWorkouts.length - 1].date);
    const daysDiff = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
    
    return daysDiff > 0 ? workouts.length / (daysDiff / 7) : 0;
  };

  const getMostTrainedMuscleGroups = () => {
    const muscleGroupCount: { [key: string]: number } = {};
    
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        muscleGroupCount[exercise.muscleGroup] = (muscleGroupCount[exercise.muscleGroup] || 0) + 1;
      });
    });

    return Object.entries(muscleGroupCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getRIRColor = (rir: number) => {
    if (rir <= 1.5) return 'bg-red-100 text-red-800';
    if (rir <= 2.5) return 'bg-orange-100 text-orange-800';
    if (rir <= 3.5) return 'bg-yellow-100 text-yellow-800';
    if (rir <= 4.5) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getIntensityLabel = (avgRIR: number) => {
    if (avgRIR <= 1.5) return 'Very High';
    if (avgRIR <= 2.5) return 'High';
    if (avgRIR <= 3.5) return 'Moderate-High';
    if (avgRIR <= 4.5) return 'Moderate';
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

  const recentWorkouts = getRecentWorkouts();
  const avgRIR = getAverageRIR();
  const mostTrainedMuscleGroups = getMostTrainedMuscleGroups();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Training Dashboard</h1>
        <p className="text-gray-600">
          Track your progress using the Reps in Reserve methodology
        </p>
      </div>

      {workouts.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏋️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to RIR Training Tracker</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Start your fitness journey by logging your first workout. Track your progress with the 
            scientifically-backed Reps in Reserve methodology.
          </p>
          <div className="space-y-3">
            <Link
              href="/workouts"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Create Your First Workout
            </Link>
            <div className="block">
              <Link
                href="/exercises"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Browse Exercise Database
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Workouts</p>
                  <p className="text-2xl font-bold text-gray-900">{workouts.length}</p>
                </div>
                <div className="text-blue-500 text-3xl">🏋️</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sets</p>
                  <p className="text-2xl font-bold text-gray-900">{getTotalSets().toLocaleString()}</p>
                </div>
                <div className="text-green-500 text-3xl">💪</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Volume</p>
                  <p className="text-2xl font-bold text-gray-900">{getTotalVolume().toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{unit} lifted</p>
                </div>
                <div className="text-purple-500 text-3xl">📈</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Intensity</p>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-sm font-bold ${getRIRColor(avgRIR)}`}>
                      RIR {avgRIR.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{getIntensityLabel(avgRIR)}</p>
                </div>
                <div className="text-orange-500 text-3xl">🔥</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Workouts */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Workouts</h2>
                <Link 
                  href="/workouts"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All
                </Link>
              </div>

              {recentWorkouts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No workouts yet</p>
              ) : (
                <div className="space-y-3">
                  {recentWorkouts.map((workout) => {
                    const workoutAvgRIR = workout.exercises.length > 0 
                      ? workout.exercises.flatMap(e => e.sets).reduce((sum, set) => sum + set.rir, 0) / 
                        workout.exercises.flatMap(e => e.sets).length
                      : 0;

                    return (
                      <Link
                        key={workout.id}
                        href={`/workouts/${workout.id}`}
                        className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{workout.name}</h3>
                            <p className="text-sm text-gray-600">
                              {formatDate(workout.date)} • {workout.exercises.length} exercises
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getRIRColor(workoutAvgRIR)}`}>
                            RIR {workoutAvgRIR.toFixed(1)}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  href="/workouts"
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors text-center block"
                >
                  Log New Workout
                </Link>
              </div>
            </div>

            {/* Training Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Training Insights</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Workout Frequency</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {getWorkoutFrequency().toFixed(1)} workouts/week
                  </p>
                  <p className="text-xs text-gray-500">Average over time</p>
                </div>

                {mostTrainedMuscleGroups.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Most Trained Muscle Groups</h3>
                    <div className="space-y-2">
                      {mostTrainedMuscleGroups.map(([muscleGroup, count], index) => (
                        <div key={muscleGroup} className="flex justify-between items-center">
                          <span className="text-sm text-gray-900">
                            {index + 1}. {muscleGroup}
                          </span>
                          <span className="text-sm text-gray-500">{count} times</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <Link
                      href="/exercises"
                      className="block text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Browse Exercise Database →
                    </Link>
                    <Link
                      href="/workouts"
                      className="block text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Workout History →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIR Guide */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">RIR Scale Reference</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { rir: 0, desc: 'Muscle failure', intensity: 'Maximum', color: 'bg-red-100 text-red-800' },
                { rir: 1, desc: '1 rep left', intensity: 'Very High', color: 'bg-red-50 text-red-700' },
                { rir: 2, desc: '2 reps left', intensity: 'High', color: 'bg-orange-100 text-orange-800' },
                { rir: 3, desc: '3 reps left', intensity: 'Moderate-High', color: 'bg-yellow-100 text-yellow-800' },
                { rir: 4, desc: '4 reps left', intensity: 'Moderate', color: 'bg-green-100 text-green-800' },
                { rir: 5, desc: '5+ reps left', intensity: 'Light', color: 'bg-blue-100 text-blue-800' },
              ].map((item) => (
                <div key={item.rir} className={`p-3 rounded-lg ${item.color}`}>
                  <div className="font-bold">RIR {item.rir}</div>
                  <div className="text-sm">{item.desc}</div>
                  <div className="text-xs opacity-75">{item.intensity}</div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-4">
              <strong>Tip:</strong> For muscle growth (hypertrophy), aim for RIR 0-2. For strength training, RIR 2-4 works well.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
