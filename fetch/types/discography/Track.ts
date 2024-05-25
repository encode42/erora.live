import type { Meta } from "./Meta";

interface Trim {
	"trim": {
		// TODO: stretch goal - crossfade between different trims?
		"start": string;
		"duration": number;
	};
}

interface BaseTrack {
	"slug": Meta["slug"];
	"links": Meta["links"];
	"label": Meta["label"];
	"description"?: Meta["description"];
}

export interface SingleTrack extends BaseTrack, Trim {
	"released": Meta["released"];
	"color"?: Meta["color"];
	"ignored"?: Meta["ignored"];
}

export interface FeaturedTrack extends BaseTrack, Trim {
	"featured": true;
	"why": string;
}

export interface UnfeaturedTrack extends BaseTrack {
	"featured"?: false;
}

export type AlbumTrack = UnfeaturedTrack | FeaturedTrack;
