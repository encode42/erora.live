import type { DocumentHead } from "@builder.io/qwik-city";
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from "@builder.io/qwik-city";
import { component$ } from "@builder.io/qwik";
import { RouterHead } from "~/components/router-head/router-head";

import "modern-normalize";
import "./global.css";

export default component$(() => {
    return (
        <QwikCityProvider>
            <head>
                <meta charSet="utf-8"/>
                <link rel="manifest" href="/manifest.json"/>
                <RouterHead/>
                <ServiceWorkerRegister/>
            </head>
            <body>
                <RouterOutlet/>
            </body>
        </QwikCityProvider>
    );
});

export const head: DocumentHead = {
    "title": "erora",
    "meta": [{
        "name": "description",
        "content": "Issues arise, bugs form. Error is inevitable."
    }]
};
