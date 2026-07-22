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
//
// TTL — each entry carries an expiry timestamp. On access, expired entries
// are evicted and re-fetched. This prevents two problems:
//   1. Unbounded growth: entries for locations never queried again eventually
//      expire and are removed from the Map on the next access for that key.
//   2. Stale data: editors always see reasonably fresh data even during a
//      long-running preview session (data is at most DRAFT_CACHE_TTL_MS old).
//
// inFlightDraftFetches deduplicates *concurrent* requests for the same
// location. Without it, multiple editor events arriving before the first
// fetch completes (cache still empty) would each start an independent 10-
// second fetch. By storing the in-flight Promise and reusing it, every
// concurrent caller awaits the same underlying fetch — so only one network
// request is made regardless of how many renders are triggered at once.
// The map is self-cleaning: entries are deleted as soon as the fetch resolves.
// =============================================================================

// 5 minutes — long enough to survive rapid editing, short enough that editors
// see fresh data without needing a server restart.
const DRAFT_CACHE_TTL_MS = 5 * 60 * 1000;

interface DraftCacheEntry {
  data: WeatherData;
  expiresAt: number;
}

const draftModeCache = new Map<string, DraftCacheEntry>();
const inFlightDraftFetches = new Map<string, Promise<WeatherData>>();

async function getWeatherDraft(location: string): Promise<WeatherData> {
  const entry = draftModeCache.get(location);
  if (entry) {
    if (Date.now() < entry.expiresAt) {
      console.log(`[DRAFT CACHE HIT] "${location}" — skipping fetch`);
      return entry.data;
    }
    // Expired — evict and fall through to re-fetch.
    console.log(`[DRAFT CACHE EXPIRED] "${location}" — refreshing`);
    draftModeCache.delete(location);
  }

  const inFlight = inFlightDraftFetches.get(location);
  if (inFlight) {
    console.log(`[DRAFT IN-FLIGHT HIT] "${location}" — reusing pending fetch`);
    return inFlight;
  }

  console.log(`[DRAFT CACHE MISS] "${location}" — fetching …`);
  const promise = fetchWeatherData(location).then((data) => {
    draftModeCache.set(location, {
      data,
      expiresAt: Date.now() + DRAFT_CACHE_TTL_MS,
    });
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
