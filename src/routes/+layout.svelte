<script lang="ts">
	import { flavors } from "@catppuccin/palette";

	import "@catppuccin/palette/css/catppuccin.css";
	import "@fontsource-variable/jetbrains-mono";
	import "@fontsource-variable/inter";
	import "./global.css";
</script>

<svelte:head>
	<meta name="application-name" content="erora.live"/>
	<meta name="twitter:card" content="summary"/>
	<meta property="og:type" content="website"/>
	<meta name="msapplication-TileColor" content="#603cba"/>
	<link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg"/>
	<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png"/>
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"/>
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"/>
	<link rel="manifest" href="/favicon/site.webmanifest"/>
	<link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color={flavors.macchiato.colors.base.hex}/>
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
