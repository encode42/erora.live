import { getDiscography } from "$lib/discography/getDiscography"

export async function load({ platform }) {
    return await getDiscography(platform?.env?.["erora-live"]);
}
