import type { Discography, DiscographyObject } from "$lib/types/discography/entries";
import bandcamp, { ImageFormatFilter } from "@encode42/bandcamp-fetch";
import { getTrack } from "./getTrack";
import { getAlbum } from "./getAlbum";
import { debug } from "$lib/debug";
import { dev } from "$app/environment";
import { LocalStore } from "$lib/store/local";
import { CloudflareStore } from "$lib/store/cloudflare";

interface Populate {
    "discography": Discography,
    "lastUpdate": Date
}

let currentPromise: Promise<Populate> | undefined;

async function populate(): Promise<Populate> {
    const debugName = "Discography Fetcher";
    debug(debugName, "Getting discography...");

    const discography: Discography = [];

    const imageFormats = await bandcamp.image.getFormats(ImageFormatFilter.Album);
    const largeImageFormat = imageFormats.find(format => format.name === "art_app_large");

    const bandcampEntries = await bandcamp.band.getDiscography({
        "bandUrl": "https://erora.bandcamp.com"
    });

    for (const entry of bandcampEntries) {
        if (!entry.url) {
            continue;
        }

        const discographyEntry = await (entry.type === "track" ? getTrack : getAlbum)(entry.url, largeImageFormat);
        if (!discographyEntry) {
            continue;
        }

        discography.push(discographyEntry);
    }

    debug(debugName, "Done!");

    return {
        discography,
        "lastUpdate": new Date()
    }
}
export async function getDiscography(namespace?: KVNamespace): Promise<DiscographyObject> {
    const debugName = "Discography Getter";
    const store = new (dev ? LocalStore : CloudflareStore)(namespace);

    const discography = await store.get<Discography>("discography");
    const lastUpdate = await store.get<number>("lastUpdate");

    if (discography && (lastUpdate && new Date().getTime() - lastUpdate < 3600000)) {
        debug(debugName, "Discography store is valid. Returrning retrieved object.");

        return {
            discography
        };
    }

    if (!currentPromise) {
        currentPromise = populate();
    }

    const populated = await currentPromise;
    currentPromise = undefined;

    await store.set("discography", populated.discography);
    await store.set("lastUpdate", new Date().getTime());
    
    return {
        "discography": populated.discography
    }
}