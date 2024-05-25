import { spawnSync } from "bun";
import ffmpegPath from "ffmpeg-static";
import { join } from "node:path";
import { ImpossibleError } from "../error/ImpossibleError";
import { log } from "../log";
import type { FeaturedTrack, SingleTrack } from "../types/discography/Track";

export function trim(resourcePath: string, publicPath: string, track: SingleTrack | FeaturedTrack) {
	log.info(`Trimming audio file ${track.label}...`);

	const [minutes, seconds] = track.trim.start.split(":");
	const startTime = Math.max(Number.parseInt(minutes) * 60 + Number.parseInt(seconds) - 5, 0);
	const duration = track.trim.duration + 10; // 5 second fade-in, 5 second fade-out

	if (!ffmpegPath) {
		throw new ImpossibleError();
	}

	const fileName = join(publicPath, track.slug);

	const ogg = spawnSync([
		ffmpegPath,
		"-y",
		"-ss",
		startTime.toString(),
		"-i",
		join(resourcePath, `${track.slug}.mp3`),
		"-t",
		duration.toString(),
		"-af",
		`afade=type=in:start_time=0:duration=5:curve=ipar,afade=out:st=${duration - 5}:d=5:curve=cub`,
		`${fileName}.ogg`
	]);
	if (!ogg.success) {
		throw `${ogg.exitCode}: ${ogg.stderr.toString()}`;
	}

	log.debug(ogg.stdout.toString());

	const mp3 = spawnSync([ffmpegPath, "-y", "-i", `${fileName}.ogg`, `${fileName}.mp3`]);
	if (!mp3.success) {
		throw `${mp3.exitCode}: ${mp3.stderr.toString()}`;
	}

	log.debug(mp3.stdout.toString());
}
