<script lang="ts" context="module">
    let currentTarget: HTMLButtonElement | undefined;
</script>

<script lang="ts">
    import type { DiscographyEntry } from "$lib/types/discography/entries";
    import { tweened } from "svelte/motion";
	import { sineOut } from "svelte/easing";
    import Modal from "./Modal.svelte";
    import Preview, { stopAll } from "./Preview.svelte";
	import Destinations from "./Destinations.svelte";

    export let entry: DiscographyEntry;
    export let intl: Intl.DateTimeFormat;

    const tweeningOptions = {
        "duration": 500,
        "easing": sineOut
    };

    let wrapper: HTMLDivElement;
    let button: HTMLButtonElement;

    let focused: boolean = false;
    let modalShown: boolean = false;
    let mouseOver: boolean = false;

    let brightnessWrapper = tweened(1, tweeningOptions);
    let rotateWrapperX = tweened(0, tweeningOptions);
    let rotateWrapperY = tweened(0, tweeningOptions);
    let translateButtonX = tweened(0, tweeningOptions);
    let translateButtonY = tweened(0, tweeningOptions);

    function resetTransformations() {
        brightnessWrapper.set(1);

        for (const tweener of [
            rotateWrapperX,
            rotateWrapperY,
            translateButtonX,
            translateButtonY
        ]) {
            tweener.set(0);
        }
    }

    // adapted from https://codepen.io/nelsonr/pen/WNQaZPb
    function mapRelativity(value: number, relativeTo: number, minimum: number, maximum: number) {
        return minimum + (value * (maximum - minimum)) / relativeTo;
    }

    function moveCard(key: string, wrapper: HTMLDivElement, width: number, height: number, x: number, y: number) {
        brightnessWrapper.set(mapRelativity(y, height, 1.25, 0.75));

        let rotateY = mapRelativity(x, width, -25, 25);
        let rotateX = mapRelativity(y, height, 25, -25);

        rotateWrapperX.set(rotateX);
        rotateWrapperY.set(rotateY);
        translateButtonX.set(rotateY);
        translateButtonY.set(-rotateX);
    }
</script>

<div
    class="discography-entry-wrapper"
    class:focused
>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="discography-entry"
        class:focused
        class:depth={mouseOver}
        style:background-image="url({entry.art})"
        style:--brightness="{$brightnessWrapper}"
        style:--x="{$rotateWrapperX}deg"
        style:--y="{$rotateWrapperY}deg"
        style:--dx="{$translateButtonX}px"
        style:--dy="{$translateButtonY}px"
        bind:this={wrapper}
        on:pointermove={(event) => {
            if (!event.currentTarget) {
                return;
            }

            moveCard(entry.title, event.currentTarget, event.currentTarget.clientWidth, event.currentTarget.clientHeight, event.offsetX, event.offsetY);
        }}
        on:mouseenter={() => {
            mouseOver = true;
            currentTarget?.blur();
        }}
        on:mouseleave={() => {
            mouseOver = false;
            resetTransformations();
        }}
    >
        <button
            class="discography-entry-button"
            style:--x="{$translateButtonX}px"
            style:--y="{$translateButtonY}px"
            bind:this={button}
            on:focus={() => {
                currentTarget = button;
                focused = true;
            }}
            on:blur={(event) => {
                focused = false;
            }}
            on:click={() => {
                button.blur();
                currentTarget = undefined;
                modalShown = true;
            }}
        >
            {entry.title}
        </button>
    </div>
</div>

<Modal bind:show={modalShown} on:close={stopAll}>
    <div class="banner">
        <img src={entry.art} alt="Cover art for {entry.title}, enlarged and blurred."/>
    </div>
    <div class="content">
        <div class="header">
            <h1>{entry.title}</h1>
            <h4>{intl.format(new Date(entry.published))}</h4>
            <p>{entry.description}</p>
            <Destinations urls={entry.url}/>
        </div>
        {#if entry.type === "album"}
            <div class="featured">
                {#each entry.featuredTracks as track}
                    <section>
                        <h3>{track.title}</h3>
                        <p>{track.description.bandcamp}</p>
                        <Preview src={track.url.stream} startAt={track.startAt} endAt={track.endAt} urls={track.url}/>
                        <p>{track.description.why}</p>
                    </section>
                {/each}
                <section>
                    <h3>and more...</h3>
                    <p>These are only some hand-picked featured tracks. You can listen to more on the <a href={entry.url.bandcamp}>Bandcamp page</a>!</p>
                </section>
            </div>
        {:else}
            <Preview src={entry.url.stream} startAt={entry.startAt} endAt={entry.endAt}/>
        {/if}
    </div>
</Modal>

<style>
    h1 {
        z-index: 5;
        font-size: 4cqmax;
        color: var(--color-primary);
        filter: drop-shadow(0 0.25rem 1.25rem var(--color-primary));
        margin-top: -3.3%;
    }

    h3 {
        font-size: 2.5cqmax;
        color: var(--color-secondary);
    }

    h4 {
        font-size: 1.5cqmax;
        color: var(--color-muted);
    }

    .discography-entry-wrapper {
        transition-property: transform, filter;
        transition-duration: 1s;
        transition-timing-function: var(--transition-snappy);
    }

    .discography-entry-wrapper:hover, .discography-entry-wrapper.focused {
        z-index: 5;
        transform: scale(115%);
        filter: drop-shadow(0 0 4rem var(--color-primary));
    }

    .discography-entry {
        aspect-ratio: 1;
        border-radius: 1rem;
        background-size: cover;
        outline: 0.25rem solid transparent;
        transition: outline 1s var(--transition-snappy);
        transform: rotateX(var(--x)) rotateY(var(--y));
        filter: brightness(var(--brightness));
    }

    .discography-entry.depth {
        box-shadow:
            calc(var(--dx) / -3) calc(var(--dy) / -3) 0px 0.25rem #8d79a5,
            calc(var(--dx) / -2) calc(var(--dy) / -2) 0px 0.25rem #8d79a5
    }

    .discography-entry:hover, .discography-entry.focused {
        outline: 0.25rem solid var(--color-primary);
    }

    .discography-entry-button {
        -webkit-text-stroke: 1px #000;
        width: 100%;
        height: 100%;
        border: none;
        background: none;
        color: var(--color-primary);
        font-family: var(--font-stylized);
        font-weight: 800;
        font-size: 2cqmax;
        text-shadow:
            calc(var(--x) / -8) calc(var(--y) / -12) 0px #8d79a5, /* hard-coded */
            calc(var(--x) / -6) calc(var(--y) / -6) 0px #8d79a5, /* hard-coded */
            calc(var(--x) / -4.5) calc(var(--y) / -4.5) 0 var(--color-background),
            calc(var(--x) * -1.5) calc(var(--y) * -1.5 + 1rem) max(0.75rem, calc(1rem + var(--y))) var(--color-background);
        cursor: pointer;
        transform: translateX(var(--x)) translateY(var(--y));
    }

    .discography-entry-button:focus {
        outline: none;
    }

    .banner {
        overflow-x: clip;
    }

    .banner img {
        width: 100%;
        height: 250px;
        object-fit: cover;
        filter: blur(15px);
        transform: scale(115%);
    }

    .content {
        padding: 1.5rem;
    }

    .header {
        padding-bottom: 1rem;
    }

    .featured {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-top: 1rem;
    }

    @media (max-width: 1390px) {
		.discography-entry-button {
            font-size: 4cqmin;
        }
    }

    @media (max-width: 750px) {
		.discography-entry-button {
            font-size: 8cqmin;
        }
    }
</style>
