import releasesData from "$lib/releases.json";
import type { BuiltRelease } from "$types/discography/Release";
import { XMLBuilder } from "fast-xml-parser";

export const prerender = true;

const releases = releasesData as BuiltRelease[];

// biome-ignore lint/style/useNamingConvention: SvelteKit convention
export async function GET() {
	const items = [];
	for (const release of releases) {
		items.push({
			"title": release.label,
			"description": release.description?.join(" "),
			"link": release.links.bandcamp,
			"guid": release.links.bandcamp,
			"pubDate": new Date(release.released).toUTCString()
		});
	}

	const builder = new XMLBuilder({
		"attributeNamePrefix": "@",
		"ignoreAttributes": false
	});

	const now = new Date();

	const xml = builder.build({
		"rss": {
			"@version": "2.0",
			"@xmlns:atom": "http://www.w3.org/2005/Atom",
			"channel": {
				"language": "en-us",
				"title": "erora",
				"description": "Issues arise, bugs form. Error is inevitable.",
				"link": "https://erora.live",
				"image": {
					"title": "erora logo",
					"url": "https://erora.live/badge.png",
					"link": "https://erora.live"
				},
				"atom:link": {
					"@href": "https://erora.live/api/rss"
				},
				"lastBuildDate": now.toUTCString(),
				"ttl": 60 - Math.round((new Date().getTime() - now.getTime()) / 60000),
				"item": items
			}
		}
	});

	return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${xml}`, {
		"headers": {
			"Content-Type": "text/xml"
		}
	});
}
