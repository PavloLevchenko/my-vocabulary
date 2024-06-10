import styles from "./Download.module.css";
import { useEffect, useState } from "react";
import useStore from "@/zustand/useStore";
import { zustandStore } from "@/zustand/zustandStore";
import { blober } from "@/api";

export const Download = () => {
	const [downloadKnownLink, setDownloadKnownLink] = useState<string | undefined>();
	const [downloadUnknownLink, setDownloadUnknownLink] = useState<string | undefined>();
	const [familiarText, setFamiliarText] = useState<string>("");
	const [unfamiliarText, setUnfamiliarText] = useState<string>("");
	const [date, setDate] = useState("");

	const vocabulary = useStore(zustandStore, state => state.vocabulary);

	useEffect(() => {
		const { createObjectURL } = window.URL;
		setDate(new Date().toISOString().slice(0, 19));
		const { familiar, unfamiliar, familiarText, unfamiliarText } = blober(vocabulary);
		setDownloadKnownLink(createObjectURL(familiar));
		setDownloadUnknownLink(createObjectURL(unfamiliar));
		setFamiliarText(familiarText);
		setUnfamiliarText(unfamiliarText);
	}, [vocabulary]);

	return (
		<div className={styles.content}>
			<div className={styles.block}>
				<a download={`known ${date}.txt`} href={downloadKnownLink} className={styles.link}>
					Download known
				</a>
				<button
					type="button"
					onClick={() => {
						navigator.clipboard.writeText(familiarText);
					}}
					className={styles.button}
				>
					Copy known
				</button>
			</div>
			<div className={styles.block}>
				<a download={`unknown ${date}.txt`} href={downloadUnknownLink} className={styles.link}>
					Download unknown
				</a>
				<button
					type="button"
					onClick={() => {
						navigator.clipboard.writeText(unfamiliarText);
					}}
					className={styles.button}
				>
					Copy unknown
				</button>
			</div>
		</div>
	);
};
