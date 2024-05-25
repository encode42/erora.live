import releasesData from "$lib/releases.json";
import type { BuiltRelease } from "$types/discography/BuiltRelease";
import { redirect } from "@sveltejs/kit";

const releases = releasesData as BuiltRelease[];

export const prerender = true;
export function entries() {
	return releases.map((release) => ({
		"slug": release.slug
	}));
}

const intl = new Intl.DateTimeFormat("default", {
	"dateStyle": "long"
});

export function load({ params }) {
	let currentRelease: BuiltRelease | undefined;

	for (const release of releases) {
		if (release.slug !== params.slug) {
			continue;
		}

		currentRelease = release;
		break;
	}

	if (!currentRelease) {
		return redirect(302, "/");
	}

	const released = intl.format(new Date(currentRelease.released));
	const description = `${currentRelease.type === "album" ? "Album" : "Track"} released on ${released}.`;

	return {
		"release": currentRelease,
		description
	};
}
