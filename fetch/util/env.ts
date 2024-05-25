import "dotenv/config";

function env(key: string): string {
	const value = process.env[key];

	if (!value) {
		throw `The environment variable "${key}" is undefined! Change it in the ".env" file.`;
	}

	return value;
}

export function string(key: string): string {
	return env(key);
}

export function number(key: string): number {
	return Number.parseInt(env(key));
}
