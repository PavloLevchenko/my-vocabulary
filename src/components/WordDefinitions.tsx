import { ReactElement } from "react";
import styles from "./WordDefinitions.module.css";

interface Props {
	definitions: { def: string }[] | undefined;
	url: string;
	loading?: boolean;
}

export const WordDefinitions = ({ definitions, url, loading }: Props): ReactElement => {
	if (loading) {
		return (
			<div className={styles.container}>
				<p className={styles.load}>Loading...</p>
			</div>
		);
	}
	const one = definitions?.length === 1;
	return definitions?.length ? (
		<div className={styles.container}>
			<ol className={styles.list}>
				{definitions.map((value, index, array) => {
					if (!value.def) {
						return;
					}
					return (
						<li className={[styles.def, one && styles.undecored].join(" ")} key={index}>
							{value.def} &nbsp;
						</li>
					);
				})}
			</ol>
			<a href={url} className={styles.link} target="_blank" rel="noopener">
				Wiki* {!one && definitions?.length}
			</a>
		</div>
	) : (
		<div className={styles.container}>
			<p className={styles.unfound}>Not found</p>
		</div>
	);
};
