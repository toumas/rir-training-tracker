
# PRP: Settings Menu and Unit Conversion

## 1. Feature Description

- As a user, I want to open the Settings menu from the main header to adjust app preferences.
- As a user, I want to switch between metric and imperial units, so that I can use my preferred measurement system.

## 2. Research & Codebase Analysis

### Dependencies
- **Next.js**: React framework for server-rendered applications.
- **React**: Core UI library.
- **TypeScript**: For type safety.
- **Tailwind CSS**: For styling.

### Existing Patterns
- **Component Structure**: Components are located in `rir-training-tracker/app/components/`. They are functional components using hooks.
- **Styling**: Tailwind CSS is used for styling, with classes applied directly in the JSX.
- **Navigation**: `next/link` and `usePathname` are used for navigation.
- **State Management**: Client-side state is managed with React hooks (`useState`, `useEffect`).

### Files to Reference
- `rir-training-tracker/app/components/Header.tsx`: The header component where the settings button will be added.
- `rir-training-tracker/app/layout.tsx`: The main layout component where the settings context provider will be added.
- `rir-training-tracker/app/lib/storage.ts`: A good place to add functions for interacting with `localStorage`.

## 3. Implementation Blueprint

### Task 1: Create a `UnitContext`
Create a new file `rir-training-tracker/app/lib/UnitContext.tsx` to define a new context for managing the unit system.

```typescript
// rir-training-tracker/app/lib/UnitContext.tsx
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
```

### Task 2: Create a `Settings` component
Create a new component `rir-training-tracker/app/components/Settings.tsx` for the settings menu.

```typescript
// rir-training-tracker/app/components/Settings.tsx
'use client';

import { useState } from 'react';
import { useUnitSystem } from '../lib/UnitContext';

export default function Settings() {
  const [isOpen, setIsOpen] = useState(false);
  const { unitSystem, setUnitSystem } = useUnitSystem();

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md hover:bg-blue-500">
        {/* SVG for settings icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-700">
          <div className="px-4 py-2 text-sm font-semibold">Unit System</div>
          <div className="px-4 py-2">
            <label className="inline-flex items-center">
              <input type="radio" className="form-radio" name="unitSystem" value="metric" checked={unitSystem === 'metric'} onChange={() => setUnitSystem('metric')} />
              <span className="ml-2">Metric</span>
            </label>
          </div>
          <div className="px-4 py-2">
            <label className="inline-flex items-center">
              <input type="radio" className="form-radio" name="unitSystem" value="imperial" checked={unitSystem === 'imperial'} onChange={() => setUnitSystem('imperial')} />
              <span className="ml-2">Imperial</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Task 3: Update `Header.tsx`
Add the `Settings` component to `rir-training-tracker/app/components/Header.tsx`.

```typescript
// rir-training-tracker/app/components/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Settings from './Settings';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/workouts', label: 'Workouts' },
    { href: '/exercises', label: 'Exercises' },
    { href: '/cycles', label: 'Cycles' },
  ];

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-lg sm:text-xl font-bold truncate">
            <span className="hidden sm:inline">RIR Training Tracker</span>
            <span className="sm:hidden">RIR Tracker</span>
          </Link>
          
          <nav className="flex items-center space-x-2 sm:space-x-6">
            <ul className="flex space-x-2 sm:space-x-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? 'bg-blue-700 text-white'
                        : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                    }`}
                  >
                    <span className="hidden sm:inline">{link.label}</span>
                    <span className="sm:hidden">
                      {link.label === 'Dashboard' ? 'Home' : 
                       link.label === 'Workouts' ? 'Work' :
                       link.label === 'Exercises' ? 'Exer' :
                       'Cycl'}
                    </span>
                  </a-training-tracker/app/layout.tsx`.

```typescript
// rir-training-tracker/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { UnitProvider } from "./lib/UnitContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RIR Training Tracker",
  description: "A simple app to track your training progress using RIR.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UnitProvider>
          <Header />
          <main className="container mx-auto p-4">{children}</main>
        </UnitProvider>
      </body>
    </html>
  );
}
```

### Task 5: Update `storage.ts`
Ensure `rir-training-tracker/app/lib/storage.ts` has the necessary functions.

```typescript
// rir-training-tracker/app/lib/storage.ts
export function saveToStorage<T>(key: string, value: T) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function getFromStorage(key: string) {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  return null;
}
```

## 4. Validation Gates

### Manual Testing
1. Open the application and verify the settings icon appears in the header.
2. Click the settings icon to open the menu.
3. Change the unit system from metric to imperial.
4. Refresh the page and verify the selection is persisted.
5. Check the browser's local storage to confirm the `unitSystem` key is set correctly.

### Automated Testing (Future)
- Add unit tests for the `UnitProvider` and `Settings` component.
- Add E2E tests to simulate user interaction with the settings menu.

## 5. Quality Checklist
- [x] All necessary context included
- [x] Validation gates are executable by AI
- [x] References existing patterns
- [x] Clear implementation path
- [x] Error handling documented

**Confidence Score**: 9/10
