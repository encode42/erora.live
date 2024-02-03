import { getDiscography } from "$lib/discography/getDiscography"

export async function load() {
    return await getDiscography(false);
}
