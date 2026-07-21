import { draftMode } from "next/headers";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // Validate the secret token from Storyblok
  const secret = searchParams.get("secret");
  // Check the secret matches your Storyblok token
  if (secret !== process.env.NEXT_PUBLIC_STORYBLOK_DELIVERY_API_TOKEN) {
    return new Response("Invalid token", { status: 401 });
  }

  // Enable Draft Mode
  const draft = await draftMode();
  draft.enable();

  // In development, Next.js sets SameSite=Lax which blocks the cookie inside
  // cross-origin iframes (e.g. Storyblok visual editor on app.storyblok.com).
  // Override it to SameSite=None;Secure so it is sent in the iframe context.
  if (process.env.NODE_ENV === "development") {
    const cookieStore = await cookies();
    const bypassCookie = cookieStore.get("__prerender_bypass");
    if (bypassCookie) {
      cookieStore.set("__prerender_bypass", bypassCookie.value, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
      });
    }
  }

  return new Response("Draft mode enabled", { status: 200 });
}
