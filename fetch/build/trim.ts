import { spawnSync } from "bun";
import ffmpegPath from "ffmpeg-static";
import { format, join } from "node:path";
import { log } from "../log";
import type { FeaturedTrack, LocalAlbumTrack } from "../types/discography/Album";
import type { LocalTrack, Track } from "../types/discography/Track";
import { ImpossibleError } from "../util/ImpossibleError";

interface FfmpegOptions {
	[flag: string]: number | string;
}

interface SpawnOptions extends FfmpegOptions {
	"i": string;
	"output": string;
}

function spawn(options: SpawnOptions) {
	if (!ffmpegPath) {
		throw new ImpossibleError();
	}

	const { output, ...ffmpegOptions } = options;

	options["fflags"] ??= "+bitexact";
	options["flags:a"] ??= "+bitexact";

	const command = [ffmpegPath, "-y"];

	for (const [flag, value] of Object.entries(ffmpegOptions)) {
		command.push(`-${flag}`, value.toString());
	}

	command.push(output);
	log.debug(command.join(" "));

	const process = spawnSync(command);
	if (process.exitCode !== 0) {
		throw `${process.exitCode}: ${process.stderr.toString()}`;
	}

	log.debug(process.stdout.toString());
}

function trim(release: Track | FeaturedTrack, audioPath: string, publicPath: string) {
	const [minutes, seconds] = release.trim.start.split(":");
	const startTime = Math.max(Number.parseInt(minutes) * 60 + Number.parseInt(seconds) - 5, 0);
	const duration = release.trim.duration + 10; // 5 second fade-in, 5 second fade-out

	const fileName = join(publicPath, release.slug);

	spawn({
		"ss": startTime.toString(),
		"i": format({
			"dir": audioPath,
			"name": release.slug,
			"ext": "mp3"
		}),
		"t": duration,
		"af": `volume=0.25,afade=type=in:start_time=0:duration=5:curve=ipar,afade=out:st=${duration - 5}:d=5:curve=cub`,
		"output": `${fileName}.ogg`
	});

	spawn({
		"i": `${fileName}.ogg`,
		"output": `${fileName}.mp3`
	});
}

export function trimTrack({ release, paths }: LocalTrack) {
	log.info(`[${release.label}] Trimming audio preview`);

	trim(release, paths.resource, paths.public);
}

export function trimAlbumTrack({ parent, release, paths }: LocalAlbumTrack) {
	if (!release.featured) {
		return;
	}

	log.info(`[${parent} -> ${release.label}] Trimming audio preview`);

	trim(release, paths.audio, paths.public);
}
