import type { labels } from "@catppuccin/palette";
import { Slot, component$ } from "@builder.io/qwik";
import styles from "./button.module.css";

interface ButtonProps {
    "color": keyof typeof labels,
    "href": string
}

export const Button = component$<ButtonProps>(({ color, href }) => {
    return (
        <a href={href} class={[styles.button, styles[color]]}>
            <Slot/>
        </a>
    );
});
