declare global {
	namespace App {
		interface Platform {
			env?: {
				"erora-live": KVNamespace;
			};
		}
	}
}

export {};
