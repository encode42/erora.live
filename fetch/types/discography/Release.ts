import type { Album, BuiltAlbum } from "./Album";
import type { BuiltTrack, Track } from "./Track";

export type Release = Album | Track;
export type BuiltRelease = BuiltAlbum | BuiltTrack;
