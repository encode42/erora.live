import releasesData from "$lib/releases.json";
import type { BuiltRelease } from "$types/discography/BuiltRelease";
import { json } from "@sveltejs/kit";

export const prerender = true;

const releases = releasesData as BuiltRelease[];

// biome-ignore lint/style/useNamingConvention: SvelteKit convention
export async function GET() {
	return json(releases[0]);
}
