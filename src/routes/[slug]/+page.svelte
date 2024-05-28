<script lang="ts">
import Audio from "$lib/Audio.svelte";
import BackHome from "$lib/BackHome.svelte";

export let data;

const intl = new Intl.DateTimeFormat("default", {
	"dateStyle": "long"
});

const cover = `/releases/${data.release.slug}/cover`;
</script>

<svelte:head>
	<title>{data.release.label}</title>
	<meta property="og:title" content={data.release.label}/>
	<meta name="description" content={data.description}/>
	<meta property="og:description" content={data.description}/>
	<meta property="og:image" content="https://erora.live/releases/{data.release.slug}/cover.jpg"/>
	<meta name="theme-color" content={data.release.color}/>
</svelte:head>

<a
	class="banner"
	href="{cover}.jpg"
	target="_blank"
>
	<img
		src="{cover}.avif"
		alt="Cover art for {data.release.label}"
	/>
</a>


<h1>{data.release.label}</h1>
<h3>Released on {intl.format(data.release.released)}</h3>
{#if data.release.description}
	{#each data.release.description as line}
		<p>{line}</p>
	{/each}
{/if}

{#if data.release.type === "album"}
	{#each data.release.tracks as track}
		<h2 style:--color={data.release.color}>{track.label}</h2>
		{#if track.description}
			{#each track.description as line}
				<p>{line}</p>
			{/each}
		{/if}

		<Audio
			color={data.release.color}
			links={track.links}
			src="/releases/{data.release.slug}/{track.slug}"
		/>
		{#each track.why as line}
			<p>{line}</p>
		{/each}
	{/each}

	<h2 style:--color={data.release.color}>...and more!</h2>
	<p>This is a cherry-picked selection of tracks. Listen to more <a href={data.release.links.bandcamp}>on Bandcamp!</a></p>
{:else}
	<Audio
		color={data.release.color}
		links={data.release.links}
		src="/releases/{data.release.slug}/{data.release.slug}"
	/>
{/if}

<BackHome/>

<style>
	.banner {
		width: 100%;
	}

	.banner img {
		border-radius: 1rem;
		width: 100%;
		height: 24rem;
		object-fit: cover;
		transition-property: height;
		transition-timing-function: var(--transition-snappy);
		transition-duration: 1s;
	}

	h1 {
		position: relative;
	}

	h2 {
		color: var(--color);
	}

	h3 {
		margin-top: -0.5rem;
		color: var(--color-secondary);
	}

	@media (width <= 800px) {
		.banner img {
			height: unset;
		}

		img {
			height: 8rem;
		}
	}
</style>
