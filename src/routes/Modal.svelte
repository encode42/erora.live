<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { fly } from "svelte/transition";

    export let show: boolean;

	const dispatch = createEventDispatcher<{
		"close": null
	}>();

    let dialogElement: HTMLDialogElement;

    $: if (dialogElement && show) dialogElement.showModal();
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
		×
	</button>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<main on:click|stopPropagation>
		<slot/>
	</main>
</dialog>

<style>
	button {
		position: absolute;
		z-index: 5;
		top: 1rem;
		right: 1.25rem;
		background: none;
		border: none;
		color: var(--color-text);
		font-size: 2.5rem;
		opacity: 0.75;
		text-shadow: 0 0 1rem var(--color-text);
		transition: transform 0.25s var(--transition-snappy);
		cursor: pointer;
		mix-blend-mode: difference;
	}

	button:hover, button:focus {
		color: var(--color-secondary);
		transform: scale(110%);
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