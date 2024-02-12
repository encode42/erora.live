import { readFile, writeFile } from "node:fs/promises";
import bandcamp from "@encode42/bandcamp-fetch";
import { basename, resolve } from "node:path";

const latestPath = resolve("./latest.txt");

async function update() {
	const previous = await readFile(latestPath, {
		"encoding": "utf-8"
	});

	const discography = await bandcamp.band.getDiscography({
		"bandUrl": "https://erora.bandcamp.com/"
	});

	const name = discography[0].name;
	console.log(`Latest release is ${name}!`);

	if (name !== previous) {
		console.log(`Updating ${basename(latestPath)}...`);
		await writeFile(latestPath, name);
	}

	process.exit(0);
}

update();
