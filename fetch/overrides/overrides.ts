import type { Override } from "../types/Override";
import { awry } from "./awry";

interface Overrides {
	[label: string]: Override;
}

export const overrides: Overrides = {};

overrides[awry.label] = awry;
