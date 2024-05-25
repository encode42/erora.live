import type { Album } from "./discography/Album";
import type { AlbumRelease } from "./discography/Release";
import type { AlbumTrack, SingleTrack } from "./discography/Track";

interface TransformAlbum {
	"album": AlbumRelease;
}

interface TransformAlbumTrack {
	"album": Album;
	"track": AlbumTrack;
}

interface TransformTrack {
	"track": SingleTrack;
}

interface BaseOverride<T> {
	"label": string;
	"transform": (parameters: T) => Promise<void>;
}

interface AlbumOverride extends BaseOverride<TransformAlbum> {
	"type": "album";
}

interface AlbumTrackOverride extends BaseOverride<TransformAlbumTrack> {
	"type": "albumTrack";
}

interface TrackOverride extends BaseOverride<TransformTrack> {
	"type": "track";
}

export type Override = AlbumOverride | AlbumTrackOverride | TrackOverride;
