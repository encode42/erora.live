import type { BuiltTrack } from "../types/discography/BuiltRelease";
import type { TrackRelease } from "../types/discography/Release";
import { flavors } from "@catppuccin/palette";
import { trim } from "./trim";

export function buildTrack(track: TrackRelease, resourcePath: string, publicPath: string): BuiltTrack {
	trim(resourcePath, publicPath, track);

	const { trim: _, ...trimlessTrack } = track;

	return {
		...trimlessTrack,
		"color": trimlessTrack.color ?? flavors.macchiato.colors.mauve.hex,
		"description": track.description?.split("\n")
	};
}
