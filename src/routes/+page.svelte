<script lang="ts">
	import { IconBrandDiscord, IconMail } from "@tabler/icons-svelte";
    import Button from "./Button.svelte";
    import DiscographyEntry from "./DiscographyEntry.svelte";

    export let data;

    const logoFlipRotation = 342;

    let logoInteractions = 0;
    let logoRotation = 0;
    $: logoFlipping = logoRotation === logoFlipRotation;

    function bounceLogo() {
        const random = Math.random();
        const willFlip = logoInteractions > 3 && Math.round(random * 10) / 10 === 0.5;

        logoRotation = willFlip ? logoFlipRotation : random * 20 - 10;
        logoInteractions++;
    }

    // TODO:
    // - Lint
    // - Boilerplate files
    // - Spotify fallback
</script>

<main>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <svg
        tabindex="0"
        viewBox="0 0 800 189"
        width="100%"
        class="logo"
        style:--logo-rotation="{logoRotation}deg"
        style:--logo-rotation-speed="{logoFlipping ? 1.5 : 0.5}s"
        on:focus={() => {
            bounceLogo();
        }}
        on:mousedown={(event) => {
            event.stopImmediatePropagation();
            event.preventDefault();
        }}
        on:mouseenter={() => {
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

    <div class="about">
        <p>issues arise, bugs form. error is inevitable.</p>
        <p>Ambient-electronic works aiming to imitate the likes of progressive rock and influential indie video game soundtracks while implementing personal styles.</p>
    </div>

    <div class="discography">
        {#each data.discography as entry}
            <DiscographyEntry {entry}/>
        {/each}
    </div>

    <div class="links">
        <Button href="https://erora.live/discord" color="var(--ctp-macchiato-blue)">
            <IconBrandDiscord/>
            discord
        </Button>
        <Button href="mailto:me@erora.live" color="var(--ctp-macchiato-rosewater)">
            <IconMail/>
            e-mail
        </Button>
    </div>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 42%;
        gap: 2rem;
        padding-top: 1rem;
    }

    .logo {
        --color-current: var(--color-text);
        z-index: 10;
        color: var(--color-current);
        filter: drop-shadow(0 0 1.25rem var(--color-current));
        transition-property: color, filter, transform;
        transition-duration: var(--logo-rotation-speed);
        transition-timing-function: cubic-bezier(0.15, 0.5, 0, 2);
        animation: flicker 7s infinite;
    }

    .logo:hover, .logo:focus-visible {
        --color-current: var(--color-primary);
        filter: drop-shadow(0 0 2rem var(--color-current)) !important;
        transform: scale(125%) rotate(var(--logo-rotation));
    }

    .logo:focus {
        outline: none;
    }

    .about {
        display: flex;
        flex-direction: column;
        gap: 1rem
    }

    .about p {
        margin: 0;
        text-align: center;
        color: var(--color-subtle);
    }

    .about p:first-of-type {
        font-family: var(--font-stylized);
        font-weight: 800;
        color: var(--color-text);
    }

    .discography {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1rem;
        width: 100%
    }

    .links {
        width: 100%;
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .links :global(*) {
        flex-grow: 1;
    }

    @keyframes flicker {
        0% {
            filter: drop-shadow(0 0 1.25rem var(--color-current));
        }
        50% {
            filter: drop-shadow(0 0 0.75rem var(--color-current)) brightness(92%);
        }
        100% {
            filter: drop-shadow(0 0 1.25rem var(--color-current));
        }
    }

    @media (max-width: 1390px) {
        main {
            max-width: 65%;
        }

		.discography {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
	}

	@media (max-width: 860px) {
        main {
            max-width: 95%;
        }
	}

    @media (max-width: 750px) {
		.discography {
            grid-template-columns: repeat(1, minmax(0, 1fr));
        }
    }
</style>