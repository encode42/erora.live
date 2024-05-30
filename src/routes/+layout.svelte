<script lang="ts">
import { page } from "$app/stores";

import "@catppuccin/palette/css/catppuccin.css";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/inter";
import "./global.css";
</script>

<svelte:head>
	<meta name="twitter:card" content="summary"/>
	<meta property="og:type" content="website"/>
	{#if !$page.data?.release}
		<meta itemprop="image" property="og:image" content="https://erora.live/badge.png"/>
	{/if}
</svelte:head>

<main>
	<slot/>
</main>

<style>
	:global(body) {
		display: flex;
		margin: 0;
		justify-content: center;
	}

	main {
		width: 50%;
	}

	@media (width <= 1390px) {
		main {
			width: 65%;
		}
	}

	@media (width <= 800px) {
		main {
			width: 90%;
		}
	}
</style>
