import type { ImageFormat } from "@encode42/bandcamp-fetch";
import bandcamp from "@encode42/bandcamp-fetch";
import { string } from "../util/env";

bandcamp.setCookie(string("BANDCAMP_COOKIE"));

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

export const client = bandcamp.limiter;
