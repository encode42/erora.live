import { getDiscography } from "$lib/discography/getDiscography";

export async function load() {
	const discography = await getDiscography();

	return {
		"discography": discography.discography // todo: discography
	};
}
