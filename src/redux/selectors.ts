import { createSelector } from "@reduxjs/toolkit";

export const getWords = (state: { words: { data: string[] } }) => state.words.data;
export const getWord = (state: { words: { current: string } }) => state.words.current;
export const getIndex = (state: { words: { index: number } }) => state.words.index;
