import type { Links } from "../Links";

export interface Meta {
	"slug": string;
	"released": number;
	"links": Links;
	"label": string;
	"description"?: string;
	"color"?: string;
	"ignored"?: boolean;
}
