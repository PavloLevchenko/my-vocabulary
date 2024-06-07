import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { setCorrectIndex } from "@/api";
import words from "@/data/B1_Wortliste.json";

interface WordsState {
	data: string[];
	vocabulary: Map<string, boolean>;
	current: [string, boolean?];
	index: number;
}

interface WordsActions {
	setIndex: (by: number) => void;
	setKnowledge: (ok: boolean) => void;
	resetIndex: () => void;
}

const initState: WordsState = {
	data: words,
	vocabulary: new Map<string, boolean>(),
	current: [""],
	index: 0,
};

export const useWordsStore = create<WordsState & WordsActions>()(
	devtools(
		persist(
			(set, get) => ({
				...initState,
				setIndex: increment => {
					set(() => {
						const newIndex = setCorrectIndex(get().index, increment, get().data.length);

						const vocabulary = get().vocabulary;
						const word = get().data[newIndex];

						let ok;
						if (vocabulary.has(word)) {
							ok = vocabulary.get(word);
						} else {
							ok = true;
						}
						return {
							index: newIndex,
							current: [word, ok],
						};
					});
				},
				setKnowledge: confirm => {
					set(state => {
						const current: [string, boolean] = [get().current[0], confirm];

						return {
							current,
							vocabulary: new Map(state.vocabulary).set(...current),
						};
					});
				},
				resetIndex: () =>
					set({ index: 0, current: [get().data[0], true], vocabulary: new Map<string, boolean>() }),
			}),
			{
				name: "words",
				partialize: state => ({ index: state.index, vocabulary: state.vocabulary }),
				version: 1,
				serialize: data => {
					return JSON.stringify({
						...data,
						state: {
							...data.state,
							vocabulary: Array.from(data.state.vocabulary as Map<string, boolean>),
						},
					});
				},
				deserialize: value => {
					const data = JSON.parse(value);

					data.state.vocabulary = new Map(data.state.vocabulary);

					return data;
				},
			},
		),
	),
);
