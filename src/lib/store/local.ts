import { debug } from "$lib/debug";
import { Store } from "./store";

export class LocalStore extends Store {
    private static existingStore: LocalStore;
    private localStore: Record<string, any> = {};
    protected debugName: string = "Local Store";

    constructor() {
        super();

        if (LocalStore.existingStore) {
            return LocalStore.existingStore;
        }

        LocalStore.existingStore = this;
    }

    public async get<T>(key: string): Promise<T | undefined> {
        debug(this.debugName, `Getting key ${key}...`);

        const value = this.localStore[key];

        debug(this.debugName, `${key} -> ${JSON.stringify(value)}`);

        return this.localStore[key] as T;
    }

    public async set(key: string, value: any) {
        debug(this.debugName, `Setting ${key} to ${JSON.stringify(value)}...`);

        this.localStore[key] = value;
    }
}