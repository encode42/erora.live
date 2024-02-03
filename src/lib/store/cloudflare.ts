import { debug } from "$lib/debug";
import { Store } from "./store";

export class CloudflareStore extends Store {
    private namespace: KVNamespace;
    protected debugName: string = "Cloudflare Store";

    constructor(namespace: KVNamespace | undefined) {
        super();

        if (!namespace) {
            throw new Error("KV namespace is undefined, but is required in this environment!");
        }

        this.namespace = namespace;
    }

    public async get<T>(key: string): Promise<T | undefined> {
        debug(this.debugName, `Getting key ${key}...`);

        const value = await this.namespace.get(key);

        let parsed = value;
        try {
            parsed = value ? JSON.parse(value) : undefined;
        } catch {}

        debug(this.debugName, `${key} -> ${JSON.stringify(value)}`);

        return parsed as T;
    }

    public async set(key: string, value: any) {
        debug(this.debugName, `Setting ${key} to ${JSON.stringify(value)}...`);

        await this.namespace.put(key, JSON.stringify(value));
    }
}