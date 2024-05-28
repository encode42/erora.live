<script lang="ts">
import { IconPlayerPauseFilled, IconPlayerPlayFilled } from "@tabler/icons-svelte";
import { cubicOut } from "svelte/easing";
import { tweened } from "svelte/motion";

export let src: string;

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
</script>

<div>
	<video
		preload="metadata"
		playsinline
		bind:paused
		bind:duration
		bind:currentTime
		on:ended={() => {
			currentTime = 0;
		}}
		{src}
	/>

	<button
		class:paused
		on:click={() => {
			paused = !paused
		}}
	>
		{#if paused}
			<IconPlayerPlayFilled/>
		{:else}
			<IconPlayerPauseFilled/>
		{/if}
	</button>

	<progress value={$progress} max={1}/>
</div>

<style>
	div {
		position: relative;
		border-radius: 1rem;
		overflow: hidden;
		line-height: 0;
	}

	div:hover > button {
		opacity: 1;
	}

	video {
		width: 100%;
	}

	button {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		margin: auto;
		display: flex;
		align-items: center;
		aspect-ratio: 1/1;
		border: none;
		border-radius: 50%;
		background: var(--color-primary);
		cursor: pointer;
		height: 4cqmax;
		transition-property: background, scale, opacity;
		transition-duration: 1s;
		transition-timing-function: var(--transition-snappy);
		opacity: 0;
	}

	button.paused {
		opacity: 1;
	}

	button :global(svg) {
		color: var(--color-background);
		width: 100%;
		height: 50%;
	}

	button:hover, button:focus-visible {
		background: var(--color-secondary);
		color: var(--color-background);
		scale: 115%;
	}

	progress[value] {
		position: absolute;
		left: 0;
		bottom: 0;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		width: 100%;
		height: 2.5%;
		border: none;
		background: transparent;
		overflow: hidden;
	}

	progress[value]::-webkit-progress-bar {
		border-radius: 2rem;
		background: transparent;
	}

	progress[value]::-webkit-progress-value {
		border-radius: 0 2rem 2rem 0;
		background: var(--color-primary);
	}

	progress[value]::-moz-progress-bar {
		background: var(--color-primary);
	}
</style>