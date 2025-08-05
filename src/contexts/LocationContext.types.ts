import { Location } from "../types/astronomy";

export interface LocationContextType {
  location: Location | null;
  setLocation: (location: Location) => void;
  updateLocation: (location: Location, matchedName?: string | null) => void;
  isLoading: boolean;
  geolocationFailed: boolean;
  retryGeolocation: () => void;
}
