'use client';

import { useState } from 'react';
import { useUnitSystem } from '../lib/UnitContext';

export default function Settings() {
  const [isOpen, setIsOpen] = useState(false);
  const { unitSystem, setUnitSystem } = useUnitSystem();

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2 rounded-md hover:bg-blue-500 transition-colors"
        aria-label="Settings"
      >
        {/* SVG for settings icon */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
          />
        </svg>
      </button>
      {isOpen && (
        <>
          {/* Backdrop to close menu when clicking outside */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-700 z-20 border">
            <div className="px-4 py-2 text-sm font-semibold border-b border-gray-200">Unit System</div>
            <div className="px-4 py-2">
              <label className="inline-flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  className="form-radio text-blue-600" 
                  name="unitSystem" 
                  value="metric" 
                  checked={unitSystem === 'metric'} 
                  onChange={() => setUnitSystem('metric')} 
                />
                <span className="ml-2">Metric (kg)</span>
              </label>
            </div>
            <div className="px-4 py-2">
              <label className="inline-flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  className="form-radio text-blue-600" 
                  name="unitSystem" 
                  value="imperial" 
                  checked={unitSystem === 'imperial'} 
                  onChange={() => setUnitSystem('imperial')} 
                />
                <span className="ml-2">Imperial (lbs)</span>
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
