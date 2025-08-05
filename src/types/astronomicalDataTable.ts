import { OptimalViewingWindow } from "../utils/integratedOptimalViewing";

/**
 * Unified data interface for both daily and weekly astronomical data
 */
export interface AstronomicalDataItem {
  /** Primary date for this data item */
  date: Date;
  /** Visibility rating (0-4 stars) */
  visibility: number;
  /** Optional reason for the visibility rating */
  visibilityReason?: string;
  /** Optimal viewing window with quality metrics */
  optimalWindow: OptimalViewingWindow;
  
  // Weekly-specific fields (undefined for daily mode)
  /** Week number (weekly mode only) */
  weekNumber?: number;
  /** Week start date (weekly mode only) */
  startDate?: Date;
  /** Formatted duration string (weekly mode only) */
  gcDuration?: string;
  
  // Daily-specific detailed fields (undefined for weekly mode)
  /** Sunrise time */
  sunRise?: Date;
  /** Sunset time */
  sunSet?: Date;
  /** Start of astronomical night */
  nightStart?: Date;
  /** End of astronomical night */
  nightEnd?: Date;
  /** Moonrise time */
  moonRise?: Date;
  /** Moonset time */
  moonSet?: Date;
  /** Galactic Center rise time (when it reaches ≥10° altitude) */
  gcRise?: Date;
  /** Galactic Center set time (when it drops to ≤10° altitude) */
  gcSet?: Date;
  /** Galactic Center transit time (highest point in sky) */
  gcTransit?: Date;
  /** Maximum Galactic Center altitude in degrees */
  maxGcAltitude?: number;
  /** Moon phase value (0-1) */
  moonPhase?: number;
  /** Moon illumination ratio (0-1) */
  moonIllumination?: number;
}

/**
 * Configuration for the AstronomicalDataTable component
 */
export interface AstronomicalDataTableConfig {
  /** Display mode - determines data granularity and UI behavior */
  mode: 'daily' | 'weekly';
  
  /** Show expandable details for each row (daily mode only) */
  showExpandableDetails?: boolean;
  
  /** Enable click navigation to date pages */
  enableNavigation?: boolean;
  
  /** Enable infinite scroll loading (weekly mode only) */
  enableInfiniteScroll?: boolean;
  
  /** Filter out items with zero visibility (weekly mode only) */
  filterZeroVisibility?: boolean;
  
  /** Number of items to load initially */
  initialItemCount?: number;
  
  /** Number of items to load per batch (infinite scroll) */
  itemsPerBatch?: number;
  
  /** Maximum number of items to load total */
  maxItems?: number;
  
  /** Custom title for the table */
  title?: string;
  
  /** Custom date format function */
  formatDate?: (date: Date, currentDate?: Date) => string;
  
  /** Callback when a row is clicked */
  onRowClick?: (item: AstronomicalDataItem) => void;
}

/**
 * Result interface for the unified data loading hook
 */
export interface UseAstronomicalDataResult {
  /** Array of astronomical data items */
  items: AstronomicalDataItem[];
  /** Loading state for additional items (infinite scroll) */
  isLoadingMore: boolean;
  /** Error message if loading failed */
  error: string | null;
  /** Number of items currently loaded */
  itemsLoaded: number;
  /** Whether more items can be loaded */
  canLoadMore: boolean;
  /** Function to load more items (infinite scroll) */
  loadMore: () => void;
  /** Function to refresh all data */
  refresh: () => void;
}

/**
 * Props for the unified AstronomicalDataTable component
 */
export interface AstronomicalDataTableProps {
  /** Current date context (defaults to today) */
  currentDate?: Date;
  /** Configuration object */
  config: AstronomicalDataTableConfig;
  /** Optional CSS class name */
  className?: string;
}