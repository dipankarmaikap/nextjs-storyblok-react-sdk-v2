import { cache } from "react";
import { unstable_cache } from "next/cache";
import { storyblokEditable } from "@storyblok/react/next";
import { Block } from "@/schema/schema";
import { isPreview } from "@/app/lib/storyblok";

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
// Layer 2b — Draft-mode: no cache, always fetches fresh
//
// The LRU cache has been removed to make streaming behaviour easy to observe
// during development. Every draft-mode render triggers the full 10 s mock
// fetch, so you can clearly see the skeleton appear immediately and the
// resolved content stream in 10 s later.
// =============================================================================

// =============================================================================
// Layer 3 — Request deduplication (React cache)
//
// react.cache() deduplicates calls within a single render pass. If two
// WeatherWidget bloks on the same page share the same location, only one
// fetch (or cache lookup) is made for the entire request.
// =============================================================================

const getWeather = cache(async (location: string, isDraftMode: boolean) => {
  if (isDraftMode) {
    return fetchWeatherData(location); // always fresh in draft mode
  }
  return getWeatherProduction(location); // → Next.js Data Cache (disk/memory)
});

// =============================================================================
// WeatherWidget Component
// =============================================================================

export async function WeatherWidget({ block }: WeatherWidgetProps) {
  console.log(
    `[WeatherWidget] rendering "${block.location}" (preview=${isPreview})`,
  );
  const weatherData = await getWeather(block.location ?? "", isPreview);
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
        <p>Mode: {isPreview ? "preview" : "production"}</p>
      </div>
    </div>
  );
}
