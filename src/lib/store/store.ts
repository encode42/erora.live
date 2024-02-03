export abstract class Store {
    protected abstract debugName: string;
    public abstract get<T>(key: string): Promise<T | undefined>;
    public abstract set(key: string, value: any): Promise<void>;
}
