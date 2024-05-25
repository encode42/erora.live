import { sveltekit } from "@sveltejs/kit/vite";
import MagicString from "magic-string";
import type { Plugin } from "vite";
import { defineConfig } from "vite";

export default defineConfig({
	"plugins": [sveltekit(), tablerSvelteImportOptimizer()],
	"clearScreen": false
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
