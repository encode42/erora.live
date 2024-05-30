import type { FaviconsPluginOptions } from "@darkobits/vite-plugin-favicons/dist/etc/types";
import { sveltekit } from "@sveltejs/kit/vite";
import MagicString from "magic-string";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import { faviconsPlugin } from "@darkobits/vite-plugin-favicons";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { flavors } from "@catppuccin/palette";

const baseFavicons: FaviconsPluginOptions["icons"][keyof FaviconsPluginOptions["icons"]] = {
	"source": "./static/badge.svg"
}

export default defineConfig({
	"clearScreen": false,
	"plugins": [
		sveltekit(),
		tablerSvelteImportOptimizer(),
		faviconsPlugin({
			"background": flavors.macchiato.colors.base.hex,
			// biome-ignore lint/style/useNamingConvention: not my fault!
			"theme_color": flavors.macchiato.colors.mauve.hex,
			"display": "browser",
			"icons": {
				"favicons": baseFavicons,
				"android": baseFavicons,
				"appleIcon": baseFavicons,
				"windows": baseFavicons
			}
		}),
		ViteImageOptimizer({
			"avif": {
				"effort": 9,
				"chromaSubsampling": "4:2:0"
			},
			"png": {
				"effort": 10
			},
			"jpg": {
				"mozjpeg": true
			}
		})
	],
});

// https://github.com/tabler/tabler-icons/issues/669#issuecomment-1993756128
function tablerSvelteImportOptimizer(): Plugin {
	return {
		"name": "tabler-svelte optimizer",
		transform(code, id) {
			const string = new MagicString(code, { filename: id });
			string.replace(/([ \t]*)import\s+\{([^;]*?)}\s+from\s+"@tabler\/icons-svelte";/g, (_, whitespace: string, importNames: string) => {
				return importNames
					.split(",")
					.map((v) => v.trim())
					.map((name) => {
						return `${whitespace}import ${name} from "@tabler/icons-svelte/${name}.svelte";`;
					})
					.join("\n");
			});

			if (!string.hasChanged()) {
				return;
			}

			return {
				"code": string.toString(),
				"map": string.generateMap()
			};
		}
	};
}
