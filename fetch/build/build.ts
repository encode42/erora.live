import { copyFile, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import sharp from "sharp";
import { log } from "../log";
import { ensureDirectory, order, resourcesPath } from "../resource/ensure";
import type { BuiltRelease } from "../types/discography/BuiltRelease";
import type { Release } from "../types/discography/Release";
import { buildAlbum } from "./album";
import { buildTrack } from "./track";

const staticPath = resolve("static/releases");
const libPath = resolve("src/lib");
await ensureDirectory(staticPath);
await ensureDirectory(libPath);

export async function build() {
	log.info("Building static public files...");

	const releases: BuiltRelease[] = [];
	for (const slug of order) {
		const resourcePath = join(resourcesPath, slug);

		const metaData = await readFile(join(resourcePath, "meta.json"), {
			"encoding": "utf-8"
		});

		const meta = JSON.parse(metaData) as Release;
		if (meta.ignored) {
			return;
		}

		const publicPath = join(staticPath, slug);
		await ensureDirectory(publicPath);

		// @ts-ignore - refuses to infer "meta" type correctly
		releases.push(await (meta.type === "album" ? buildAlbum : buildTrack)(meta, resourcePath, publicPath));

		log.info(`Converting cover art for ${meta.label}...`);
		const coverPath = join(resourcePath, "cover.jpg");
		const cover = await sharp(coverPath)
			.resize(600)
			.avif({
				"effort": 9,
				"chromaSubsampling": "4:2:0"
			})
			.toBuffer();

		log.debug("Finished converting!");

		await copyFile(coverPath, join(publicPath, "cover.jpg"));
		await writeFile(join(publicPath, "cover.avif"), cover);
	}

	await writeFile(join(libPath, "releases.json"), JSON.stringify(releases));

	log.info("Finished building!");
}
