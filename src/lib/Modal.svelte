<script lang="ts">
	import { IconX } from "@tabler/icons-svelte";
	import { fly } from "svelte/transition";

	export let active = false;
export let color = "var(--color-primary)";

let dialogElement: HTMLDialogElement;

$: if (dialogElement && active) {
	dialogElement.showModal();
	dialogElement.focus();
}
</script>

<dialog
	style:--color={color}
	transition:fly={{ y: 200, duration: 2000 }}
	bind:this={dialogElement}
	on:close={() => {
		active = false;
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
	<main on:click|stopPropagation>
		<slot/>
	</main>
</dialog>

<style>
	dialog {
		width: 50%;
		border-radius: 2rem;
		border: none;
		padding: 1rem;
		background: var(--color-background);
		overflow-x: hidden;
	}

	dialog[open] {
		animation: fly 0.5s var(--transition-snappy);
	}

	dialog::backdrop {
		background: var(--color);
		opacity: 0.5;
		overscroll-behavior: contain;
	}

	dialog:focus {
		outline: none;
	}

	button {
		position: absolute;
		z-index: 10;
		display: flex;
		align-items: center;
		right: 1rem;
		aspect-ratio: 1/1;
		border: none;
		border-radius: 50%;
		background: var(--color-background);
		color: var(--color-text);
		transition-property: transform, background, color;
		transition-duration: 1s;
		transition-timing-function: var(--transition-snappy);
		cursor: pointer;
	}

	button:hover, button:focus-visible {
		transform: scale(125%);
		background: var(--color-primary);
		color: var(--color-background);
		outline: none;
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

	@media (width <= 1390px) {
		dialog {
			width: 65%;
		}
	}

	@media (width <= 800px) {
		dialog {
			min-width: calc(100% - 2rem);
			min-height: calc(100% - 2rem);
			border-radius: 0;
			margin: 0;
			height: 100%;
		}

		button {
			position: fixed;
		}
	}
</style>
