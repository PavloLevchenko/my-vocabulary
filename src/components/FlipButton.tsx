"use client";
import { ReactElement, MouseEventHandler } from "react";
import styles from "./FlipButton.module.css";

interface Props {
	text: string;
	description: string;
	onClick?: React.MouseEventHandler;
}

export const FlipButton = ({ text, description, onClick }: Props): ReactElement => {
	return (
		<button className={styles.card} type="button" onClick={onClick}>
			<h2>
				{text} <span>-&gt;</span>
			</h2>
			<p>{description}</p>
		</button>
	);
};
