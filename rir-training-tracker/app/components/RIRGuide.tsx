interface RIRGuideProps {
  className?: string;
}

export default function RIRGuide({ className = '' }: RIRGuideProps) {
  const rirLevels = [
    {
      rir: 0,
      description: 'Could not do another rep (muscle failure)',
      color: 'bg-red-100 text-red-800 border-red-200',
      intensity: 'Maximum'
    },
    {
      rir: 1,
      description: 'Could do 1 more rep',
      color: 'bg-red-50 text-red-700 border-red-200',
      intensity: 'Very High'
    },
    {
      rir: 2,
      description: 'Could do 2 more reps',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      intensity: 'High'
    },
    {
      rir: 3,
      description: 'Could do 3 more reps',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      intensity: 'Moderate-High'
    },
    {
      rir: 4,
      description: 'Could do 4 more reps',
      color: 'bg-green-100 text-green-800 border-green-200',
      intensity: 'Moderate'
    },
    {
      rir: 5,
      description: 'Could do 5+ more reps',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      intensity: 'Light'
    }
  ];

  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        RIR (Reps in Reserve) Scale
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Rate how many more reps you could have performed at the end of each set.
      </p>
      
      <div className="space-y-2">
        {rirLevels.map((level) => (
          <div
            key={level.rir}
            className={`p-2 rounded border ${level.color} flex justify-between items-center`}
          >
            <div className="flex items-center">
              <span className="font-bold text-lg mr-3">RIR {level.rir}</span>
              <span className="text-sm">{level.description}</span>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded bg-white/50">
              {level.intensity}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-1">Training Guidelines:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li><strong>Hypertrophy:</strong> Aim for RIR 0-2 for maximum muscle growth</li>
          <li><strong>Strength:</strong> RIR 2-4 allows for better technique and recovery</li>
          <li><strong>Endurance:</strong> RIR 3-5 helps build muscular endurance</li>
        </ul>
      </div>
    </div>
  );
}
