import { useState, useEffect } from "react";
import { Location } from "../types/astronomy";
import StarRating from "./StarRating";
import { calculateGalacticCenterPosition } from "../utils/galacticCenter";
import { calculateMoonData } from "../utils/moonCalculations";
import { calculateTwilightTimes } from "../utils/twilightCalculations";
import { calculateVisibilityRating } from "../utils/visibilityRating";
import {
  calculateOptimalViewingWindow,
  formatOptimalViewingTime,
  formatOptimalViewingDuration,
  OptimalViewingWindow,
} from "../utils/optimalViewing";
import { formatTimeInLocationTimezone } from "../utils/timezoneUtils";
import { getMoonPhaseEmoji } from "../utils/moonCalculations";

interface DailyVisibilityTableProps {
  location: Location;
}

interface DayData {
  date: Date;
  visibility: number;
  optimalWindow: OptimalViewingWindow;
  // Expanded view data
  sunRise?: Date;
  sunSet?: Date;
  astronomicalTwilightEnd?: Date;
  astronomicalTwilightStart?: Date;
  moonRise?: Date;
  moonSet?: Date;
  gcRise?: Date;
  gcTransit?: Date;
  gcSet?: Date;
  maxGcAltitude: number;
  moonPhase: number;
  moonIllumination: number;
}

