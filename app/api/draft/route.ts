import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // Validate the secret token from Storyblok
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug") || "/";

  // Check the secret matches your Storyblok token
  if (secret !== process.env.NEXT_PUBLIC_STORYBLOK_DELIVERY_API_TOKEN) {
    return new Response("Invalid token", { status: 401 });
  }

  // Enable Draft Mode
  const draft = await draftMode();
  draft.enable();

  // Redirect to the path being previewed
  redirect(slug.startsWith("/") ? slug : `/${slug}`);
}
