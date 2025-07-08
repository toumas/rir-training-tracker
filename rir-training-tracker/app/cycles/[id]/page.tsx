'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Cycle, Workout } from '../../lib/types';
import { getCycleById, getWorkouts } from '../../lib/storage';

export default function CycleDetailsPage() {
  const params = useParams();
  const cycleId = params.id as string;
  
  const [cycle, setCycle] = useState<Cycle | null>(null);
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      const cycleData = getCycleById(cycleId);
      const workoutsData = getWorkouts();
      
      setCycle(cycleData || null);
      setAllWorkouts(workoutsData);
      setLoading(false);
    };

    fetchData();
  }, [cycleId]);

  const getWorkoutById = (workoutId: string): Workout | undefined => {
    return allWorkouts.find(w => w.id === workoutId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getWeekDates = (startDate: string) => {
    const start = new Date(startDate);
    const weeks = [];
    
    for (let i = 0; i < 5; i++) {
      const weekStart = new Date(start);
      weekStart.setDate(start.getDate() + (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      weeks.push({
        start: weekStart.toLocaleDateString(),
        end: weekEnd.toLocaleDateString()
      });
    }
    
    return weeks;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!cycle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Cycle Not Found</h1>
          <Link
            href="/cycles"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Cycles
          </Link>
        </div>
      </div>
    );
  }

  const weekDates = getWeekDates(cycle.startDate);
  const weekLabels = [
    'Week 1',
    'Week 2', 
    'Week 3',
    'Week 4',
    'Deload Week'
  ];

  const weekKeys = ['week1', 'week2', 'week3', 'week4', 'deload'] as const;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/cycles"
          className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-block"
        >
          ← Back to Cycles
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{cycle.name}</h1>
            <p className="text-gray-600 mt-2">
              Started: {formatDate(cycle.startDate)}
            </p>
            {cycle.notes && (
              <p className="text-gray-700 mt-2">{cycle.notes}</p>
            )}
          </div>
          <Link
            href={`/cycles/${cycle.id}/analytics`}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            View Analytics
          </Link>
        </div>
      </div>

      {/* Cycle Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Workouts</h3>
          <p className="text-3xl font-bold text-blue-600">
            {Object.values(cycle.weeks).reduce((total, week) => total + week.length, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Duration</h3>
          <p className="text-3xl font-bold text-green-600">5 Weeks</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">End Date</h3>
          <p className="text-3xl font-bold text-purple-600">
            {(() => {
              const endDate = new Date(cycle.startDate);
              endDate.setDate(endDate.getDate() + 34); // 5 weeks - 1 day
              return endDate.toLocaleDateString();
            })()}
          </p>
        </div>
      </div>

      {/* Weekly Breakdown */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Weekly Breakdown</h2>
        
        {weekKeys.map((weekKey, index) => (
          <div key={weekKey} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {weekLabels[index]}
              </h3>
              <span className="text-sm text-gray-600">
                {weekDates[index].start} - {weekDates[index].end}
              </span>
            </div>
            
            {cycle.weeks[weekKey].length === 0 ? (
              <p className="text-gray-500 italic">No workouts scheduled for this week</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cycle.weeks[weekKey].map(workoutId => {
                  const workout = getWorkoutById(workoutId);
                  return workout ? (
                    <div key={workoutId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{workout.name}</h4>
                        <span className="text-xs text-gray-500">
                          {formatDate(workout.date)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                      </p>
                      <Link
                        href={`/workouts/${workout.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details →
                      </Link>
                    </div>
                  ) : (
                    <div key={workoutId} className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <p className="text-red-600 text-sm">Workout not found</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
