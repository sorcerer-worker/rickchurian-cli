export function getIdFromURL(input: string) {
	try {
		const url = new URL(input).pathname;
		const splited = url.split("/");

		return Number(splited[splited.length - 1]);
	} catch {
		return -1;
	}
}

export function getProperty(object: any, prop: string) {
	if (typeof object !== "object") throw "getProperty: obj is not an object";
	if (typeof prop !== "string") throw "getProperty: prop is not a string";

	prop = prop.replace(/\[["'`](.*)["'`]\]/g, ".$1");

	return prop.split(".").reduce(function (prev, curr) {
		return prev ? prev[curr] : undefined;
	}, object || {});
}

export function preventNegative(n: number) {
	return n < 0 ? 0 : n
}