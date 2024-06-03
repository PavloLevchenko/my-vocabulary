"use client";

import styles from "./page.module.css";
import useSWR from "swr";
import { fetcher } from "@/api";
import React from "react";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setWord } from "@/redux/operations";
import { getWord } from "@/redux/selectors";
import { FlipButton } from "@/components/FlipButton";
import { Header } from "@/components/Header";

export default function Home() {
	//const { data } = useSWR<any>(`wb/snippet/?q=Haus`, fetcher);
	const [index, setIndex] = useState(0);
	const current = useAppSelector(getWord);
	const dispatch = useAppDispatch();
	dispatch(setWord(index));

	const setCorrectIndex = (n: number) => {
		const i = n > 0 ? n : 0;
		setIndex(i);
	};

	return (
		<main className={styles.main}>
			<Header />

			{/* <div className={styles.center}>{data?.[0]?.url}</div> */}
			<div className={styles.center}>{current}</div>

			<div className={styles.grid}>
				<FlipButton text="New" description="Start again" onClick={() => setCorrectIndex(0)} />
				<FlipButton
					text="Prevew"
					description="Show previous word"
					onClick={() => setCorrectIndex(index - 1)}
				/>
				<FlipButton
					text="Next"
					description="Show next word"
					onClick={() => setCorrectIndex(index + 1)}
				/>
				<FlipButton
					text="Export"
					description="Upload a list of words to a file for further work with them."
				/>
			</div>
		</main>
	);
}
