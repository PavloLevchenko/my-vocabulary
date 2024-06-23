"use client";

import { Slider, Header, Word } from "@/components";
import styles from "./page.module.css";

export default function Home() {
	return (
		<main className={styles.main}>
			<Header />
			<Word />
			<Slider />
		</main>
	);
}
