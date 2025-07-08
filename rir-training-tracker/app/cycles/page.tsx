'use client';

import { useState, useEffect } from 'react';
import { Cycle } from '../lib/types';
import { getCycles, saveCycle, deleteCycle } from '../lib/storage';
import CycleCard from '../components/CycleCard';
import CycleForm from '../components/CycleForm';

export default function CyclesPage() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCycle, setEditingCycle] = useState<Cycle | undefined>();

  useEffect(() => {
    setCycles(getCycles());
  }, []);

  const handleSaveCycle = (cycle: Cycle) => {
    saveCycle(cycle);
    setCycles(getCycles());
    setShowForm(false);
    setEditingCycle(undefined);
  };

  const handleDeleteCycle = (cycleId: string) => {
    if (confirm('Are you sure you want to delete this cycle?')) {
      deleteCycle(cycleId);
      setCycles(getCycles());
    }
  };

  const handleEditCycle = (cycle: Cycle) => {
    setEditingCycle(cycle);
    setShowForm(true);
  };

  const handleCreateNew = () => {
    setEditingCycle(undefined);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCycle(undefined);
  };

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CycleForm
          cycle={editingCycle}
          onSave={handleSaveCycle}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Training Cycles</h1>
          <p className="text-gray-600 mt-2">
            Manage your 4-week training cycles with progressive overload and deload weeks
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Create New Cycle
        </button>
      </div>

      {cycles.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Training Cycles Yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first training cycle to start tracking your progressive overload and recovery periods.
            </p>
            <button
              onClick={handleCreateNew}
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Create Your First Cycle
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cycles.map((cycle) => (
            <div key={cycle.id} className="relative">
              <CycleCard cycle={cycle} />
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  onClick={() => handleEditCycle(cycle)}
                  className="bg-white shadow-md rounded p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Edit cycle"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteCycle(cycle.id)}
                  className="bg-white shadow-md rounded p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete cycle"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
