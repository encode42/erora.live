import { getDiscography } from "$lib/discography/getDiscography";
import { json } from "@sveltejs/kit";

export const prerender = true;

export async function GET() {
	const discography = await getDiscography();

	return json(discography);
}
