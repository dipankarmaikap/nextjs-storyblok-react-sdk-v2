import { draftMode } from "next/headers";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const draft = await draftMode();
  draft.disable();

  // In development the cookie was set with SameSite=None;Secure to work inside
  // the Storyblok iframe. Next.js's disable() clears it with SameSite=Lax,
  // which the browser ignores in a cross-origin iframe context.
  // Explicitly expire it with the same attributes so the browser accepts the deletion.
  if (process.env.NODE_ENV === "development") {
    const cookieStore = await cookies();
    const bypassCookie = cookieStore.get("__prerender_bypass");
    if (bypassCookie) {
      cookieStore.set("__prerender_bypass", "", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
        expires: new Date(0),
      });
    }
  }

  return new Response("Draft mode disabled", { status: 200 });
}
