<script lang="ts" context="module">
const volume = 0.25;
let currentTarget: HTMLAudioElement | undefined;

export function pause() {
	if (!currentTarget) {
		return;
	}

	currentTarget.pause();
	currentTarget.currentTime = 0;
}
</script>

<script lang="ts">
    import { cubicOut } from "svelte/easing";
    import { tweened } from "svelte/motion";
	import { IconBrandApple, IconBrandBandcamp, IconBrandSpotify, IconBrandYoutube, IconExternalLink, IconPlayerPlayFilled, IconPlayerStopFilled } from "@tabler/icons-svelte";
    import type { Links } from "$types/Links";
	import Button from "$lib/Button.svelte";

	export let src: string;
	export let color: string;
	export let links: Links;

	let audioElement: HTMLAudioElement;

	let paused = true;
	let currentTime = 0;
	let duration: number | undefined;

	const progress = tweened(0, {
		"duration": 1000,
		"easing": cubicOut
	});

	$: if (duration) {
		progress.set(currentTime / duration);
	}

	const buttons = {
		"bandcamp": {
			"label": "Bandcamp",
			"color": "teal",
			"icon": IconBrandBandcamp
		},
		"appleMusic": {
			"label": "Apple Music",
			"color": "text",
			"icon": IconBrandApple
		},
		"spotify": {
			"label": "Spotify",
			"color": "green",
			"icon": IconBrandSpotify
		},
		"youtube": {
			"label": "YouTube",
			"color": "red",
			"icon": IconBrandYoutube
		},
		"songLink": {
			"label": "song.link",
			"color": "blue",
			"icon": IconExternalLink
		}
	}
</script>

<audio
	bind:this={audioElement}
	bind:currentTime
	bind:duration
	bind:paused
	on:play={() => {
		audioElement.volume = volume;

		if (currentTarget !== audioElement) {
			pause();

			currentTarget = audioElement;
		}
	}}
	on:ended={() => {
		pause();
	}}
>
	<source src="{src}.ogg" type="audio/ogg"/>
	<source src="{src}.mp3" type="audio/mpeg"/>
</audio>

<div style:--color={color} class="controls">
	<button
		class:active={!paused}
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

	<progress value={$progress} max={1}/>
</div>

<div class="links">
	{#each Object.entries(links) as [source, url]}
		<Button
				title={buttons[source].label}
				color="var(--ctp-macchiato-{buttons[source].color})"
				href={url}
				slim
				empty
		>
			<svelte:component this={buttons[source].icon}/>
		</Button>
	{/each}
</div>

<style>
	.controls {
		display: grid;
        grid-template-columns: 4cqmax 1fr;
        gap: 1rem
	}

	button {
		display: flex;
		align-items: center;
		aspect-ratio: 1/1;
		border: none;
		border-radius: 50%;
		color: var(--color-background);
		background: var(--color-actionable);
		transition-property: background, transform;
		transition-duration: 1s;
		transition-timing-function: var(--transition-snappy);
		cursor: pointer;
	}
	
	button.active {
		background: var(--color-destructive);
	}

	button:hover, button:focus-visible {
		background: var(--color);
		transform: scale(115%);
		outline: none;
	}

	button :global(svg) {
		width: 100%;
		height: 50%;
	}

	progress[value] {
		-webkit-appearance: none;
        -moz-appearance: none;
		appearance: none;
		height: 100%;
		width: 100%;
		border: none;
		border-radius: 4cqmax;
		background: var(--ctp-macchiato-mantle);
		overflow: hidden;
	}

	progress[value]::-webkit-progress-bar {
		border-radius: 2rem;
		background: var(--ctp-macchiato-mantle);
	}

	progress[value]::-webkit-progress-value {
        background: var(--color);
    }

	progress[value]::-moz-progress-bar {
        background: var(--color);
    }

	.links {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		padding-top: 1rem;
	}

	@media (width <= 800px) {
		.controls {
			grid-template-columns: 10cqmin 1fr;
		}
	}
</style>