import { getDiscography } from "$lib/discography/getDiscography";
import { json } from "@sveltejs/kit";
import { XMLBuilder } from "fast-xml-parser";

export async function GET({ platform }) {
    const discography = await getDiscography(platform?.env?.["erora-live"]);

    const lastUpdate = new Date(discography.lastUpdate);

    const items = [];
    for (const entry of discography.discography) {
        items.push({
            "title": entry.title,
            "description": entry.description?.replaceAll(/(\r\n)/gm, ""),
            "link": entry.url.bandcamp,
            "pubDate": new Date(entry.published).toUTCString(),
            "guid": entry.title
        });
    }

    const builder = new XMLBuilder({
        "attributeNamePrefix": "@",
        "ignoreAttributes": false
    });

    const xml = builder.build({
        "rss": {
            "@version": "2.0",
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
                "item": items,
                "lastBuildDate": new Date(discography.lastUpdate).toUTCString(),
                "ttl": 60 - Math.round((new Date().getTime() - discography.lastUpdate) / 60000),
            }
        }
    });

    return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${xml}`, {
        "headers": {
            "Content-Type": "text/xml"
        }
    });
}
