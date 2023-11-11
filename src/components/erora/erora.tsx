import type { IntrinsicElements } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import styles from "./erora.module.css";


export const Erora = component$<IntrinsicElements["svg"]>(({ width, height, ...other }) => {
    return (
        <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 189" width={width ?? "100%"} height={height ?? "100%"} {...other}>
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
            <path class={styles.circle} clip-path="url(#e)" d="m94.4 170.9c-42.2 0-76.4-34.2-76.4-76.5 0-42.2 34.2-76.4 76.4-76.4 42.3 0 76.4 34.2 76.4 76.4 0 42.3-34.1 76.5-76.4 76.5z"/>
            <path class={styles.line} d="m189.2 73v36.7h-166.6v-36.7c45.9 0 166.6 0 166.6 0z"/>
            <path class={styles.circle} clip-path="url(#r)" d="m247.2 170.9c-42.2 0-76.4-34.2-76.4-76.5 0-42.2 34.2-76.4 76.4-76.4 42.3 0 76.4 34.2 76.4 76.4 0 42.3-34.1 76.5-76.4 76.5z"/>
            <path class={styles.circle} d="m400.1 170.9c-42.3 0-76.5-34.2-76.5-76.5 0-42.2 34.2-76.4 76.5-76.4 42.2 0 76.4 34.2 76.4 76.4 0 42.3-34.2 76.5-76.4 76.5z"/>
            <path class={styles.circle} clip-path="url(#a)" d="m552.9 170.9c-42.3 0-76.4-34.2-76.4-76.5 0-42.2 34.1-76.4 76.4-76.4 42.2 0 76.4 34.2 76.4 76.4 0 42.3-34.2 76.5-76.4 76.5z"/>
            <path class={styles.circle} d="m705.7 170.9c-42.3 0-76.4-34.2-76.4-76.5 0-42.2 34.1-76.4 76.4-76.4 42.2 0 76.4 34.2 76.4 76.4 0 42.3-34.2 76.5-76.4 76.5z"/>
            <path class={styles.line} d="m763.7 94.4h36.7v96.4h-36.7z"/>
        </svg>
    );
});
