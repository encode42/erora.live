<script lang="ts">
	import Audio, { pause } from "$lib/Audio.svelte";
	import Modal from "$lib/Modal.svelte";
	import type { BuiltRelease } from "$types/discography/BuiltRelease";
	import { sineOut } from "svelte/easing";
	import { tweened } from "svelte/motion";

	export let release: BuiltRelease;
export let intl: Intl.DateTimeFormat;

const cover = `/releases/${release.slug}/cover.avif`;

let active = false;
let button: HTMLButtonElement;
let innerWidth: number;

const tweeningOptions = {
	"duration": 333,
	"easing": sineOut
};

const brightness = tweened(1, tweeningOptions);
const rotateX = tweened(0, tweeningOptions);
const rotateY = tweened(0, tweeningOptions);

$: if (!active) {
	pause();
}

// https://codepen.io/nelsonr/pen/WNQaZPb
function mapRelativity(value: number, relativeTo: number, minimum: number, maximum: number) {
	return minimum + (value * (maximum - minimum)) / relativeTo;
}

function moveCard(x: number, y: number) {
	if (innerWidth <= 825) {
		return;
	}

	const relativeY = mapRelativity(y, button.clientHeight, 25, -25);
	const relativeX = mapRelativity(x, button.clientWidth, -25, 25);

	brightness.set(mapRelativity((-relativeX + relativeY) / 2 + 25, 50, 0.66, 1.5));
	rotateX.set(relativeY);
	rotateY.set(relativeX);
}
</script>

<svelte:window bind:innerWidth/>

<button
	style:background-image="url({cover})"
	style:--color={release.color}
	style:--brightness={$brightness}
	style:--rotateX="{$rotateX}deg"
	style:--rotateY="{$rotateY}deg"
	style:--offsetX="{$rotateY / -2}px"
	style:--offsetY="{$rotateX / 2}px"
	aria-label={release.label}
	bind:this={button}
	on:pointermove={(event) => {
		moveCard(event.offsetX, event.offsetY);
	}}
	on:mouseenter={() => {
		button.focus();
	}}
	on:mouseleave={() => {
		button.blur();

		brightness.set(1);
		rotateX.set(0);
		rotateY.set(0);
	}}
	on:click={() => {
		active = true;
	}}
/>

<Modal
	bind:active
	color={release.color}
>
	<img
		src={cover}
		alt="Blurred cover art for {release.label}"
	/>

	<h1>
		<a href="/{release.slug}">{release.label}</a>
	</h1>
	<h3>{intl.format(release.released)}</h3>
	{#if release.description}
		{#each release.description as line}
			<p>{line}</p>
		{/each}
	{/if}

	{#if release.type === "album"}
		{#each release.tracks as track}
			<h2>{track.label}</h2>
			{#if track.description}
				{#each track.description as line}
					<p>{line}</p>
				{/each}
			{/if}

			<Audio
				color={release.color}
				links={track.links}
				src="/releases/{release.slug}/{track.slug}"
			/>
			{#each track.why as line}
				<p>{line}</p>
			{/each}
		{/each}

		<h2>...and more!</h2>
		<p>This is a cherry-picked selection of tracks. Listen to more <a href={release.links.bandcamp}>on Bandcamp!</a></p>
	{:else}
		<Audio
			color={release.color}
			links={release.links}
			src="/releases/{release.slug}/{release.slug}"
		/>
	{/if}
</Modal>

<style>
	button {
		aspect-ratio: 1/1;
		background-size: contain;
		border: none;
		border-radius: 1rem;

		outline: 0.33rem solid var(--outline-color, transparent);

		transition-property: transform, scale, filter, outline;
		transition-duration: 1s;
		transition-timing-function: var(--transition-snappy);

		cursor: pointer;
	}

	button:hover, button:focus-visible {
		scale: 125%;
		z-index: 10;
		--outline-color: var(--color);
		--box-shadow-size: 0.25rem;
		--box-shadow-color: color-mix(in srgb, var(--outline-color), black 33%);
		--shadow-size: 4rem
	}

	@media (width > 800px) {
		button {
			transform: rotateX(var(--rotateX)) rotateY(var(--rotateY));
			box-shadow: var(--offsetX) var(--offsetY) 0 var(--box-shadow-size, 0) var(--box-shadow-color, transparent);
			filter: drop-shadow(0 0 var(--shadow-size, 0) var(--outline-color)) brightness(var(--brightness));
		}
	}

	img {
		width: 100%;
		height: 16rem;
		object-fit: cover;
		filter: blur(1rem);
		transform: scale(125%);
	}

	h1, h2, h3 {
		margin: 0;
	}

	h1 a {
		position: relative;
		font-size: 4cqmax;
		color: var(--color-primary);

		--shadow-color: var(--color-primary);
		text-shadow: 0 0 2rem var(--color-background),
			0 0 4rem var(--shadow-color);
	}

	h1 a {
		font-weight: inherit;
		text-decoration-thickness: 0.5cqmax;
	}

	h1 a:hover {
		scale: unset;
		color: var(--color);
		--shadow-color: var(--color);
	}

	h2 {
		font-size: 2.5cqmax;
		color: var(--color);
	}

	h2 + p {
		margin-top: 0.25rem;
	}

	h3 {
		font-size: 1.75cqmax;
		color: var(--color-secondary);
	}

	p {
		font-size: 1cqmax;
		color: var(--color-text);
	}

	@media (width <= 1390px) {
		h1 a {
			font-size: 6cqmin;
		}

		h2 {
			font-size: 4cqmin;
		}

		h3 {
			font-size: 3cqmin;
		}

		p {
			font-size: 2cqmin;
		}
	}

	@media (width <= 800px) {
		button:hover, button:focus-visible {
			scale: 105%
		}

		h1 a {
			font-size: 12cqmin;
			line-height: 100%;
			padding-bottom: 3cqmin;
		}

		h2 {
			font-size: 7cqmin;
		}

		h3 {
			font-size: 4.5cqmin;
		}

		p {
			font-size: 4cqmin;
		}

		img {
			height: 8rem;
		}
	}
</style>