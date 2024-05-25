import type { Meta } from "./Meta";
import type { AlbumTrack } from "./Track";

export interface Album extends Meta {
	"tracks": AlbumTrack[];
}
