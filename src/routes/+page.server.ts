import { getDiscography } from "$lib/discography/getDiscography"

export async function load({ platform }) {
    const discography = await getDiscography(platform?.env?.["erora-live"]);

    return {
        "discography": discography.discography // todo: discography
    };
}
