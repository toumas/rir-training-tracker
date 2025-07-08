'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ExerciseTemplate } from '../../lib/types';
import { getExerciseTemplateById } from '../../lib/storage';

export default function ExerciseDetailPage() {
  const params = useParams();
  const [exercise, setExercise] = useState<ExerciseTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const exerciseId = Array.isArray(params.id) ? params.id[0] : params.id;
      const foundExercise = getExerciseTemplateById(exerciseId);
      setExercise(foundExercise || null);
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Exercise Not Found</h1>
          <p className="text-gray-600 mb-6">
            The exercise you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/exercises"
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Exercises
          </Link>
        </div>
      </div>
    );
  }

  const getMuscleGroupColor = (muscleGroup: string) => {
    const colors: { [key: string]: string } = {
      'Chest': 'bg-red-100 text-red-800 border-red-200',
      'Back': 'bg-green-100 text-green-800 border-green-200',
      'Legs': 'bg-blue-100 text-blue-800 border-blue-200',
      'Shoulders': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Arms': 'bg-purple-100 text-purple-800 border-purple-200',
      'Core': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[muscleGroup] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/exercises"
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          ← Back to Exercises
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{exercise.name}</h1>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getMuscleGroupColor(
                exercise.muscleGroup
              )}`}
            >
              {exercise.muscleGroup}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Exercise Details</h2>
            
            {exercise.equipment && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Equipment Needed</h3>
                <p className="text-gray-600">{exercise.equipment}</p>
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Primary Muscle Group</h3>
              <p className="text-gray-600">{exercise.muscleGroup}</p>
            </div>
          </div>

          {exercise.instructions && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">{exercise.instructions}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">RIR Guidelines</h2>
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Reps in Reserve (RIR) Scale:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li><strong>RIR 0:</strong> Could not do another rep (muscle failure)</li>
              <li><strong>RIR 1:</strong> Could do 1 more rep</li>
              <li><strong>RIR 2:</strong> Could do 2 more reps</li>
              <li><strong>RIR 3:</strong> Could do 3 more reps</li>
              <li><strong>RIR 4:</strong> Could do 4 more reps (moderate intensity)</li>
              <li><strong>RIR 5+:</strong> Could do 5+ more reps (light intensity)</li>
            </ul>
            <p className="text-sm text-blue-700 mt-3">
              <strong>Tip:</strong> For hypertrophy, aim for RIR 0-2. For strength, RIR 2-4 works well.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
