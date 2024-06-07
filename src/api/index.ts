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
		return new Blob([Array.from(vocabulary.keys()).join("\n")], { type: "text/plain" });
	}
	return new Blob();
};
