import { ReactElement } from "react";
import styles from "./WordDefinitions.module.css";

interface Props {
	definitions: { def: string; url: string }[] | undefined;
}

export const WordDefinitions = ({ definitions }: Props): ReactElement => {
	return definitions?.length ? (
		<ol className={[styles.list, definitions.length === 1 && styles.pointless].join(" ")}>
			{definitions.map((value, index) => {
				return (
					<li key={index}>
						<a href={value.url} className={styles.link} target="_blank" rel="noopener">
							Wiki
						</a>
						{"==> "}
						{value.def}
					</li>
				);
			})}
		</ol>
	) : (
		<div className={styles.unfound}>Not found</div>
	);
};
