<script lang="ts">
	import Button from "$lib/Button.svelte";
	import releasesData from "$lib/releases.json";
	import type { BuiltRelease } from "$types/discography/BuiltRelease";
	import { IconBrandDiscord, IconMail } from "@tabler/icons-svelte";
	import Entry from "./Entry.svelte";

	const releases = releasesData as BuiltRelease[];
const intl = new Intl.DateTimeFormat("default", {
	"dateStyle": "long"
});

let logoRotation = 0;
function bounceLogo() {
	logoRotation = Math.random() * 20 - 10;
}
</script>

<svelte:head>
	<title>erora</title>
	<meta property="og:title" content="erora"/>
	<meta name="description" content="issues arise, bugs form. error is inevitable."/>
	<meta property="og:description" content="issues arise, bugs form. error is inevitable."/>
</svelte:head>

<svg
	tabindex="0"
	viewBox="0 0 800 189"
	role="button"
	style:--logo-rotation="{logoRotation}deg"
	on:mousedown|stopPropagation|preventDefault
	on:mouseenter={() => {
		bounceLogo();
	}}
	on:focus={() => {
		bounceLogo();
	}}
>
	<defs>
		<clipPath clipPathUnits="userSpaceOnUse" id="e">
			<path d="m-3.37-37.04h97.8v255.33h-97.8zm36.67 0h212.41v129.96h-212.41z"/>
		</clipPath>
		<clipPath clipPathUnits="userSpaceOnUse" id="r">
			<path d="m149.44-37.04h97.8v255.33h-97.8zm36.68 0h212.4v129.96h-212.4z"/>
		</clipPath>
		<clipPath clipPathUnits="userSpaceOnUse" id="a">
			<path d="m455.06-37.04h97.8v255.33h-97.8zm36.68 0h212.41v129.96h-212.41z"/>
		</clipPath>
	</defs>
	<style>
		.circle {
			fill: none;
			stroke: currentColor;
			stroke-miterlimit: 100;
			stroke-width: 36.7
		}
		.line {
			fill: currentColor
		}
	</style>
	<path class="circle" clip-path="url(#e)" d="m94.4 170.9c-42.2 0-76.4-34.2-76.4-76.5 0-42.2 34.2-76.4 76.4-76.4 42.3 0 76.4 34.2 76.4 76.4 0 42.3-34.1 76.5-76.4 76.5z"/>
	<path class="line" d="m189.2 73v36.7h-166.6v-36.7c45.9 0 166.6 0 166.6 0z"/>
	<path class="circle" clip-path="url(#r)" d="m247.2 170.9c-42.2 0-76.4-34.2-76.4-76.5 0-42.2 34.2-76.4 76.4-76.4 42.3 0 76.4 34.2 76.4 76.4 0 42.3-34.1 76.5-76.4 76.5z"/>
	<path class="circle" d="m400.1 170.9c-42.3 0-76.5-34.2-76.5-76.5 0-42.2 34.2-76.4 76.5-76.4 42.2 0 76.4 34.2 76.4 76.4 0 42.3-34.2 76.5-76.4 76.5z"/>
	<path class="circle" clip-path="url(#a)" d="m552.9 170.9c-42.3 0-76.4-34.2-76.4-76.5 0-42.2 34.1-76.4 76.4-76.4 42.2 0 76.4 34.2 76.4 76.4 0 42.3-34.2 76.5-76.4 76.5z"/>
	<path class="circle" d="m705.7 170.9c-42.3 0-76.4-34.2-76.4-76.5 0-42.2 34.1-76.4 76.4-76.4 42.2 0 76.4 34.2 76.4 76.4 0 42.3-34.2 76.5-76.4 76.5z"/>
	<path class="line" d="m763.7 94.4h36.7v96.4h-36.7z"/>
</svg>

<p class="tagline">issues arise, bugs form. error is inevitable.</p>
<p>Ambient-electronic works aiming to imitate the likes of progressive rock and influential indie video game soundtracks while implementing personal styles.</p>

<section class="entries">
	{#each releases as release}
		<Entry
			{release}
			{intl}
		/>
	{/each}
</section>

<div class="buttons">
	<Button
			href="https://erora.live/discord"
			color="var(--ctp-macchiato-blue)"
	>
		<IconBrandDiscord/>
		discord
	</Button>
	<Button
			href="mailto:me@erora.live"
			color="var(--ctp-macchiato-rosewater)"
	>
		<IconMail/>
		e-mail
	</Button>
</div>

<style>
	svg {
		padding-top: 2.5rem;
		filter: drop-shadow(0 0 1.5rem var(--color-text));
		color: var(--color-text);
		transition-property: scale, rotate, transform, color, filter;
		transition-duration: 0.5s;
		transition-timing-function: cubic-bezier(0.15, 0.5, 0, 2);
	}

	p {
		font-size: 2cqmin;
		text-align: center;
	}

	.tagline {
		font-family: var(--font-header);
		font-weight: 800;
		color: var(--color-secondary);
	}

	.entries {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
		width: 100%;
		padding-top: 2.5rem;
		padding-bottom: 4rem;
	}

	.buttons {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
		padding-bottom: 1rem;
	}

	@media (width <= 1390px) {
		.entries {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (width > 800px) {
		svg:hover, svg:focus {
			scale: 125%;
			rotate: var(--logo-rotation);
			transform: translateY(1.5rem);
			filter: drop-shadow(0 0 3rem var(--color-primary));
			color: var(--color-primary);
		}
	}

	@media (width <= 800px) {
		svg {
			padding-top: 1rem;
		}

		p {
			font-size: 2.5cqmax;
		}

		.entries {
			padding-top: 1rem;
			padding-bottom: 2rem;
		}

		.entries {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>