import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { wordsPersistStore, WordState } from "./wordsPersistStore";

export const zustandStore = create<WordState>()(
	devtools(wordsPersistStore, {
		serialize: {
			options: false,
		},
	}),
);
