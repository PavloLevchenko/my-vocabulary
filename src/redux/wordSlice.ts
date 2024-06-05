import { createSlice } from "@reduxjs/toolkit";
import { setWord } from "./operations";
import words from "@/data/B1_Wortliste.json";

interface WordsState {
	data: string[];
	vocabulary: [boolean, string][];
	current: string;
	index: number;
	loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
	data: words,
	vocabulary: [],
	current: "",
	index: 0,
	loading: "idle",
} satisfies WordsState as WordsState;

const wordSlice = createSlice({
	name: "words",
	initialState,
	reducers: {
		/* case reducers here */
	},
	extraReducers: builder => {
		builder.addCase(setWord, (state, action) => {
			const index = action.payload > 0 ? action.payload : 0;
			state.index = index;
			state.current = state.data[index];
		});
	},
});

export const wordReducer = wordSlice.reducer;
