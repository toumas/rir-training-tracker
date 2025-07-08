import { ExerciseTemplate } from '../lib/types';
import Link from 'next/link';

interface ExerciseCardProps {
  exercise: ExerciseTemplate;
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  const getMuscleGroupColor = (muscleGroup: string) => {
    const colors: { [key: string]: string } = {
      'Chest': 'bg-red-100 text-red-800',
      'Back': 'bg-green-100 text-green-800',
      'Legs': 'bg-blue-100 text-blue-800',
      'Shoulders': 'bg-yellow-100 text-yellow-800',
      'Arms': 'bg-purple-100 text-purple-800',
      'Core': 'bg-orange-100 text-orange-800',
    };
    return colors[muscleGroup] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{exercise.name}</h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getMuscleGroupColor(
            exercise.muscleGroup
          )}`}
        >
          {exercise.muscleGroup}
        </span>
      </div>
      
      {exercise.equipment && (
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Equipment:</span> {exercise.equipment}
        </p>
      )}
      
      {exercise.instructions && (
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">
          {exercise.instructions}
        </p>
      )}
      
      <Link
        href={`/exercises/${exercise.id}`}
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        View Details
      </Link>
    </div>
  );
}
