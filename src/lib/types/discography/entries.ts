import type { Sources, StreamSources } from "./sources"

export interface FeaturedTrack {
    "title": string,
    "description": {
        "bandcamp": string,
        "why": string
    },
    "url": StreamSources,
    "startAt": number,
    "endAt": number
}

export interface DiscographyBase {
    "title": string,
    "art"?: string,
    "description"?: string,
    "published": number
}

export interface Album extends DiscographyBase {
    "url": Sources,
    "featuredTracks": FeaturedTrack[],
    "type": "album"
}

export interface Track extends DiscographyBase {
    "url": StreamSources,
    "type": "track",
    "startAt": number,
    "endAt": number
}

export type DiscographyEntry = Album | Track;

export type Discography = DiscographyEntry[];

export interface DiscographyObject {
    "discography": Discography,
    "lastUpdate": number
}
