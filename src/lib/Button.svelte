<script lang="ts">
export let title: string | undefined = undefined;
export let color = "var(--color-primary)";
export let href: string;
export let target = "_blank";
export let slim = false;
export let empty = false;
</script>

<a
    class:slim
	class:empty
    style:--color={color}
    role="button"
	{title}
	{target}
    {href}
>
    <slot/>
</a>

<style>
    a {
        border: 1px solid var(--color);
        padding: 1rem;
        font-family: var(--font-header);
        font-size: 1.5cqmax;
        font-weight: 800;
        color: var(--color);
        text-decoration: none;
        text-align: right;
        box-shadow: inset 0 0 2rem var(--color);
    }

    a:hover, a:focus {
		z-index: 5;
        background: var(--color);
        color: var(--color-background);
		text-shadow: none;
		outline: none;
    }

    a :global(svg) {
        padding-right: 1rem;
        float: left;
        width: 2cqmax;
        height: 2cqmax;
    }

    .slim {
        padding: 0.5rem;
        font-size: 1.25cqmax;
        font-weight: 200;
        box-shadow: none;
    }

    .slim :global(svg) {
        width: 1.7cqmax;
        height: 1.7cqmax;
        stroke-width: 1px;
    }

	.empty {
		border-radius: 50%;
	}

	.empty :global(svg) {
		padding-right: 0;
	}

	@media (width <= 800px) {
		a {
			font-size: 4.5cqmin;
		}

		a :global(svg) {
			width: 6.25cqmin;
			height: 6.25cqmin;
		}

		.slim {
			padding: 2cqmin;
		}

		.slim :global(svg) {
			width: 6cqmin;
			height: 6cqmin;
		}
	}
</style>
