import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { cover } from "../build/cover";
import { ensureDirectory, order, resourcesPath } from "../resource/ensure";
import type { LocalAlbum } from "../types/discography/Album";
import type { BuiltRelease, Release } from "../types/discography/Release";
import { buildAlbum } from "./album";
import { buildTrack } from "./track";

const staticPath = resolve("static/releases");
const libPath = resolve("src/lib");
await ensureDirectory(staticPath);
await ensureDirectory(libPath);

export async function build() {
	const releases: BuiltRelease[] = [];
	for (const slug of order) {
		const resourcePath = join(resourcesPath, slug);
		const metaData = await readFile(join(resourcePath, "meta.json"), {
			"encoding": "utf-8"
		});

		const release = JSON.parse(metaData) as Release;

		const publicPath = join(staticPath, slug);
		await ensureDirectory(publicPath);

		let builtRelease: BuiltRelease;
		if (release.type === "album") {
			const meta: LocalAlbum = {
				release,
				"paths": {
					"resource": resourcePath,
					"audio": join(resourcePath, "audio"),
					"public": publicPath
				}
			};

			await cover(meta);
			builtRelease = await buildAlbum(meta);
		} else {
			const meta = {
				release,
				"paths": {
					"resource": resourcePath,
					"public": publicPath
				}
			};

			await cover(meta);
			builtRelease = buildTrack(meta);
		}

		releases.push(builtRelease);
	}

	await writeFile(join(libPath, "releases.json"), JSON.stringify(releases));
}
