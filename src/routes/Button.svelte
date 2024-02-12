<script lang="ts">
    export let href: string;
    export let slim: boolean = false;
    export let color: string = "var(--color-primary)";
</script>

<a
    class:slim
    style:--color={color}
    target="_blank"
    role="button"
    href={href}
>
    <slot/>
</a>

<style>
    a {
        --current-color: var(--color, var(--color-primary));
        border: 1px solid var(--current-color);
        padding: 1rem;
        font-family: var(--font-stylized);
        color: var(--current-color);
        text-decoration: none;
        text-align: right;
        font-size: 1.5cqmax;
        font-weight: 800;
        box-shadow: inset 0 0 2rem var(--current-color);
    }

    a:hover, a:focus {
        outline-color: transparent;
        background: var(--current-color);
        color: var(--color-background);
    }

    a :global(svg) {
        float: left;
        width: 2cqmax;
        height: 2cqmax;
        padding-right: 1rem;
    }

    .slim {
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
        font-size: 1.25cqmax;
        box-shadow: none;
    }

    .slim :global(svg) {
        width: 1.7cqmax;
        height: 1.7cqmax;
    }
</style>
