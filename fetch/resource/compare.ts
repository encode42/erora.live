import { log } from "../log";

interface Differences {
	[key: string]: {
		"source": string | undefined;
		"target": string | undefined;
	};
}

const knownDifferent: string[] = ["featured", "why", "trim"];

export function compareDifference(label: string, source: object, target: object) {
	const firstPass = listDifference(source, target);
	const secondPass = listDifference(target, source, firstPass);

	const entries = Object.entries(secondPass);
	if (entries.length === 0) {
		return;
	}

	log.warn(`Differences found in ${label}:`);
	for (const [key, difference] of entries) {
		log.warn(`${key} | online ${difference.target} -> local ${difference.source}`);
	}
}

export function listDifference(source: object, target: object, existingDifferences: Differences = {}) {
	const differences: Differences = existingDifferences;

	for (const [key, value] of Object.entries(source)) {
		if (differences[key] || knownDifferent.includes(key)) {
			continue;
		}

		const targetValue = target[key as keyof typeof target];

		if (typeof value === "object") {
			if (!targetValue) {
				differences[key] = {
					"source": JSON.stringify(value),
					"target": undefined
				};

				continue;
			}

			listDifference(value, targetValue);
			continue;
		}

		if (targetValue === value) {
			continue;
		}

		differences[key] = {
			"source": JSON.stringify(value),
			"target": JSON.stringify(targetValue)
		};
	}

	return differences;
}
