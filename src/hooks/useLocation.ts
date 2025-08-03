import { useContext } from 'react';
import { LocationContext } from '../contexts/LocationContext.context';
import { Location } from '../types/astronomy';

export interface GuaranteedLocationContextType {
  location: Location; // Non-null location
  setLocation: (location: Location) => void;
  updateLocation: (location: Location, matchedName?: string | null) => void;
  isLoading: boolean;
}

export function useLocation(): GuaranteedLocationContextType {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  
  if (context.location === null) {
    throw new Error('Location is not available yet. This usually means the user location is still being determined or there was an error loading the location.');
  }
  
  return {
    location: context.location,
    setLocation: context.setLocation,
    updateLocation: context.updateLocation,
    isLoading: context.isLoading
  };
}