import axios from "axios";

const baseURL = "https://en.wiktionary.org/api/rest_v1/page/definition";
axios.defaults.baseURL = baseURL;
export const fetcher = (url: string | undefined) => url && axios.get(url).then(res => res.data);

export const setCorrectIndex = (oldIndex: number, increment: number, length: number) => {
	let newIndex = oldIndex + increment > 0 ? oldIndex + increment : 0;
	newIndex = length > newIndex ? newIndex : length - 1;
	return newIndex;
};

export const stripTags = (text: string) => {
	const doc = new DOMParser().parseFromString(text, "text/html");
	const content = doc.body.textContent;
	return content || "";
};

export const prepareDefinitions = (defs: [{ definition: string }], title: string) => {
	let definitions: { def: string }[] = [];
	const url = "https://de.wiktionary.org/wiki/" + title;
	if (defs) {
		defs.forEach(value => {
			definitions.push({ def: stripTags(value.definition) });
		});
	}
	return { definitions, url };
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
