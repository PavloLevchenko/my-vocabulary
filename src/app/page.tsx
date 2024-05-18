"use client";

import styles from "./page.module.css";
import useSWR from "swr";
import { fetcher } from "@/api";
import React from "react";

export default function Home() {
	const { data } = useSWR<any>(`wb/snippet/?q=Haus`, fetcher);

	return (
		<main className={styles.main}>
			<div className={styles.description}>
				<p>Get started by word busting</p>
				<div>
					<a href="https://github.com/PavloLevchenko" target="_blank" rel="noopener noreferrer">
						Created by{" "}
					</a>
				</div>
			</div>

			<div className={styles.center}>{data?.[0]?.url}</div>

			<div className={styles.grid}>
				<a
					href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
					className={styles.card}
					target="_blank"
					rel="noopener noreferrer"
				>
					<h2>
						New <span>-&gt;</span>
					</h2>
					<p>Start again</p>
				</a>

				<a
					href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
					className={styles.card}
					target="_blank"
					rel="noopener noreferrer"
				>
					<h2>
						Prev <span>-&gt;</span>
					</h2>
					<p>Show previous word</p>
				</a>

				<a
					href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
					className={styles.card}
					target="_blank"
					rel="noopener noreferrer"
				>
					<h2>
						Next <span>-&gt;</span>
					</h2>
					<p>Show next word</p>
				</a>

				<a
					href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
					className={styles.card}
					target="_blank"
					rel="noopener noreferrer"
				>
					<h2>
						Export <span>-&gt;</span>
					</h2>
					<p>Upload a list of words to a file for further work with them.</p>
				</a>
			</div>
		</main>
	);
}
