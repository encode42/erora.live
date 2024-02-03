import type { DiscographyObject } from "./entries";

export interface Extra {
    "lastUpdate": Date
}

export interface ExtraObject extends DiscographyObject {
    "extra": Extra
}
