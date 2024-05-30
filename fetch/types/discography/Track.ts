import type { Links } from "../Links";

export interface TrimmableTrack {
	"trim": {
		// TODO: stretch goal - crossfade between different trims?
		"start": string;
		"duration": number;
	};
}

export interface BaseTrack {
	"slug": string;
	"duration": number;
	"links": Links;
	"label": string;
	"description"?: string[];
}

export interface Track extends BaseTrack, TrimmableTrack {
	"type": "track";
	"released": number;
	"color"?: string;
	"ignored"?: boolean;
}

export interface MetaTrack {
	"type": "track";
	"release": Track;
	"urls": {
		"stream": string;
		"cover": string;
	};
	"paths": {
		"release": string;
		"audio": string;
	};
}

export interface LocalTrack {
	"release": Track;
	"paths": {
		"resource": string;
		"public": string;
	};
}

export interface BuiltTrack extends Omit<Track, "trim" | "description"> {
	"color": NonNullable<Track["color"]>;
	"description"?: string[];
}
