import { defineConfig } from "storyblok/config";

export default defineConfig({
  space: "293579761007546",
  path: ".storyblok",
  token: process.env.STORYBLOK_MAPI_TOKEN,
});
