import { fetchMeta } from "../bandcamp/discography";
import { processAlbum, processAlbumTrack } from "../resource/album";
import { processTrack } from "../resource/track";
import { parseUrl } from "../util/flags";

export async function run() {
	const url = parseUrl();

	const meta = await fetchMeta(url);
	switch (meta.type) {
		case "album":
			await processAlbum(meta);
			break;

		// TODO: Doesn't update order.json yet
		case "albumTrack":
			await processAlbumTrack(meta);
			break;

		case "track":
			await processTrack(meta);
			break;
	}
}
