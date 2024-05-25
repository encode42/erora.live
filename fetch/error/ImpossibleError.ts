export class ImpossibleError extends Error {
	constructor() {
		super("Somehow, a field is undefined..? This should not be possible!");
		this.name = "ImpossibleError";
	}
}
