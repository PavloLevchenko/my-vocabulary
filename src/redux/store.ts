import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import createWebStorage from "redux-persist/es/storage/createWebStorage";
import { wordReducer } from "./wordSlice";

export function createPersistStore() {
	const isServer = typeof window === "undefined";
	if (isServer) {
		return {
			getItem() {
				return Promise.resolve(null);
			},
			setItem() {
				return Promise.resolve();
			},
			removeItem() {
				return Promise.resolve();
			},
		};
	}
	return createWebStorage("local");
}
const storage = typeof window !== "undefined" ? createWebStorage("local") : createPersistStore();

const persistWordConfig = {
	key: "word",
	storage,
	whitelist: ["index", "vocabulary"],
};

export const makeStore = () => {
	return configureStore({
		reducer: { words: persistReducer(persistWordConfig, wordReducer) },
		middleware: getDefaultMiddleware =>
			getDefaultMiddleware({
				serializableCheck: {
					ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
				},
			}),
	});
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
