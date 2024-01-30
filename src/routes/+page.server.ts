import bcfetch from "bandcamp-fetch";
import pThrottle from "p-throttle";

const sources = [
    "bandcamp",
    "spotify",
    "appleMusic",
    "youtube"
] as const;

export type AlbumSources = {
    [key in typeof sources[number]]?: string
}

export interface TrackSources extends AlbumSources {
    "stream": string
}

interface FeaturedTrack {
    "title": string,
    "description": {
        "bandcamp": string,
        "why": string
    },
    "url": TrackSources,
    "startAt": number,
    "endAt": number
}

interface DiscographyBase {
    "title": string,
    "art"?: string,
    "description"?: string
}

export interface Album extends DiscographyBase {
    "url": AlbumSources,
    "featuredTracks": FeaturedTrack[],
    "type": "album"
}

export interface Track extends DiscographyBase {
    "url": TrackSources,
    "type": "track",
    "startAt": number,
    "endAt": number
}

interface LocalTrack {
    "startAt": Track["startAt"],
    "endAt": Track["endAt"]
}

interface LocalFeaturedTrack {
    "title": FeaturedTrack["title"],
    "why": FeaturedTrack["description"]["why"],
    "startAt": FeaturedTrack["startAt"],
    "endAt": FeaturedTrack["endAt"]
}

interface LocalTracks {
    [key: string]: LocalTrack
}

interface LocalFeaturedTracks {
    [key: string]: LocalFeaturedTrack[]
}

const localTracks: LocalTracks = {
    "G03C": {
        "startAt": 184.25,
        "endAt": 257.5
    }
}

const localFeaturedTracks: LocalFeaturedTracks = {
    "Momentum Deceived": [{
        "title": "Planadaxic",
        "why": "The most computationally complex track I've produced. The aforementioned \"beeps\" alone overloaded my system. This marked the beginning of my massive instrument patch journey!",
        "startAt": 385,
        "endAt": 435
    }, {
        "title": "So Far",
        "why": "It's important to understand when it might be time to cut your losses and start over. I had considered just pushing onwards with the initial sound of the track, yet I decided that I wouldn't be as happy with the final product, which wasn't worth it.",
        "startAt": 205,
        "endAt": 252
    }, {
        "title": "Precipice of Origin",
        "why": "A calming melody with an epic chorus. Despite its simplicity, this track went through many hours of slight tweaks in order to make each instrument intertwined.",
        "startAt": 97.5,
        "endAt": 156.5
    }, {
        "title": "Momentum Deceived",
        "why": "Upon starting this track, my biggest goal was to produce realistic percussion. This is something I had attempted in the past, but in every case, I felt as though it was too complicated yet repetitive. I used BFD3's visualizations to think like a drummer, and write complex - yet not impossible patterns.",
        "startAt": 168,
        "endAt": 221
    }, {
        "title": "Order",
        "why": "As a musician, I've been learning how to play various instruments all my life. Though, one instrument I constantly pushed away was the piano. Since most of my work is synthesized through a piano roll, learning the piano could enhance my understanding of what I'm producing.",
        "startAt": 99.175,
        "endAt": 172
    }],
    "Midten": [{
        "title": "Dø",
        "why": "Prior to this track, many of my songs were very repetitive. Most of them were built off of the same chorus, melody, ambience, etc. I wanted to change this, and experimented with splitting this track into different parts, and returning to the original chorus at the end.",
        "startAt": 195.15,
        "endAt": 272
    }, {
        "title": "Huil",
        "why": "It's important to branch out and try new things. This was my method of doing so. In the process, I learned a lot about both the target genre and my own personal styles. This may not be D&B, but the influence is there!",
        "startAt": 142,
        "endAt": 198.75
    }],
    "Wisp": [{
        "title": "Valley",
        "why": "Produced after Continuum, which is featured below, this track was my attempt at polishing my percussion style. I wanted to implement more parts of the drum kit into my patterns, resulting in heavy use of the toms.",
        "startAt": 122.15,
        "endAt": 156.25
    }, {
        "title": "End of Time",
        "why": "This track unknowingly paved the way for my future album, Momentum Deceived. Its retro vibe and heavy compression made their way into my personal mixing style.",
        "startAt": 210,
        "endAt": 270.5
    }, {
        "title": "Continuum",
        "why": "This was my first attempt at synthesizing percussion that could theoretically be played by a drummer. It also features one of my favorite instruments, the Mellotron!",
        "startAt": 99.3,
        "endAt": 137
    }, {
        "title": "Sanity's Culmination",
        "why": "Not only was this my first attempt at producing a proggy song, it's also the first track I wrote lyrics for. Even if cheesy, being based on events that took place in my life, they came from the heart.",
        "startAt": 335,
        "endAt": 434.5
    }, {
        "title": "Equinox",
        "why": "I just really like this track. It's likely one of my more unique tracks, featuring a very hollow mixing style. I often mix my tracks to sound very wide and full, causing this one to stick out!",
        "startAt": 106.75,
        "endAt": 169.5
    }],
    "Collection": [{
        "title": "Natural Decay",
        "why": "I still believe this track holds up to this day. I hadn't learned the art of simplicity yet, and I believed that my future tracks had to be more complex in order to prove my ability. Yet, often, the opposite is true, and this track proves it.",
        "startAt": 130,
        "endAt": 215
    }, {
        "title": "Kelno",
        "why": "While Natural Decay is the first track I publicly released, Kelno was the first track I released featuring a realistic style. I believe this song falls under the genre of contemporary, with realistic and synthetic instruments intertwined.",
        "startAt": 117.25,
        "endAt": 157.75
    }, {
        "title": "Gaze",
        "why": "While producing this track, I did not understand what I was doing. Only after it was released did I realize that I had written a song with time signature shenanigans. As someone who enjoys progressive music, this delighted me!",
        "startAt": 48.5,
        "endAt": 112
    }, {
        "title": "Grimear",
        "why": "This is the first track I made for an individual other than myself. It was also the second track I produced.",
        "startAt": 128,
        "endAt": 163.5
    }]
}

