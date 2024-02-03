import { getDiscography } from "$lib/discography/getDiscography";
import { json } from "@sveltejs/kit";

export async function GET({ platform }) {
    const discography = await getDiscography(platform?.env?.["erora-live"]);

    return json(discography);
}
