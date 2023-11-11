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
