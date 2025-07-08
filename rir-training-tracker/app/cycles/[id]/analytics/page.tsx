'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Cycle } from '../../../lib/types';
import { getCycleById } from '../../../lib/storage';
import CycleAnalytics from '../../../components/CycleAnalytics';

export default function CycleAnalyticsPage() {
  const params = useParams();
  const cycleId = params.id as string;
  
  const [cycle, setCycle] = useState<Cycle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      const cycleData = getCycleById(cycleId);
      setCycle(cycleData || null);
      setLoading(false);
    };

    fetchData();
  }, [cycleId]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/cycles/${cycle.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-block"
        >
          ← Back to Cycle Details
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{cycle.name} - Analytics</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive analysis of your training progression
          </p>
        </div>
      </div>

      {/* Analytics Component */}
      <CycleAnalytics cycle={cycle} />
    </div>
  );
}
