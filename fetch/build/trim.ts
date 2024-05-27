import { spawnSync } from "bun";
import ffmpegPath from "ffmpeg-static";
import { format, join } from "node:path";
import { ImpossibleError } from "../error/ImpossibleError";
import { log } from "../log";
import type { FeaturedTrack, SingleTrack } from "../types/discography/Track";

interface FfmpegOptions {
	[flag: string]: number | string;
}

interface SpawnOptions extends FfmpegOptions {
	"i": string,
	"output": string
}

function spawn(options: SpawnOptions) {
	if (!ffmpegPath) {
		throw new ImpossibleError();
	}

	const { output, ...ffmpegOptions } = options;

	options["fflags"] ??= "+bitexact";
	options["flags:a"] ??= "+bitexact";

	const command = [
		ffmpegPath,
		"-y",
	];

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

export function trim(resourcePath: string, publicPath: string, track: SingleTrack | FeaturedTrack) {
	log.info(`Trimming audio file ${track.label}...`);

	const [minutes, seconds] = track.trim.start.split(":");
	const startTime = Math.max(Number.parseInt(minutes) * 60 + Number.parseInt(seconds) - 5, 0);
	const duration = track.trim.duration + 10; // 5 second fade-in, 5 second fade-out

	const fileName = join(publicPath, track.slug);

	spawn({
		"ss": startTime.toString(),
		"i": format({
			"dir": resourcePath,
			"name": track.slug,
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
