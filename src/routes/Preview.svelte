<script lang="ts" context="module">
    let currentTarget: HTMLAudioElement;

    export function stopAll() {
        if (!currentTarget) {
            return;
        }

        currentTarget.pause();
    }
</script>

<script lang="ts">
    import type { AlbumSources, TrackSources } from "./+page.server";
    import { tweened } from "svelte/motion";
	import { cubicOut } from "svelte/easing";
    import Destinations from "./Destinations.svelte";
    import { IconPlayerPlayFilled, IconPlayerStopFilled } from "@tabler/icons-svelte";

    export let src: string;
    export let urls: AlbumSources | TrackSources | undefined = undefined;
    export let startAt: number;
    export let endAt: number;

    let audioElement: HTMLAudioElement;
    let currentTime: number = startAt;
    let paused = true;

    const progress = tweened(0, {
        "duration": 1000,
        "easing": cubicOut
    });

    $: progress.set((currentTime - startAt) / ((endAt + 1) - startAt))

    $: if (currentTime > endAt + 1) {
        paused = true;
        currentTime = startAt;
    } 
</script>

<div class="wrapper">
    <div class="audio">
        <audio
            {src}
            bind:this={audioElement}
            bind:currentTime
            bind:paused
            volume={0.2}
            preload="metadata"
            on:play={(event) => {
                if (currentTarget !== event.currentTarget) {
                    if (currentTarget) {
                        currentTarget.pause();
                    }
                    
                    currentTarget = event.currentTarget;
                }
    
                currentTarget.volume = 0.25;
    
                audioElement.currentTime = startAt;
            }}
            on:pause={() => {
                currentTime = startAt;
            }}
            on:ended={() => {
                currentTime = startAt;
            }}
        />
        <button
            aria-label={paused ? "play" : "pause"}
            on:click={() => {
                paused = !paused;
            }}
        >
            {#if paused}
                <IconPlayerPlayFilled/>
            {:else}
                <IconPlayerStopFilled/>
            {/if}
        </button>
        <progress
            value={$progress}
            max={1}
        />
    </div>
    {#if urls}
        <Destinations slim {urls}/>
    {/if}
</div>

<style>
    .wrapper {
        display: flex;
        flex-direction: column;
        gap: 1rem
    }

    .audio {
        display: grid;
        grid-template-columns: 3rem 1fr;
        gap: 1rem
    }

    button {
        border: none;
        border-radius: 100%;
        width: 100%;
		aspect-ratio: 1;
        padding: 0.5rem;
        background: var(--color-primary);
        color: var(--color-surface);
        transition: transform 0.1s var(--transition-snappy);
        cursor: pointer;
    }

    button[aria-label="pause"] {
        background: var(--color-destructive);
        animation: bubble 0.25s ease-out;
    }

    button :global(svg) {
        width: 100%;
        height: 100%;
    }

    button:hover, button:focus-visible {
        background: var(--color-secondary);
        transform: scale(110%);
    }

    button:focus {
        outline: none;
    }

    progress[value] {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        height: 100%;
        width: 100%;
        border: none;
        border-radius: 2rem;
        background: var(--color-surface);
        overflow: hidden;
    }

    progress[value]::-webkit-progress-bar {
        border-radius: 2rem;
        background: var(--color-surface);
    }
    
    progress[value]::-webkit-progress-value {
        background: var(--color-primary);
    }

    progress[value]::-moz-progress-bar {
        background: var(--color-primary);
    }

    @keyframes bubble {
        from {
            transform: scale(125%);
        }
		to {
			transform: scale(110%);
		}
	}
</style>