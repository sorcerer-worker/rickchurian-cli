export function getIdFromURL(input: string) {
	try {
		const url = new URL(input).pathname;
		const splited = url.split("/");

		return Number(splited[splited.length - 1]);
	} catch {
		return -1;
	}
}
