import { getDiscography } from "$lib/discography/getDiscography";
import { json } from "@sveltejs/kit";

export async function GET() {
    const discography = await getDiscography(true);

    return json(discography);
}
