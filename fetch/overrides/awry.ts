import type { Override } from "../types/Override";
import { getLinksFromLabel } from "../songLink/links";
import { log } from "../log";

export const awry: Override = {
	"type": "album",
	"label": "AWRY",
	"transform": async ({ album }) => {
		log.info("Fetching song links for split album...");

		album.links = {
			...album.links,
			...(await getLinksFromLabel("AWRY, Vol. 1"))
		};

		for (const [index, track] of album.tracks.entries()) {
			log.info(`	✔ ${track.label}`);

			track.links = {
				...track.links,
				...(await getLinksFromLabel(`AWRY, Vol. ${index < 21 ? 1 : 2}`))
			};
		}

		log.debug("Fetched song links!");
	}
};
