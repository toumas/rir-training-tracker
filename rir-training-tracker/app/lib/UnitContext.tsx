'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getFromStorage, saveToStorage } from './storage';

type UnitSystem = 'metric' | 'imperial';

interface UnitContextType {
  unitSystem: UnitSystem;
  setUnitSystem: (unitSystem: UnitSystem) => void;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export function UnitProvider({ children }: { children: ReactNode }) {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');

  useEffect(() => {
    const storedUnitSystem = getFromStorage('unitSystem');
    if (storedUnitSystem) {
      setUnitSystem(storedUnitSystem as UnitSystem);
    }
  }, []);

  const handleSetUnitSystem = (system: UnitSystem) => {
    setUnitSystem(system);
    saveToStorage('unitSystem', system);
  };

  return (
    <UnitContext.Provider value={{ unitSystem, setUnitSystem: handleSetUnitSystem }}>
      {children}
    </UnitContext.Provider>
  );
}

export function useUnitSystem() {
  const context = useContext(UnitContext);
  if (context === undefined) {
    throw new Error('useUnitSystem must be used within a UnitProvider');
  }
  return context;
}
