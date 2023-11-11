import type { Release } from "~/util/type/release";
import { component$ } from "@builder.io/qwik";
import styles from "./releases.module.css";

export interface ReleasesProps {
    "releases": Release[]
}

export const Releases = component$<ReleasesProps>(({ releases }) => {
    return (
        <div class={styles.releases}>
            {releases.map(release => (
                <iframe key={release.id} title={release.title} src={`https://bandcamp.com/EmbeddedPlayer/track=${release.id}/size=large/bgcol=1e2030/linkcol=c6a0f6/minimal=true/transparent=true/`}/>
            ))}
        </div>
    );
});
