import type { Discography, DiscographyObject } from "$lib/types/discography/entries";
import bandcamp, { ImageFormatFilter } from "@encode42/bandcamp-fetch";
import { getTrack } from "./getTrack";
import { getAlbum } from "./getAlbum";
import { debug } from "$lib/debug";
import { dev } from "$app/environment";
import { LocalStore } from "$lib/store/local";
import { CloudflareStore } from "$lib/store/cloudflare";

// todo: use worker to update every hour
// alternatively, github action to rebuild

interface Populate {
    "discography": Discography,
    "lastUpdate": Date
}

const debugName = "Discography Getter";
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
    const store = new (dev ? LocalStore : CloudflareStore)(namespace);

    const discography = await store.get<Discography>("discography");
    if (!discography) {
        debug(debugName, "Discography does not exist. Fetching...");
        return await update(store);
    }

    const lastUpdate = await store.get<number>("lastUpdate") ?? 0;
    if (new Date().getTime() - lastUpdate > 3600000) {
        debug(debugName, "Updating discography store ~~in the background~~...");
        await update(store);
    }    

    debug(debugName, "Discography store is valid. Returrning retrieved object.");
    return {
        discography,
        lastUpdate
    };
}

export async function update(store: LocalStore | CloudflareStore) {
    if (!currentPromise) {
        currentPromise = populate();
    }

    const populated = await currentPromise;
    currentPromise = undefined;

    const now = new Date().getTime();

    await store.set("discography", populated.discography);
    await store.set("lastUpdate", now);

    debug(debugName, "Done!");

    return {
        "discography": populated.discography,
        "lastUpdate": now
    }
}
