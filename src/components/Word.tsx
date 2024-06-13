import { ReactElement, useEffect } from "react";
import styles from "./Word.module.css";
import useStore from "@/zustand/useStore";
import { zustandStore } from "@/zustand/zustandStore";
import { WordDefinitions } from "@/components";
import { useDefinition } from "@/api/hooks";

export const Word = (): ReactElement => {
	const word = useStore(zustandStore, state => state.current);
	const vocabularyCount = useStore(zustandStore, state => state.vocabulary.size);
	const wordsCount = useStore(zustandStore, state => state.data.length);
	const [isLoading, isError, confirm, text, definitions] = useDefinition(word);

	return word ? (
		<div className={styles.center}>
			<p>{text}</p>
			<p className={[confirm ? styles.familiar : styles.unfamiliar].join(" ")}>
				{confirm ? "know" : "don't know"}
			</p>
			<p>
				{vocabularyCount} of {wordsCount}
			</p>
			{isLoading && <div>Loading...</div>}
			{!isLoading && !isError && <WordDefinitions definitions={definitions} />}
		</div>
	) : (
		<div className={styles.center}></div>
	);
};
