export interface Command {
	"name": string;
	"description": string;
	"run": () => void | Promise<void>;
}
