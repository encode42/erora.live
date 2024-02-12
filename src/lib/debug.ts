export function debug(where: string, message: string) {
    console.debug(`${new Date().toISOString()} - [${where}] ${message}`);
}
