import axios from "axios";

axios.defaults.baseURL = "/api";
export const fetcher = (url: string) => axios.get(url).then(res => res.data);

export const setCorrectIndex = (oldIndex: number, increment: number, length: number) => {
	let newIndex = oldIndex + increment > 0 ? oldIndex + increment : 0;
	newIndex = length > newIndex ? newIndex : length - 1;
	return newIndex;
};

export const blober = (vocabulary: Map<string, boolean> | undefined) => {
	if (vocabulary) {
		const familiarWords = Object.entries(vocabulary)
			.filter(w => w[1] === true)
			.keys();
		const unfamiliarWords = Object.entries(vocabulary)
			.filter(w => w[1] === false)
			.keys();
		return {
			familiar: new Blob([Array.from(familiarWords).join("\n")], { type: "text/plain" }),
			unfamiliar: new Blob([Array.from(unfamiliarWords).join("\n")], { type: "text/plain" }),
		};
	}
	return { familiar: new Blob(), unfamiliar: new Blob() };
};
