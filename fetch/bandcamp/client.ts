import type { ImageFormat } from "@encode42/bandcamp-fetch";
import bandcamp from "@encode42/bandcamp-fetch";
import { log } from "../log";
import { string } from "../util/env";
import { ImpossibleError } from "../util/ImpossibleError";

bandcamp.cache.setMaxPages(-1);
bandcamp.setCookie(string("BANDCAMP_COOKIE"));

log.debug("Searching for the largest image format...");
const imageFormats = await bandcamp.image.getFormats();

export let largeImageFormat: ImageFormat | undefined;
for (const imageFormat of imageFormats) {
	if (imageFormat.fileFormat !== "JPEG") {
		continue;
	}

	if (imageFormat.width === undefined || imageFormat.width !== imageFormat.height) {
		continue;
	}

	if (!largeImageFormat || imageFormat.width > largeImageFormat.width) {
		largeImageFormat = imageFormat;
	}
}

if (!largeImageFormat) {
	throw new ImpossibleError();
}

log.debug(`Largest image format: ${largeImageFormat.name} (${largeImageFormat.width}x${largeImageFormat.height})`);

export const client = bandcamp.limiter;
