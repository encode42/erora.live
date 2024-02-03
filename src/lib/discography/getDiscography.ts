import type { Discography, DiscographyObject } from "$lib/types/discography/entries";
import type { Extra, ExtraObject } from "$lib/types/discography/extra";
import bandcamp, { ImageFormatFilter } from "@encode42/bandcamp-fetch";
import { getTrack } from "./getTrack";
import { getAlbum } from "./getAlbum";
import { debug } from "$lib/debug";

const discography: Discography = [];
let extra: Extra | undefined;

let currentPromise: Promise<void> | undefined;
let hasPopulated: boolean = false;

async function populate() {
    const debugName = "Discography Fetcher";
    debug(debugName, "Getting discography...");

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

    extra = {
        "lastUpdate": new Date()
    }

    hasPopulated = true;

    debug(debugName, "Done!");
}

export async function getDiscography(includeExtra: true): Promise<ExtraObject>
export async function getDiscography(includeExtra: false): Promise<DiscographyObject>
export async function getDiscography(includeExtra: boolean): Promise<DiscographyObject | ExtraObject> {
    if (extra && new Date().getTime() - extra.lastUpdate.getTime() > 3600000) {
        hasPopulated = false;

        debug("Discography Getter", "Invalidated discography population.");
    }

    if (!hasPopulated) {
        if (!currentPromise) {
            currentPromise = populate();
        }

        await currentPromise;

        currentPromise = undefined;
    }

    if (includeExtra && extra) {
        return {
            discography,
            extra
        }
    }
    
    return {
        discography
    };
}