import styles from "./Slider.module.css";
import { handleSchift, handleConfirm } from "@/api/slider";
import React, { useEffect, useState } from "react";
import useStore from "@/zustand/useStore";
import { useWordsStore } from "@/zustand/useWordsStore";
import { FlipButton } from "@/components";
import { blober } from "@/api";

export const Slider = () => {
	const [increment, setIncrement] = useState(0);
	const [confirm, setConfirm] = useState<boolean | undefined>();
	const [keysFocus, setKeysFocus] = useState(false);
	const { setIndex, resetIndex, setKnowledge } = useWordsStore();

	const vocabulary = useStore(useWordsStore, state => state.vocabulary);
	const words = blober(vocabulary);
	const downloadLink = window.URL.createObjectURL(words);

	useEffect(() => {
		setIndex(increment);
		setIncrement(0);
	}, [increment, setIndex]);

	useEffect(() => {
		if (confirm !== undefined) {
			setKnowledge(confirm == true);
		}
	}, [confirm, setKnowledge]);

	useEffect(() => {
		const onKeyDown = (event: any) => {
			setIncrement(handleSchift(event));
			setConfirm(handleConfirm(event));
		};
		setKeysFocus(true);
		window.addEventListener("keydown", onKeyDown);

		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	}, []);

	return (
		<div className={styles.grid}>
			<FlipButton
				text="New"
				arrow="*"
				description="Start again"
				onClick={() => resetIndex()}
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
			<a download="list.txt" href={downloadLink}>
				<FlipButton
					text="Export"
					arrow="&#2197;"
					description="Upload a list of words to a file for further work with them."
					checkOver={setKeysFocus}
					keysFocus={keysFocus}
				/>
			</a>
		</div>
	);
};
