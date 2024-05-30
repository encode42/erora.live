import { log } from "../log";
import { getLinksFromLabel } from "../songLink/links";
import { fixAlbum, fixDemo, generalAlbum } from "../songLink/overrides";
import type { MetaAlbum, MetaAlbumTrack } from "../types/discography/Album";
import type { MetaTrack } from "../types/discography/Track";

export async function populateAlbumTrackLinks({ position, parent, release }: MetaAlbumTrack) {
	log.info(`[${parent} -> ${release.label}] Populating song links`);

	let overrideParent = parent;
	let overrideLabel = release.label;
	if (parent === "AWRY") {
		overrideParent = fixAlbum(position);
		overrideLabel = fixDemo(release);
	}

	release.links = {
		...release.links,
		...(await getLinksFromLabel(overrideParent, overrideLabel))
	};
}

export async function populateAlbumLinks({ release }: MetaAlbum) {
	log.info(`[${release.label}] Populating song links`);

	let overrideLabel = release.label;
	if (release.label === "AWRY") {
		overrideLabel = generalAlbum();
	}

	release.links = {
		...release.links,
		...(await getLinksFromLabel(overrideLabel))
	};
}

export async function populateTrackLinks({ release }: MetaTrack) {
	log.info(`[${release.label}] Populating song links`);

	release.links = {
		...release.links,
		...(await getLinksFromLabel(release.label))
	};
}
