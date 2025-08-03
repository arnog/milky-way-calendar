import { createContext } from 'react';
import type { LocationContextType } from './LocationContext.types';

export const LocationContext = createContext<LocationContextType | undefined>(undefined);