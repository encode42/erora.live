import type { sources } from "$lib/data/discography/sources"

export type Sources = {
    [key in typeof sources[number]]?: string
}

export interface StreamSources extends Sources {
    "stream": string
}