async function getAlbum(url: string): Promise<Album | undefined> {
    console.debug(`Fetching information for album URL ${url}...`);

    const albumInfo = await bcfetch.album.getInfo({
        "albumUrl": url,
        "includeRawData": true
    });

    const featuredTracks: FeaturedTrack[] = [];
    if (albumInfo.tracks && albumInfo.name in localFeaturedTracks) {
        for (const featuredTrack of localFeaturedTracks[albumInfo.name]) {
            const trackUrl = albumInfo.tracks.find(track => track.name === featuredTrack.title)?.url;
            if (!trackUrl) {
                continue;
            }

            console.debug(`Fetching information for track URL (within album) ${trackUrl}...`);

            const trackInfo = await bcfetch.track.getInfo({
                "trackUrl": trackUrl,
                "includeRawData": true
            });

            if (!trackInfo.streamUrl) {
                continue;
            }

            featuredTracks.push({
                "title": trackInfo.name,
                "description": {
                    "bandcamp": trackInfo.raw?.basic.description,
                    "why": featuredTrack.why
                },
                "url": {
                    "stream": trackInfo.streamUrl,
                    //...await getLinks(trackUrl, true) song.link doesn't properly support Bandcamp links... maybe fallback to Spotify?
                },
                "startAt": featuredTrack.startAt,
                "endAt": featuredTrack.endAt
            })
        }
    }

    return {
        "title": albumInfo.name,
        "art": albumInfo.imageUrl,
        "description": albumInfo.raw?.basic.description,
        "url": {
            ...await getLinks(url, false)
        },
        featuredTracks,
        "type": "album"
    }
}

async function getTrack(url: string): Promise<Track | undefined> {
    console.debug(`Fetching information for track URL ${url}...`);

    const trackInfo = await bcfetch.track.getInfo({
        "trackUrl": url,
        "includeRawData": true
    });

    if (!trackInfo.streamUrl) {
        return;
    }

    return {
        "title": trackInfo.name,
        "art": trackInfo.imageUrl,
        "description": trackInfo.raw?.basic.description,
        "url": {
            "stream": trackInfo.streamUrl,
            ...await getLinks(url, true)
        },
        "type": "track",
        "startAt": localTracks[trackInfo.name]?.startAt ?? 0,
        "endAt": localTracks[trackInfo.name]?.endAt ?? 30
    }
}

const songLinkThrottler = pThrottle({
    "limit": 10,
    "interval": 60000,
    "onDelay": () => {
        console.debug("Hit song.link ratelimit, delaying requests...");
    }
});

const fetchSongLink = songLinkThrottler(async (url, isTrack) => {
    const songLinkEndpoint = new URL("https://api.song.link/v1-alpha.1/links");
    
    songLinkEndpoint.searchParams.set("url", encodeURIComponent(url));
    songLinkEndpoint.searchParams.set("songIfSingle", isTrack);

    console.debug(`Fetching from ${songLinkEndpoint.toString()}`)

    const request = await fetch(songLinkEndpoint.toString(), {
        "headers": {
            "User-Agent": "encode42/erora.live (me@encode42.dev)"
        }
    });

    if (!request.ok) {
        if (request.status === 404) {
            console.debug("No URLs could be fetched.");
            return;
        }

        console.debug(`An error occured! ${request.statusText}`);
        return;
    }

    return await request.json();
})

async function getLinks(url: string, isTrack: boolean): Promise<Omit<TrackSources, "stream">> {
    const urls: AlbumSources = {
        "bandcamp": url
    };

    console.debug(`Getting streaming URLs from song.link for URL ${url}...`);

    const songLinks = await fetchSongLink(url, isTrack);
    if (!songLinks) {
        return urls;
    }

    for (const source of sources) {
        if (!songLinks.linksByPlatform[source]) {
            continue;
        }

        urls[source] = songLinks.linksByPlatform[source].url;
    }

    console.debug(`Found the following URLs: ${Object.keys(urls).join(", ")}`);

    return {
        ...urls
    };
}

export async function load() {
    const discography: (Album | Track)[] = [];

    const bandcampDiscography = await bcfetch.band.getDiscography({
        "bandUrl": "https://erora.bandcamp.com"
    });

    for (const entry of bandcampDiscography) {
        if (!entry.url) {
            continue;
        }

        const discographyEntry = await (entry.type === "track" ? getTrack : getAlbum)(entry.url);
        if (!discographyEntry) {
            continue;
        }

        discography.push(discographyEntry);
    }

    return {
        discography
    }
}
