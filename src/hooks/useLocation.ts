import { useContext } from 'react';
import { LocationContext } from '../contexts/LocationContext.context';
import type { LocationContextType } from '../contexts/LocationContext.types';

export function useLocation(): LocationContextType {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}