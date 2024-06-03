import { createAsyncThunk, createAction } from "@reduxjs/toolkit";

export const setWord = createAction<number>("words/index");

export const getWord = createAction<string>("words/current");