// SVG Icon component (reused from TonightCard)
const Icon = ({
  name,
  title,
  className = "w-6 h-6",
}: {
  name: string;
  title?: string;
  className?: string;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onTouchStart={() => setShowTooltip(true)}
      onTouchEnd={() => setTimeout(() => setShowTooltip(false), 2000)}
    >
      <svg className={className}>
        <use href={`/icons.svg#${name}`} />
      </svg>
      {showTooltip && title && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-lg text-white bg-gray-900 rounded shadow-lg whitespace-nowrap z-50">
          {title}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default function DailyVisibilityTable({ location }: DailyVisibilityTableProps) {
  const [dailyData, setDailyData] = useState<DayData[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calculateDailyData = async () => {
      setIsLoading(true);

      try {
        const today = new Date();
        const data: DayData[] = [];

        // Calculate data for the next 7 days
        for (let i = 0; i < 7; i++) {
          const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
          
          // Calculate astronomical data for this day
          const gcData = calculateGalacticCenterPosition(date, location);
          const moonData = calculateMoonData(date, location);
          const twilightData = calculateTwilightTimes(date, location);
          
          const optimalWindow = calculateOptimalViewingWindow(gcData, moonData, twilightData);
          const visibility = calculateVisibilityRating(gcData, moonData, twilightData, optimalWindow, location);

          data.push({
            date,
            visibility,
            optimalWindow,
            sunRise: undefined, // TwilightData doesn't have sunrise/sunset, we'll calculate them separately if needed
            sunSet: undefined,
            astronomicalTwilightEnd: twilightData.night ? new Date(twilightData.night) : undefined,
            astronomicalTwilightStart: twilightData.dayEnd ? new Date(twilightData.dayEnd) : undefined,
            moonRise: moonData.rise || undefined,
            moonSet: moonData.set || undefined,
            gcRise: gcData.riseTime || undefined,
            gcTransit: gcData.transitTime || undefined,
            gcSet: gcData.setTime || undefined,
            maxGcAltitude: gcData.altitude,
            moonPhase: moonData.phase,
            moonIllumination: moonData.illumination,
          });
        }

        setDailyData(data);
      } catch (error) {
        console.error("Error calculating daily visibility data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    calculateDailyData();
  }, [location]);

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", { 
        weekday: "short", 
        month: "short", 
        day: "numeric" 
      });
    }
  };

  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  if (isLoading) {
    return (
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 mb-8">
        <div className="text-center text-xl text-white/60">
          Loading daily visibility data...
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-white">Next 7 Days</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left py-3 px-4 text-white font-medium">Date</th>
              <th className="text-left py-3 px-4 text-white font-medium">Visibility</th>
              <th className="text-left py-3 px-4 text-white font-medium">Optimal Time</th>
              <th className="text-left py-3 px-4 text-white font-medium">Duration</th>
            </tr>
          </thead>
          <tbody>
            {dailyData.map((day, index) => (
              <tr key={index}>
                <td colSpan={4} className="p-0">
                  <div
                    className="cursor-pointer hover:bg-white/5 transition-colors duration-200"
                    onClick={() => toggleRow(index)}
                  >
                    <div className="py-3 px-4 flex items-center justify-between">
                      <div className="grid grid-cols-4 gap-4 flex-1">
                        <div className="text-white font-medium">
                          {formatDate(day.date)}
                        </div>
                        <div>
                          <StarRating rating={day.visibility} />
                        </div>
                        <div className="text-white">
                          {formatOptimalViewingTime(day.optimalWindow, location) || "Not visible"}
                        </div>
                        <div className="text-white">
                          {formatOptimalViewingDuration(day.optimalWindow) || "—"}
                        </div>
                      </div>
                      <div className="ml-4 text-white/60">
                        {expandedRow === index ? "▲" : "▼"}
                      </div>
                    </div>
                  </div>
                  
                  {expandedRow === index && (
                    <div className="px-4 pb-4 border-b border-white/10">
                      <div className="bg-white/5 rounded-lg p-4 mt-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                          
                          {/* Sun Events */}
                          <div>
                            <h4 className="text-white font-medium mb-3 text-base">Sun</h4>
                            <div className="space-y-2">
                              {day.sunRise && (
                                <div className="flex items-center gap-2 text-white/80">
                                  <Icon name="sunrise" title="Sunrise" className="w-5 h-5" />
                                  <span>Rise: {formatTimeInLocationTimezone(day.sunRise, location)}</span>
                                </div>
                              )}
                              {day.sunSet && (
                                <div className="flex items-center gap-2 text-white/80">
                                  <Icon name="sunset" title="Sunset" className="w-5 h-5" />
                                  <span>Set: {formatTimeInLocationTimezone(day.sunSet, location)}</span>
                                </div>
                              )}
                              {day.astronomicalTwilightEnd && (
                                <div className="flex items-center gap-2 text-white/80">
                                  <Icon name="twilight-end" title="Astronomical Twilight End" className="w-5 h-5" />
                                  <span>Dark: {formatTimeInLocationTimezone(day.astronomicalTwilightEnd, location)}</span>
                                </div>
                              )}
                              {day.astronomicalTwilightStart && (
                                <div className="flex items-center gap-2 text-white/80">
                                  <Icon name="twilight-start" title="Astronomical Twilight Start" className="w-5 h-5" />
                                  <span>Dawn: {formatTimeInLocationTimezone(day.astronomicalTwilightStart, location)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Moon Events */}
                          <div>
                            <h4 className="text-white font-medium mb-3 text-base">Moon</h4>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-white/80">
                                <span className="text-2xl">{getMoonPhaseEmoji(day.moonPhase)}</span>
                                <span>{Math.round(day.moonIllumination * 100)}% illuminated</span>
                              </div>
                              {day.moonRise && (
                                <div className="flex items-center gap-2 text-white/80">
                                  <Icon name="moonrise" title="Moonrise" className="w-5 h-5" />
                                  <span>Rise: {formatTimeInLocationTimezone(day.moonRise, location)}</span>
                                </div>
                              )}
                              {day.moonSet && (
                                <div className="flex items-center gap-2 text-white/80">
                                  <Icon name="moonset" title="Moonset" className="w-5 h-5" />
                                  <span>Set: {formatTimeInLocationTimezone(day.moonSet, location)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Galactic Core Events */}
                          <div>
                            <h4 className="text-white font-medium mb-3 text-base">Galactic Core</h4>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-white/80">
                                <Icon name="altitude" title="Maximum Altitude" className="w-5 h-5" />
                                <span>Max: {day.maxGcAltitude.toFixed(1)}°</span>
                              </div>
                              {day.gcRise && (
                                <div className="flex items-center gap-2 text-white/80">
                                  <Icon name="gc-rise" title="Galactic Core Rise (≥10°)" className="w-5 h-5" />
                                  <span>Rise: {formatTimeInLocationTimezone(day.gcRise, location)}</span>
                                </div>
                              )}
                              {day.gcTransit && (
                                <div className="flex items-center gap-2 text-white/80">
                                  <Icon name="gc-transit" title="Galactic Core Transit" className="w-5 h-5" />
                                  <span>Transit: {formatTimeInLocationTimezone(day.gcTransit, location)}</span>
                                </div>
                              )}
                              {day.gcSet && (
                                <div className="flex items-center gap-2 text-white/80">
                                  <Icon name="gc-set" title="Galactic Core Set (≤10°)" className="w-5 h-5" />
                                  <span>Set: {formatTimeInLocationTimezone(day.gcSet, location)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}