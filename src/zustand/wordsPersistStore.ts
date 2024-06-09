import { StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { createEnhancedJSONStorage } from "./storage";
import { setCorrectIndex } from "@/api";
import words from "@/data/B1_Wortliste.json";

const VERSION = 1;
const NAME = "words";

interface State {
	data: string[];
	vocabulary: Map<string, boolean>;
	current: [string, boolean?];
	index: number;
}

const initState: State = {
	data: words,
	vocabulary: new Map<string, boolean>(),
	current: [""],
	index: 0,
};

export type WordState = State & WordsActions;

interface PersistWordState {
	index: number;
	vocabulary: Map<string, boolean>;
}

type WordPersist = (
	config: StateCreator<WordState>,
	options: PersistOptions<PersistWordState>,
) => StateCreator<WordState>;

interface WordsActions {
	setIndex: (by: number) => void;
	setKnowledge: (ok: boolean) => void;
	resetIndex: () => void;
}

export const wordsPersistStore = (persist as WordPersist)(
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
		name: NAME,
		version: VERSION,
		partialize: (state): PersistWordState => ({
			index: state.index,
			vocabulary: state.vocabulary,
		}),
		storage: createEnhancedJSONStorage(() => sessionStorage),
	},
);
