import type { Links } from "../Links";
import type { BaseTrack, TrimmableTrack } from "./Track";

export interface FeaturedTrack extends BaseTrack, TrimmableTrack {
	"featured": true;
	"why": string[];
}

export interface UnfeaturedTrack extends BaseTrack {
	"featured"?: false;
}

export type AlbumTrack = UnfeaturedTrack | FeaturedTrack;

export interface MetaAlbumTrack {
	"type": "albumTrack";
	"release": AlbumTrack;
	"parent": string;
	"position": number;
	"urls": {
		"stream": string;
	};
	"paths": {
		"release": string;
		"track": string;
		"audio": string;
	};
}

export interface Album {
	"type": "album";
	"slug": string;
	"released": number;
	"color"?: string;
	"links": Links;
	"label": string;
	"description"?: string[];
	"tracks": AlbumTrack[];
}

interface AlbumWithMetaTracks extends Omit<Album, "tracks"> {
	"tracks": MetaAlbumTrack[];
}

export interface MetaAlbum {
	"type": "album";
	"release": AlbumWithMetaTracks;
	"urls": {
		"cover": string;
	};
	"paths": {
		"release": string;
		"order": string;
		"tracks": string;
		"audio": string;
	};
}

export interface LocalAlbumTrack {
	"parent": string;
	"release": AlbumTrack;
	"paths": {
		"resource": string;
		"audio": string;
		"public": string;
	};
}

export interface LocalAlbum {
	"release": Album;
	"paths": {
		"resource": string;
		"audio": string;
		"public": string;
	};
}

export interface BuiltAlbumTrack extends Omit<FeaturedTrack, "featured" | "trim" | "duration" | "released"> {}

export interface BuiltAlbum extends Omit<Album, "tracks"> {
	"duration": number;
	"tracks": BuiltAlbumTrack[];
}
