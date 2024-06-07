import { ReactElement } from "react";
import styles from "./Word.module.css";
import useStore from "@/zustand/useStore";
import { useWordsStore } from "@/zustand/useWordsStore";
import useSWR from "swr";
import { fetcher } from "@/api";

export const Word = (): ReactElement => {
	const word = useStore(useWordsStore, state => state.current);
	if (word) {
		const [text, confirm] = word;
		return (
			<div className={styles.center}>
				<p>{text}</p>
				<p className={[confirm ? styles.familiar : styles.unfamiliar].join(" ")}>
					{confirm ? "know" : "don't know"}
				</p>
				{/* <div >{data?.[0]?.url}</div> */}
			</div>
		);
	}
	return <></>;
};
