import axios from "axios";

axios.defaults.baseURL = "/api";
export const fetcher = (url: string) => axios.get(url).then(res => res.data);

export const setCorrectIndex = (oldIndex: number, increment: number, length: number) => {
	let newIndex = oldIndex + increment > 0 ? oldIndex + increment : 0;
	newIndex = length > newIndex ? newIndex : length - 1;
	return newIndex;
};

export const blober = (vocabulary: Map<string, boolean> | undefined) => {
	if (!vocabulary) {
		vocabulary = new Map<string, boolean>();
	}
	const familiarWords = new Map([...vocabulary].filter(w => w[1] === true)).keys();
	const unfamiliarWords = new Map([...vocabulary].filter(w => w[1] === false)).keys();
	const familiarText = Array.from(familiarWords).join("\n");
	const unfamiliarText = Array.from(unfamiliarWords).join("\n");

	return {
		familiar: new Blob([familiarText], { type: "text/plain" }),
		familiarText,
		unfamiliar: new Blob([unfamiliarText], { type: "text/plain" }),
		unfamiliarText,
	};
};
