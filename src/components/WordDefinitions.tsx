import { ReactElement } from "react";
import styles from "./WordDefinitions.module.css";

interface Props {
	definitions: { def: string }[] | undefined;
	url: string;
}

export const WordDefinitions = ({ definitions, url }: Props): ReactElement => {
	return definitions?.length ? (
		<div>
			<select className={styles.list}>
				{definitions.map((value, index, array) => {
					const ind = array.length > 1 ? index + 1 : "";
					if (!value.def) {
						return;
					}
					return (
						<option className={styles.def} key={index}>
							{ind + "-" + value.def + ","} &nbsp;
						</option>
					);
				})}
			</select>
			<a href={url} className={styles.link} target="_blank" rel="noopener">
				Wiki
			</a>
		</div>
	) : (
		<div className={styles.unfound}>Not found</div>
	);
};
