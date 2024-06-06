"use client";

import styles from "./page.module.css";
import useSWR from "swr";
import { fetcher } from "@/api";
import { handleKeyDown } from "@/api/slider";
import React, { useEffect, useState } from "react";
import useStore from "@/zustand/useStore";
import { useWordsStore } from "@/zustand/useWordsStore";
import { FlipButton } from "@/components/FlipButton";
import { Header } from "@/components/Header";

export default function Home() {
	//const { data } = useSWR<any>(`wb/snippet/?q=Haus`, fetcher);
	const [increment, setIncrement] = useState(0);
	const [keysFocus, setKeysFocus] = useState(false);
	const current = useStore(useWordsStore, state => state.current);
	const { setIndex } = useWordsStore();

	useEffect(() => {
		setIndex(increment);
		setIncrement(0);
	}, [increment, setIndex]);

	useEffect(() => {
		const onKeyDown = (event: any) => setIncrement(handleKeyDown(event));
		setKeysFocus(true);
		window.addEventListener("keydown", onKeyDown);

		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	}, []);

	return (
		<main className={styles.main}>
			<Header />

			{/* <div className={styles.center}>{data?.[0]?.url}</div> */}
			<div className={styles.center}>{current}</div>

			<div className={styles.grid}>
				<FlipButton
					text="New"
					arrow="*"
					description="Start again"
					onClick={() => setIndex(0)}
					checkOver={setKeysFocus}
					keysFocus={keysFocus}
				/>
				<FlipButton
					text="Prevew"
					arrow="&lt;-"
					description="Show previous word"
					checkOver={setKeysFocus}
					onClick={() => {
						setIncrement(-1);
					}}
					hasFocus={increment < 0}
					keysFocus={keysFocus}
				/>
				<FlipButton
					text="Next"
					arrow="-&gt;"
					description="Show next word"
					checkOver={setKeysFocus}
					onClick={() => {
						setIncrement(+1);
					}}
					hasFocus={increment > 0}
					keysFocus={keysFocus}
				/>
				<FlipButton
					text="Export"
					arrow="&#2197;"
					description="Upload a list of words to a file for further work with them."
					checkOver={setKeysFocus}
					keysFocus={keysFocus}
				/>
			</div>
		</main>
	);
}
