'use client';

import { useState, useEffect } from 'react';
import { ExerciseTemplate } from '../lib/types';
import { getExerciseTemplates } from '../lib/storage';
import ExerciseCard from '../components/ExerciseCard';

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<ExerciseTemplate[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<ExerciseTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');

  useEffect(() => {
    const loadedExercises = getExerciseTemplates();
    setExercises(loadedExercises);
    setFilteredExercises(loadedExercises);
  }, []);

  useEffect(() => {
    let filtered = exercises;

    if (searchTerm) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedMuscleGroup) {
      filtered = filtered.filter(exercise => exercise.muscleGroup === selectedMuscleGroup);
    }

    setFilteredExercises(filtered);
  }, [exercises, searchTerm, selectedMuscleGroup]);

  const muscleGroups = Array.from(new Set(exercises.map(e => e.muscleGroup))).sort();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Exercise Database</h1>
        <p className="text-gray-600 mb-6">
          Browse our collection of exercises for your training routine.
        </p>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search exercises
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or muscle group..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="muscleGroup" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by muscle group
              </label>
              <select
                id="muscleGroup"
                value={selectedMuscleGroup}
                onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All muscle groups</option>
                {muscleGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-600 mb-4">
          Showing {filteredExercises.length} of {exercises.length} exercises
        </p>
      </div>

      {/* Exercise Grid */}
      {filteredExercises.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏋️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No exercises found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedMuscleGroup
              ? 'Try adjusting your search or filter criteria.'
              : 'No exercises available.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}
    </div>
  );
}
