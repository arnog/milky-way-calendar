import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useDateFromQuery(): [Date, (date: Date) => void] {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse date from query string
  const getDateFromQuery = useCallback((): Date => {
    const params = new URLSearchParams(location.search);
    const dateParam = params.get('date');
    
    if (dateParam) {
      // Expected format: YYYY-MM-DD
      const match = dateParam.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (match) {
        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1; // JavaScript months are 0-indexed
        const day = parseInt(match[3], 10);
        
        const date = new Date(year, month, day);
        
        // Validate the date
        if (!isNaN(date.getTime()) && 
            date.getFullYear() === year && 
            date.getMonth() === month && 
            date.getDate() === day) {
          return date;
        }
      }
    }
    
    // Default to today if no valid date in query
    return new Date();
  }, [location.search]);
  
  const [currentDate, setCurrentDate] = useState<Date>(getDateFromQuery);
  
  // Update date when query changes
  useEffect(() => {
    setCurrentDate(getDateFromQuery());
  }, [getDateFromQuery]);
  
  // Function to update the date and URL
  const setDate = (newDate: Date) => {
    setCurrentDate(newDate);
    
    // Format date as YYYY-MM-DD
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day = String(newDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    // Update URL with the new date
    const params = new URLSearchParams(location.search);
    params.set('date', dateString);
    
    navigate({
      pathname: location.pathname,
      search: params.toString()
    }, { replace: true });
  };
  
  return [currentDate, setDate];
}