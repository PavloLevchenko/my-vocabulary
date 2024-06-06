import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { setCorrectIndex } from "@/api";
import words from "@/data/B1_Wortliste.json";

interface WordsState {
	data: string[];
	vocabulary: [boolean, string][];
	current: string;
	index: number;
	setIndex: (by: number) => void;
}

export const useWordsStore = create<WordsState>()(
	devtools(
		persist(
			(set, get) => ({
				data: words,
				vocabulary: [],
				current: "",
				index: 0,
				setIndex: increment => {
					set(() => {
						const newIndex = setCorrectIndex(get().index, increment, get().data.length);
						return { index: newIndex, current: get().data[newIndex] };
					});
				},
			}),
			{
				name: "words-storage",
				partialize: state => ({ index: state.index, vocabulary: state.vocabulary }),
				version: 1,
			},
		),
	),
);
