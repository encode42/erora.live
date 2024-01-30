<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { fly } from "svelte/transition";
	import { IconX } from "@tabler/icons-svelte";

    export let show: boolean;

	const dispatch = createEventDispatcher<{
		"close": null
	}>();

    let dialogElement: HTMLDialogElement;

    $: if (dialogElement && show) {
		dialogElement.showModal();
		dialogElement.focus();
	}
	$: if (!show) dispatch("close");
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
	transition:fly={{ y: 200, duration: 2000 }}
	bind:this={dialogElement}
	on:close={() => {
		show = false;
	}}
	on:click|self={() => {
		dialogElement.close();
	}}
>
	<button on:click={() => {
		dialogElement.close();
	}}>
		<IconX/>
	</button>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<main on:click|stopPropagation>
		<slot/>
	</main>
</dialog>

<style>
	button {
		aspect-ratio: 1/1;
		position: absolute;
		z-index: 5;
		top: 1rem;
		right: 1rem;
		background: none;
		border: none;
		color: var(--color-text);
		background: var(--color-background);
		opacity: 0.75;
		border-radius: 2rem;
		transition-property: transform, background, color;
		transition-duration: 0.25s;
		transition-timing-function: var(--transition-snappy);
		cursor: pointer;
	}

	button:hover, button:focus {
		color: var(--color-background);
		background: var(--color-primary);
		transform: scale(125%);
	}

	button :global(svg) {
		width: 3cqb;
		height: 3cqb;
	}

	dialog {
		max-width: 65%;
		border-radius: 2rem;
		border: none;
		padding: 0;
		background: var(--color-background);
	}

	dialog[open] {
		animation: fly 0.5s var(--transition-snappy);
	}

	dialog::backdrop {
		background: var(--color-primary);
		opacity: 0.5;
	}

	@keyframes fly {
		from {
			opacity: 0;
			transform: translateY(100%);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 1390px) {
		dialog {
			max-width: 85%;
		}
	}

	@media (max-width: 860px) {
		dialog {
			max-width: 100%;
			border-radius: 0;
			margin: 0;
			max-height: 100%;
		}

		dialog::backdrop {
			background: var(--color-background);
			opacity: 1;
		}
	}
</style>