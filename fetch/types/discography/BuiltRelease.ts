import type { AlbumRelease, TrackRelease } from "./Release";
import type { FeaturedTrack } from "./Track";

export interface BuiltAlbumTrack extends Omit<FeaturedTrack, "featured" | "trim" | "description" | "why"> {
	"description"?: string[];
	"why": string[];
}

export interface BuiltAlbum extends Omit<AlbumRelease, "ignored" | "tracks" | "description"> {
	"color": NonNullable<TrackRelease["color"]>;
	"tracks": BuiltAlbumTrack[];
	"description"?: string[];
}

export interface BuiltTrack extends Omit<TrackRelease, "trim" | "description"> {
	"color": NonNullable<TrackRelease["color"]>;
	"description"?: string[];
}

export type BuiltRelease = BuiltAlbum | BuiltTrack;
