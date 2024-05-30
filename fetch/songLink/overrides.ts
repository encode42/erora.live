import type { AlbumTrack } from "../types/discography/Album";

export function generalAlbum() {
	return "AWRY, Vol. 1";
}

export function fixAlbum(position: number) {
	return `AWRY, Vol. ${position < 22 ? 1 : 2}`;
}

export function fixDemo(release: AlbumTrack) {
	return release.label
		.replace("\(Demo\)", "- Demo")
		.replaceAll(/"/g, "");
}
