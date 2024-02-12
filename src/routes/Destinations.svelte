<script lang="ts">
    import type { Sources, StreamSources } from "$lib/types/discography/sources";
    import { IconBrandApple, IconBrandBandcamp, IconBrandSpotify, IconBrandYoutube } from "@tabler/icons-svelte";
	import Button from "./Button.svelte";

    type Destinations = {
        [key in keyof Required<Sources>]: {
            "name": string,
            "color": string,
            "icon": typeof IconBrandBandcamp
        }
    }

    export let urls: StreamSources | Sources;
    export let slim: boolean = false;

    const destinations: Destinations = {
        "bandcamp": {
            "name": "Bandcamp",
            "color": "var(--ctp-macchiato-teal)",
            "icon": IconBrandBandcamp
        },
        "appleMusic": {
            "name": "Apple Music",
            "color": "var(--ctp-macchiato-text)",
            "icon": IconBrandApple
        },
        "spotify": {
            "name": "Spotify",
            "color": "var(--ctp-macchiato-green)",
            "icon": IconBrandSpotify
        },
        "youtube": {
            "name": "YouTube",
            "color": "var(--ctp-macchiato-red)",
            "icon": IconBrandYoutube
        }
    }
</script>

<div>
    {#each Object.entries(destinations) as [destination, value]}
        {#if destination in urls}
            <Button href={urls[destination]} color={value.color} {slim}>
                <svelte:component this={value.icon}/>
                {value.name}
            </Button>
        {/if}
    {/each}
</div>

<style>
    div {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }
</style>
