import React from "react";
import { CloudSun, Wind, Thermometer } from "lucide-react";
import type { WeatherInfo } from "../types/travel";

interface WeatherBadgeProps {
  weather: WeatherInfo | null;
}

export const WeatherBadge: React.FC<WeatherBadgeProps> = ({ weather }) => {
  if (!weather) return null;

  return (
    <div className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-sky-50 to-blue-50/80 border border-sky-200/80 rounded-xl text-sky-900 shadow-sm">
      <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600 shrink-0">
        <CloudSun className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Live Destination Weather
          </span>
          <span className="text-xs bg-sky-200/60 px-1.5 py-0.5 rounded text-sky-800 font-medium">
            Open-Meteo API
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-sm font-semibold text-slate-800">
          <span className="flex items-center gap-1">
            <Thermometer className="w-4 h-4 text-rose-500" />
            {weather.temperatureCelsius}°C / {weather.temperatureFahrenheit}°F
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-700">{weather.condition}</span>
          {weather.windSpeedKmh > 0 && (
            <>
              <span className="text-slate-400">•</span>
              <span className="flex items-center gap-1 text-xs text-slate-600 font-normal">
                <Wind className="w-3.5 h-3.5 text-sky-500" />
                {weather.windSpeedKmh} km/h
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
