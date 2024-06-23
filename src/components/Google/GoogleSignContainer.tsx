import { PropsWithChildren, MouseEventHandler } from "react";
import styles from "./GoogleSignContainer.module.css";

interface Props extends PropsWithChildren {
	name: string;
	description: string;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
}

export const GoogleSignContainer = ({ name, description, onClick, disabled, children }: Props) => {
	return (
		<div className={styles.container}>
			{description} <br />
			<button onClick={onClick} disabled={disabled} className={styles.button}>
				{name}
			</button>
			{children}
		</div>
	);
};
