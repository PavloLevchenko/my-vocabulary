import styles from "./Download.module.css";
import { useEffect, useState } from "react";
import useStore from "@/zustand/useStore";
import { zustandStore } from "@/zustand/zustandStore";
import { blober } from "@/api";

export const Download = () => {
	const [downloadKnownLink, setDownloadKnownLink] = useState<string | undefined>();
	const [downloadUnknownLink, setDownloadUnknownLink] = useState<string | undefined>();
	const [date, setDate] = useState("");

	const vocabulary = useStore(zustandStore, state => state.vocabulary);

	useEffect(() => {
		const { familiar, unfamiliar } = blober(vocabulary);
		const { createObjectURL } = window.URL;
		setDate(new Date().toISOString().slice(0, 19));
		setDownloadKnownLink(createObjectURL(familiar));
		setDownloadUnknownLink(createObjectURL(unfamiliar));
	}, [vocabulary]);

	return (
		<div className={styles.content}>
			<a download={`known ${date}.txt`} href={downloadKnownLink} className={styles.link}>
				Download known
			</a>
			<a download={`unknown ${date}.txt`} href={downloadUnknownLink} className={styles.link}>
				Download unknown
			</a>
		</div>
	);
};
