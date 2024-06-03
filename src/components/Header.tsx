"use client";
import styles from "./Header.module.css";

export const Header = () => {
	return (
		<div className={styles.description}>
			<p>Get started by word busting</p>
			<div>
				<a href="https://github.com/PavloLevchenko" target="_blank" rel="noopener noreferrer">
					Created by{" "}
				</a>
			</div>
		</div>
	);
};
