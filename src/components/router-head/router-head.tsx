import { useDocumentHead, useLocation } from "@builder.io/qwik-city";
import { component$ } from "@builder.io/qwik";

export const RouterHead = component$(() => {
    const head = useDocumentHead();
    const location = useLocation();

    return (
        <>
            <title>{head.title}</title>
            <link rel="canonical" href={location.url.href}/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
            {head.meta.map(meta => (
                <meta key={meta.key} {...meta}/>
            ))}
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
