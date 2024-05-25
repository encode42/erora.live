import { pino } from "pino";
import pretty from "pino-pretty";

export const log = pino(
	{
		"level": process.env.VERBOSE ? "debug" : "info"
	},
	pretty({
		"ignore": "pid,hostname"
	})
);
