import { ReactElement, useRef, useEffect } from "react";
import styles from "./FlipButton.module.css";

interface Props {
	text: string;
	arrow: string;
	description: string;
	keysFocus?: boolean;
	hasFocus?: boolean;
	disable?: boolean;
	checkOver: Function;
	onClick?: React.MouseEventHandler;
}

export const FlipButton = ({
	text,
	arrow,
	description,
	keysFocus,
	hasFocus,
	disable,
	onClick,
	checkOver,
}: Props): ReactElement => {
	const ref = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (hasFocus) {
			ref?.current?.focus();
		}
	}, [hasFocus]);

	return (
		<button
			className={styles.card}
			type="button"
			disabled={disable}
			onClick={onClick}
			ref={ref}
			onMouseOver={event => {
				if (!keysFocus) {
					event.currentTarget.focus();
				}
				checkOver(false);
			}}
			onMouseOut={event => event.currentTarget.blur()}
		>
			<h2>
				{text} <span>{arrow}</span>
			</h2>
			<p>{description}</p>
		</button>
	);
};
