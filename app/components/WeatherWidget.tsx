import { cache } from "react";
import { unstable_cache } from "next/cache";
import { storyblokEditable, type SbBlokData } from "@storyblok/react/next";

interface WeatherWidgetProps {
  blok: SbBlokData & { title: string; location: string };
}

interface WeatherData {
  temperature: number;
  windSpeed: number;
  fetchedAt: string;
  fetchId: string;
}

// In-memory cache keyed by location (only used in draft mode)
const memoryCache = new Map<string, WeatherData>();
const isDraftMode = process.env.NODE_ENV === "development" || process.env.STORYBLOK_DRAFT_MODE === "true";

/**
 * Fetch weather data (with simulated delay)
 */
async function fetchWeatherData(location: string): Promise<WeatherData> {
  const fetchId = Math.random().toString(36).slice(2, 8);
  console.log(`[FETCH] ${fetchId} for ${location}`);
  await new Promise((resolve) => setTimeout(resolve, 10000));
  
  return {
    temperature: Math.floor(Math.random() * 15) + 15,
    windSpeed: Math.floor(Math.random() * 20) + 5,
    fetchedAt: new Date().toISOString(),
    fetchId,
  };
}

/**
 * Fetch weather - uses memory cache in draft mode, unstable_cache in production
 */
async function fetchWeather(location: string): Promise<WeatherData> {
  // In draft mode, use memory cache for fast previews
  if (isDraftMode) {
    const cached = memoryCache.get(location);
    
    if (cached) {
      console.log(`[CACHE HIT] Returning cached data for ${location}`);
      return cached;
    }

    const data = await fetchWeatherData(location);
    memoryCache.set(location, data);
    return data;
  }

  // Production: just fetch (unstable_cache handles caching)
  return fetchWeatherData(location);
}

/**
 * Wrapped with Next.js unstable_cache for cross-request caching (production)
 */
const getWeatherCached = unstable_cache(
  fetchWeather,
  ["weather"],
  {
    revalidate: 60,
  }
);

// Also wrap with React cache() for request deduplication
const getWeather = cache(async (location: string) => {
  return getWeatherCached(location);
});

// =============================================================================
// WeatherWidget Component
// =============================================================================

export async function WeatherWidget({ blok }: WeatherWidgetProps) {
  console.log(`[WeatherWidget] 🔄 Rendering for location: ${blok.location}, title: "${blok.title}"`);
  const weatherData = await getWeather(blok.location);
  console.log(`[WeatherWidget] ✨ Render complete (fetchId: ${weatherData.fetchId})`);

  return (
    <div
      className="rounded-lg border border-zinc-700 bg-zinc-900 p-6 mb-6"
      {...storyblokEditable(blok)}
    >
      <h3 className="text-lg font-semibold text-zinc-100">{blok.title}</h3>
      <p className="text-sm text-zinc-500 mt-1">Location: {blok.location}</p>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-3xl font-bold text-blue-400">
            {weatherData.temperature}°C
          </p>
          <p className="text-xs text-zinc-500">Temperature</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-green-400">
            {weatherData.windSpeed} km/h
          </p>
          <p className="text-xs text-zinc-500">Wind Speed</p>
        </div>
      </div>

      <div className="mt-4 text-xs text-zinc-600 font-mono space-y-1">
        <p>Fetched: {weatherData.fetchedAt}</p>
        <p>Fetch ID: {weatherData.fetchId}</p>
      </div>
    </div>
  );
}
