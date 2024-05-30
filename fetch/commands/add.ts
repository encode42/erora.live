import { fetchMeta } from "../bandcamp/discography";
import { processAlbum, processAlbumTrack } from "../resource/album";
import { order, updateOrder } from "../resource/ensure";
import { processTrack } from "../resource/track";
import { parseUrl } from "../util/flags";

export async function run() {
	const url = parseUrl();

	// todo: wrapper for this
	const meta = await fetchMeta(url);
	switch (meta.type) {
		case "album":
			await processAlbum(meta);
			break;

		case "albumTrack":
			await processAlbumTrack(meta);
			break;

		case "track":
			await processTrack(meta);
			break;
	}

	await updateOrder([meta.release.slug, ...order]);
}
