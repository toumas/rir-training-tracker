import { Cycle } from '../lib/types';
import Link from 'next/link';

interface CycleCardProps {
  cycle: Cycle;
}

export default function CycleCard({ cycle }: CycleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTotalWorkouts = () => {
    return Object.values(cycle.weeks).reduce((total, week) => total + week.length, 0);
  };

  const getStatusColor = () => {
    const startDate = new Date(cycle.startDate);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) {
      return 'bg-gray-100 text-gray-800'; // Future
    } else if (daysDiff <= 35) { // 5 weeks
      return 'bg-green-100 text-green-800'; // Active
    } else {
      return 'bg-blue-100 text-blue-800'; // Completed
    }
  };

  const getStatus = () => {
    const startDate = new Date(cycle.startDate);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) {
      return 'Upcoming';
    } else if (daysDiff <= 35) { // 5 weeks
      const weekNumber = Math.floor(daysDiff / 7) + 1;
      if (weekNumber <= 4) {
        return `Week ${weekNumber}`;
      } else {
        return 'Deload';
      }
    } else {
      return 'Completed';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{cycle.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {getStatus()}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Start Date:</span> {formatDate(cycle.startDate)}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Total Workouts:</span> {getTotalWorkouts()}
        </p>
      </div>
      
      {cycle.notes && (
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
          {cycle.notes}
        </p>
      )}
      
      <div className="flex space-x-2">
        <Link
          href={`/cycles/${cycle.id}`}
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
        <Link
          href={`/cycles/${cycle.id}/analytics`}
          className="inline-block bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
        >
          Analytics
        </Link>
      </div>
    </div>
  );
}
