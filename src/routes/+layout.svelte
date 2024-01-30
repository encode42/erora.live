<script>
    import "@catppuccin/palette/css/catppuccin.css";
    import "@fontsource-variable/jetbrains-mono";
</script>

<svelte:head>
    <title>erora</title>
    <meta property="og:title" content="erora">
    <meta property="og:description" content="Issues arise, bugs form. Error is inevitable.">
    <meta name="msapplication-TileColor" content="#603cba"/>
    <meta name="theme-color" content="#cad3f5"/>
    <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg"/>
    <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png"/>
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"/>
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"/>
    <link rel="manifest" href="/favicon/site.webmanifest"/>
    <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#24273a"/>
    <meta property="og:image" content="https://erora.live/badge.png"/>
</svelte:head>

<div class="layout">
    <div>
        <slot/>
    </div>
    
    <footer>
        powered by <a href="https://bandcamp.com">Bandcamp</a> and <a href="https://song.link">song.link</a> | <a href="https://github.com/encode42/erora.live">source code</a>
    </footer>
</div>

<style>
    .layout {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    .layout div {
        display: flex;
        flex-grow: 1;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }

    footer {
        align-self: center;
        padding-bottom: 0.5rem;
        text-align: center;
        color: var(--color-muted);
    }

    footer a {
        color: var(--color-muted);
    }

    footer, footer a {
        font-family: var(--font-stylized);
        font-weight: 100;
    }
</style>