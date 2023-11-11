import { component$ } from "@builder.io/qwik";
import { Button } from "~/components/button/button";
import { Erora } from "~/components/erora/erora";
import { TbBrandBandcamp, TbBrandGithub, TbBrandYoutube, TbMail } from "@qwikest/icons/tablericons";
import styles from "./index.module.css";

export default component$(() => {
    return (
        <main>
            <Erora class={styles.logo}/>
            <div class={styles.buttons}>
                <Button color="blue" href="https://erora.bandcamp.com">
                    <TbBrandBandcamp/>
                </Button>
                <Button color="red" href="https://youtube.com/encode42">
                    <TbBrandYoutube/>
                </Button>
                <Button color="rosewater" href="mailto:me@erora.live">
                    <TbMail/>
                </Button>
                <Button color="mauve" href="https://github.com/encode42/erora.live">
                    <TbBrandGithub/>
                </Button>
            </div>
        </main>
    );
});
