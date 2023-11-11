import { useDocumentHead, useLocation } from "@builder.io/qwik-city";
import { component$ } from "@builder.io/qwik";
import pkg from "~/../package.json";

export const RouterHead = component$(() => {
    const head = useDocumentHead();
    const location = useLocation();

    const title = head.title || "erora";
    const description = head.meta.find(meta => meta.name === "description")?.content ?? pkg.description;

    return (
        <>
            <title>{title}</title>
            <meta property="og:title" content={title}/>
            <meta property="og:description" content={description}/>
            <meta name="theme-color" content="#cad3f5"/>
            <meta name="msapplication-TileColor" content="#603cba"/>
            <link rel="canonical" href={location.url.href}/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            {head.meta.map(meta => (
                <meta key={meta.key} {...meta}/>
            ))}
            <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg"/>
            <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"/>
            <link rel="manifest" href="/favicon/site.webmanifest"/>
            <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#24273a"/>
            <meta property="og:image" content="https://erora.live/badge.png"/>
            {head.links.map(link => (
                <link key={link.key} {...link}/>
            ))}
            {head.styles.map(style => (
                <style key={style.key} {...style.props} dangerouslySetInnerHTML={style.style}/>
            ))}
            {head.scripts.map(script => (
                <script key={script.key} {...script.props} dangerouslySetInnerHTML={script.script}/>
            ))}
        </>
    );
});
