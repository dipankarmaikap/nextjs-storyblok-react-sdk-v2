import { cache } from "react";
import { unstable_cache } from "next/cache";
import { draftMode } from "next/headers";
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

// =============================================================================
// Layer 1 — Raw fetch (slow: simulates a 10-second external API call)
// =============================================================================

async function fetchWeatherData(location: string): Promise<WeatherData> {
  const fetchId = Math.random().toString(36).slice(2, 8);
  console.log(`[FETCH] ${fetchId} starting for "${location}" …`);
  await new Promise((resolve) => setTimeout(resolve, 10000));
  console.log(`[FETCH] ${fetchId} complete`);
  return {
    temperature: Math.floor(Math.random() * 15) + 15,
    windSpeed: Math.floor(Math.random() * 20) + 5,
    fetchedAt: new Date().toISOString(),
    fetchId,
  };
}

// =============================================================================
// Layer 2a — Production cache (cross-request, 60-second TTL)
//
// unstable_cache persists results in the Next.js Data Cache between requests.
// Only used in production — draft mode bypasses this entirely so editors
// always get the freshest data without stale-cache surprises.
// =============================================================================

const getWeatherProduction = unstable_cache(fetchWeatherData, ["weather"], {
  revalidate: 60,
});

// =============================================================================
// Layer 2b — Draft-mode cache (in-memory Map, lives for the server process)
//
// The Visual Editor fires a re-render on every keystroke. Without this cache
// every edit would trigger a fresh 10-second fetch, making the preview
// unusable. The Map is module-level so it survives across requests within the
// same server process but is cleared on a full server restart.
// =============================================================================

const draftModeCache = new Map<string, WeatherData>();

async function getWeatherDraft(location: string): Promise<WeatherData> {
  const cached = draftModeCache.get(location);
  if (cached) {
    console.log(`[DRAFT CACHE HIT] "${location}" — skipping fetch`);
    return cached;
  }
  console.log(`[DRAFT CACHE MISS] "${location}" — fetching …`);
  const data = await fetchWeatherData(location);
  draftModeCache.set(location, data);
  return data;
}

// =============================================================================
// Layer 3 — Request deduplication (React cache)
//
// react.cache() deduplicates calls within a single render pass. If two
// WeatherWidget bloks on the same page share the same location, only one
// fetch (or cache lookup) is made for the entire request.
// =============================================================================

const getWeather = cache(async (location: string, isDraftMode: boolean) => {
  if (isDraftMode) {
    return getWeatherDraft(location); // → in-memory Map
  }
  return getWeatherProduction(location); // → Next.js Data Cache (disk/memory)
});

// =============================================================================
// WeatherWidget Component
// =============================================================================

export async function WeatherWidget({ blok }: WeatherWidgetProps) {
  // Read the real draft-mode state from the request cookie.
  // This must happen inside the component (request-scoped), not at module level.
  const { isEnabled: isDraftMode } = await draftMode();

  console.log(
    `[WeatherWidget] rendering "${blok.location}" (draft=${isDraftMode})`,
  );
  const weatherData = await getWeather(blok.location, isDraftMode);
  console.log(`[WeatherWidget] done (fetchId=${weatherData.fetchId})`);

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
        <p>Mode: {isDraftMode ? "draft" : "production"}</p>
      </div>
    </div>
  );
}
