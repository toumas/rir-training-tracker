'use client';

import { Cycle, Workout } from '../lib/types';
import { getWorkouts } from '../lib/storage';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CycleAnalyticsProps {
  cycle: Cycle;
}

interface WeeklyStats {
  week: string;
  totalVolume: number;
  avgRIR: number;
  totalSets: number;
  totalReps: number;
  avgWeight: number;
}

export default function CycleAnalytics({ cycle }: CycleAnalyticsProps) {
  const allWorkouts = getWorkouts();

  const getWorkoutsForCycle = (): { [key: string]: Workout[] } => {
    const cycleWorkouts: { [key: string]: Workout[] } = {};
    
    Object.entries(cycle.weeks).forEach(([weekKey, workoutIds]) => {
      cycleWorkouts[weekKey] = workoutIds
        .map(id => allWorkouts.find(w => w.id === id))
        .filter((workout): workout is Workout => workout !== undefined);
    });
    
    return cycleWorkouts;
  };

  const calculateWeeklyStats = (): WeeklyStats[] => {
    const cycleWorkouts = getWorkoutsForCycle();
    const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Deload'];
    const weekKeys = ['week1', 'week2', 'week3', 'week4', 'deload'];
    
    return weekKeys.map((weekKey, index) => {
      const workouts = cycleWorkouts[weekKey] || [];
      
      let totalVolume = 0;
      let totalSets = 0;
      let totalReps = 0;
      let totalRIR = 0;
      let totalWeight = 0;
      let setCount = 0;
      
      workouts.forEach(workout => {
        workout.exercises.forEach(exercise => {
          exercise.sets.forEach(set => {
            totalVolume += set.weight * set.reps;
            totalSets++;
            totalReps += set.reps;
            totalRIR += set.rir;
            totalWeight += set.weight;
            setCount++;
          });
        });
      });
      
      return {
        week: weekLabels[index],
        totalVolume,
        avgRIR: setCount > 0 ? totalRIR / setCount : 0,
        totalSets,
        totalReps,
        avgWeight: setCount > 0 ? totalWeight / setCount : 0,
      };
    });
  };

  const getMuscleGroupBreakdown = () => {
    const cycleWorkouts = getWorkoutsForCycle();
    const muscleGroups: { [key: string]: number } = {};
    
    Object.values(cycleWorkouts).flat().forEach(workout => {
      workout.exercises.forEach(exercise => {
        const sets = exercise.sets.length;
        muscleGroups[exercise.muscleGroup] = (muscleGroups[exercise.muscleGroup] || 0) + sets;
      });
    });
    
    return muscleGroups;
  };

  const weeklyStats = calculateWeeklyStats();
  const muscleGroupData = getMuscleGroupBreakdown();

  const volumeProgressData = {
    labels: weeklyStats.map(stat => stat.week),
    datasets: [
      {
        label: 'Training Volume (lbs)',
        data: weeklyStats.map(stat => stat.totalVolume),
        borderColor: 'rgb(59, 130, 246)',
        baclbsroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const rirProgressData = {
    labels: weeklyStats.map(stat => stat.week),
    datasets: [
      {
        label: 'Average RIR',
        data: weeklyStats.map(stat => stat.avgRIR),
        borderColor: 'rgb(34, 197, 94)',
        baclbsroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const muscleGroupChartData = {
    labels: Object.keys(muscleGroupData),
    datasets: [
      {
        label: 'Total Sets',
        data: Object.values(muscleGroupData),
        baclbsroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(249, 115, 22, 0.8)',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Training Progress',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const totalStats = weeklyStats.reduce(
    (totals, week) => ({
      totalVolume: totals.totalVolume + week.totalVolume,
      totalSets: totals.totalSets + week.totalSets,
      totalReps: totals.totalReps + week.totalReps,
    }),
    { totalVolume: 0, totalSets: 0, totalReps: 0 }
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Cycle Analytics</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Volume</h3>
          <p className="text-3xl font-bold text-blue-600">
            {totalStats.totalVolume.toLocaleString()} lbs
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Sets</h3>
          <p className="text-3xl font-bold text-green-600">{totalStats.totalSets}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Reps</h3>
          <p className="text-3xl font-bold text-purple-600">{totalStats.totalReps}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Avg RIR</h3>
          <p className="text-3xl font-bold text-orange-600">
            {(weeklyStats.reduce((sum, week) => sum + week.avgRIR, 0) / weeklyStats.length).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Volume Progress */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume Progression</h3>
          <Line data={volumeProgressData} options={chartOptions} />
        </div>

        {/* RIR Progress */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">RIR Progression</h3>
          <Line data={rirProgressData} options={chartOptions} />
        </div>
      </div>

      {/* Muscle Group Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Muscle Group Distribution</h3>
        <div className="max-w-md mx-auto">
          <Bar data={muscleGroupChartData} options={chartOptions} />
        </div>
      </div>

      {/* Weekly Breakdown Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h3 className="text-lg font-semibold text-gray-900 p-6 border-b border-gray-200">
          Weekly Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Week
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volume (lbs)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sets
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reps
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg RIR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Weight
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {weeklyStats.map((stat, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {stat.week}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stat.totalVolume.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stat.totalSets}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stat.totalReps}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stat.avgRIR.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stat.avgWeight.toFixed(1)} lbs
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Workout Breakdown */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h3 className="text-lg font-semibold text-gray-900 p-6 border-b border-gray-200">
          Detailed Workout Breakdown
        </h3>
        <div className="p-6 space-y-8">
          {Object.entries(getWorkoutsForCycle()).map(([weekKey, workouts]) => {
            const weekLabels: { [key: string]: string } = {
              week1: 'Week 1',
              week2: 'Week 2',
              week3: 'Week 3',
              week4: 'Week 4',
              deload: 'Deload Week'
            };
            
            if (workouts.length === 0) return null;
            
            return (
              <div key={weekKey} className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  {weekLabels[weekKey]}
                </h4>
                
                {workouts.map((workout, workoutIndex) => (
                  <div key={workout.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="text-lg font-medium text-gray-900">{workout.name}</h5>
                      <span className="text-sm text-gray-700 font-medium">
                        {new Date(workout.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {workout.exercises.map((exercise, exerciseIndex) => (
                      <div key={exercise.id} className="mb-4 last:mb-0">
                        <h6 className="text-md font-medium text-gray-900 mb-2">
                          {exercise.name} <span className="text-sm text-gray-700">({exercise.muscleGroup})</span>
                        </h6>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                          {exercise.sets.map((set, setIndex) => (
                            <div key={set.id} className="bg-gray-100 border border-gray-300 p-3 rounded text-sm">
                              <span className="font-semibold text-gray-900">#{setIndex + 1}:</span>{' '}
                              <span className="text-gray-900">{set.reps} × {set.weight}lbs @ {set.rir} RIR</span>
                              <div className="text-sm text-gray-700 mt-1">
                                Vol: {(set.reps * set.weight).toLocaleString()}lbs
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Exercise summary */}
                        <div className="mt-2 text-sm text-gray-800 font-medium">
                          Total: {exercise.sets.length} sets, {' '}
                          {exercise.sets.reduce((sum, set) => sum + (set.reps * set.weight), 0).toLocaleString()}lbs volume
                        </div>
                      </div>
                    ))}
                    
                    {workout.notes && (
                      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                        <span className="font-medium text-yellow-800">Notes:</span>{' '}
                        <span className="text-yellow-700">{workout.notes}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
