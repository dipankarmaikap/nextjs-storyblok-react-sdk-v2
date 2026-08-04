import { cache } from "react";
import { unstable_cache } from "next/cache";
import { draftMode } from "next/headers";
import { LRUCache } from "lru-cache";
import { storyblokEditable } from "@storyblok/react/next";
import { Block } from "@/schema/schema";

type WeatherWidgetProps = { block: Block<"weather_widget"> };

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
// Layer 2b — Draft-mode cache (LRUCache, lives for the server process)
//
// The Visual Editor fires a re-render on every keystroke. Without this cache
// every edit would trigger a fresh 10-second fetch, making the preview
// unusable. The cache is module-level so it survives across requests within
// the same server process but is cleared on a full server restart.
//
// LRUCache handles two concerns automatically:
//   • TTL (5 min) — entries expire so editors always see reasonably fresh
//     data, and keys that are never accessed again eventually fall out.
//   • Max size (500) — hard cap on entries; the least-recently-used key is
//     evicted first, bounding memory regardless of how many unique locations
//     are queried.
//
// inFlightDraftFetches deduplicates *concurrent* requests for the same
// location. Multiple editor events arriving before the first fetch completes
// (cache still empty) all share one Promise instead of each starting an
// independent 10-second request. The map is self-cleaning: entries are
// deleted as soon as the fetch resolves.
// =============================================================================

const draftModeCache = new LRUCache<string, WeatherData>({
  max: 500,
  ttl: 5 * 60 * 1000, // 5 minutes
});

const inFlightDraftFetches = new Map<string, Promise<WeatherData>>();

async function getWeatherDraft(location: string): Promise<WeatherData> {
  const cached = draftModeCache.get(location);
  if (cached) {
    console.log(`[DRAFT CACHE HIT] "${location}" — skipping fetch`);
    return cached;
  }

  const inFlight = inFlightDraftFetches.get(location);
  if (inFlight) {
    console.log(`[DRAFT IN-FLIGHT HIT] "${location}" — reusing pending fetch`);
    return inFlight;
  }

  console.log(`[DRAFT CACHE MISS] "${location}" — fetching …`);
  const promise = fetchWeatherData(location).then((data) => {
    draftModeCache.set(location, data);
    inFlightDraftFetches.delete(location);
    return data;
  });
  inFlightDraftFetches.set(location, promise);
  return promise;
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
    return getWeatherDraft(location); // → LRUCache (TTL + max size)
  }
  return getWeatherProduction(location); // → Next.js Data Cache (disk/memory)
});

// =============================================================================
// WeatherWidget Component
// =============================================================================

export async function WeatherWidget({ block }: WeatherWidgetProps) {
  // Read the real draft-mode state from the request cookie.
  // This must happen inside the component (request-scoped), not at module level.
  const { isEnabled: isDraftMode } = await draftMode();

  console.log(
    `[WeatherWidget] rendering "${block.location}" (draft=${isDraftMode})`,
  );
  const weatherData = await getWeather(block.location ?? "", isDraftMode);
  console.log(`[WeatherWidget] done (fetchId=${weatherData.fetchId})`);

  return (
    <div
      className="rounded-lg border border-zinc-700 bg-zinc-900 p-6 mb-6"
      {...storyblokEditable(block)}
    >
      <h3 className="text-lg font-semibold text-zinc-100">{block.title}</h3>
      <p className="text-sm text-zinc-500 mt-1">Location: {block.location}</p>

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
