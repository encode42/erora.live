import { flavors } from "@catppuccin/palette";
import type { BuiltTrack, LocalTrack } from "../types/discography/Track";
import { trimTrack } from "./trim";

export function buildTrack(meta: LocalTrack): BuiltTrack {
	trimTrack(meta);

	const { trim: _, ...trimlessTrack } = meta.release;

	trimlessTrack.color ??= flavors.macchiato.colors.mauve.hex;

	return trimlessTrack;
}
