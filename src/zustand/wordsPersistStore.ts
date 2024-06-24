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
	current: [text: string, confirm?: boolean];
	index: number;
	sync: boolean;
}

const initState: State = {
	data: words,
	vocabulary: new Map<string, boolean>(),
	current: ["", true],
	index: 0,
	sync: true,
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
	setVocabulary: (vocabulary: Map<string, boolean>) => void;
	resetIndex: () => void;
	setSync: (sync: boolean) => void;
}

export const wordsPersistStore = (persist as WordPersist)(
	(set, get) => ({
		...initState,
		setIndex: increment => {
			set(state => {
				const newIndex = setCorrectIndex(get().index, increment, get().data.length);

				const vocabulary = get().vocabulary;
				const word = get().data[newIndex];

				let ok = true;
				if (vocabulary.has(word)) {
					ok = vocabulary.get(word) === true;
				}
				return {
					index: newIndex,
					current: [word, ok],
					vocabulary: new Map(state.vocabulary).set(word, ok),
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
		setVocabulary: vocabulary => {
			set(() => {
				let index = 0;
				let current: [string, boolean] = ["", true];
				get().data.every((word, ind) => {
					if (!vocabulary.has(word)) {
						index = ind;
						current[0] = word;
						return false;
					}
					return true;
				});

				return {
					index,
					current,
					vocabulary,
				};
			});
		},
		resetIndex: () =>
			set({ index: 0, current: [get().data[0], true], vocabulary: new Map<string, boolean>() }),
		setSync: sync => set({ sync }),
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
