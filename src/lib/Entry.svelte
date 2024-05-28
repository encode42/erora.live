<script lang="ts">
import type { BuiltRelease } from "$types/discography/BuiltRelease";
import { sineOut } from "svelte/easing";
import { tweened } from "svelte/motion";

export let release: BuiltRelease;

let anchor: HTMLAnchorElement;
let innerWidth: number;

const tweeningOptions = {
	"duration": 333,
	"easing": sineOut
};

const brightness = tweened(1, tweeningOptions);
const rotateX = tweened(0, tweeningOptions);
const rotateY = tweened(0, tweeningOptions);

// TODO: float around a bit

// https://codepen.io/nelsonr/pen/WNQaZPb
function mapRelativity(value: number, relativeTo: number, minimum: number, maximum: number) {
	return minimum + (value * (maximum - minimum)) / relativeTo;
}

function moveCard(x: number, y: number) {
	if (innerWidth <= 825) {
		return;
	}

	const relativeY = mapRelativity(y, anchor.clientHeight, 25, -25);
	const relativeX = mapRelativity(x, anchor.clientWidth, -25, 25);

	brightness.set(mapRelativity((-relativeX + relativeY) / 2 + 25, 50, 0.66, 1.5));
	rotateX.set(relativeY);
	rotateY.set(relativeX);
}
</script>

<svelte:window bind:innerWidth/>

<a
	style:background-image="url(/releases/{release.slug}/cover.avif)"
	style:--color={release.color}
	style:--brightness={$brightness}
	style:--rotateX="{$rotateX}deg"
	style:--rotateY="{$rotateY}deg"
	style:--offsetX="{$rotateY / -2}px"
	style:--offsetY="{$rotateX / 2}px"
	aria-label={release.label}
	href="/{release.slug}"
	bind:this={anchor}
	on:pointermove={(event) => {
		moveCard(event.offsetX, event.offsetY);
	}}
	on:mouseenter={() => {
		anchor.focus();
	}}
	on:mouseleave={() => {
		anchor.blur();

		brightness.set(1);
		rotateX.set(0);
		rotateY.set(0);
	}}
/>

<style>
	a {
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

	a:hover, a:focus-visible {
		scale: 150%;
		z-index: 10;
		--outline-color: var(--color);
		--box-shadow-size: 0.25rem;
		--box-shadow-color: color-mix(in srgb, var(--outline-color), black 33%);
		--shadow-size: 4rem
	}

	@media (width <= 1390px) {
		a:hover, a:focus-visible {
			scale: 125%;
		}
	}

	@media (width > 800px) {
		a {
			transform: rotateX(var(--rotateX)) rotateY(var(--rotateY));
			box-shadow: var(--offsetX) var(--offsetY) 0 var(--box-shadow-size, 0) var(--box-shadow-color, transparent);
			filter: drop-shadow(0 0 var(--shadow-size, 0) var(--outline-color)) brightness(var(--brightness));
		}
	}

	@media (width <= 800px) {
		a:hover, a:focus-visible {
			scale: 105%
		}
	}
</style>
