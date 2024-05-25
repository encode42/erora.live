import type { Platform } from "./songLink/Platform";

export type Links = {
	// biome-ignore lint/style/useNamingConvention: <explanation>
	[platform in Platform | "bandcamp" | "songLink"]?: string;
};

export const songLinkOrder: Platform[] = ["spotify", "appleMusic", "youtube"];
export const linkOrder: (keyof Links)[] = ["bandcamp", ...songLinkOrder, "songLink"];
