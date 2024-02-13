export interface SpotifyTrack {
	"uri": string;
}

export interface SpotifyTracks {
	[key: string]: SpotifyTrack;
}

export interface SpotifyAlbum {
	"uri": string;
	"tracks": SpotifyTracks;
}

export interface SpotifyAlbums {
	[key: string]: SpotifyAlbum;
}
