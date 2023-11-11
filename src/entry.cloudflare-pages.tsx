import type { PlatformCloudflarePages } from "@builder.io/qwik-city/middleware/cloudflare-pages";
import { createQwikCity } from "@builder.io/qwik-city/middleware/cloudflare-pages";
import qwikCityPlan from "@qwik-city-plan";
import { manifest } from "@qwik-client-manifest";
import render from "./entry.ssr";

declare global {
    interface QwikCityPlatform extends PlatformCloudflarePages {}
}

export const fetch = createQwikCity({
    render,
    qwikCityPlan,
    manifest
});
