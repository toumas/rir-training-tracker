import { useUnitSystem } from './UnitContext';

export type WeightUnit = 'kg' | 'lbs';

// Weight conversion utilities
export const convertWeight = (weight: number, from: WeightUnit, to: WeightUnit): number => {
  if (from === to) return weight;
  
  if (from === 'kg' && to === 'lbs') {
    return Math.round(weight * 2.20462 * 100) / 100; // kg to lbs
  } else if (from === 'lbs' && to === 'kg') {
    return Math.round(weight / 2.20462 * 100) / 100; // lbs to kg
  }
  
  return weight;
};

export const getWeightUnit = (unitSystem: 'metric' | 'imperial'): WeightUnit => {
  return unitSystem === 'metric' ? 'kg' : 'lbs';
};

// Hook to get weight with proper unit formatting
export const useWeightDisplay = () => {
  const { unitSystem } = useUnitSystem();
  const unit = getWeightUnit(unitSystem);

  const formatWeight = (weight: number, fromUnit: WeightUnit = 'kg'): string => {
    const convertedWeight = convertWeight(weight, fromUnit, unit);
    return `${convertedWeight} ${unit}`;
  };

  const parseWeightInput = (input: string, targetUnit: WeightUnit = 'kg'): number => {
    const numericValue = parseFloat(input);
    if (isNaN(numericValue)) return 0;
    
    return convertWeight(numericValue, unit, targetUnit);
  };

  return {
    unitSystem,
    unit,
    formatWeight,
    parseWeightInput,
    convertWeight,
  };
};
