"use client";

import styles from "./page.module.css";
import { Slider, Header, Word } from "@/components";

export default function Home() {
	return (
		<main className={styles.main}>
			<Header />
			<Word />
			<Slider />
		</main>
	);
}
