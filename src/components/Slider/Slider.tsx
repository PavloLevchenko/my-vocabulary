import styles from "./Slider.module.css";
import { handleSchift, handleConfirm } from "@/api/slider";
import { useEffect, useState } from "react";
import useStore from "@/zustand/useStore";
import { zustandStore } from "@/zustand/zustandStore";
import { FlipButton } from "@/components";
import Link from "next/link";

export const Slider = () => {
	const [increment, setIncrement] = useState<number | undefined>(0);
	const [confirm, setConfirm] = useState<boolean | undefined>();
	const [keysFocus, setKeysFocus] = useState(false);
	const { setIndex, resetIndex, setKnowledge } = zustandStore();
	const sync = useStore(zustandStore, state => state.sync);

	useEffect(() => {
		if (increment !== undefined) {
			setIndex(increment);
			setIncrement(undefined);
		}
	}, [increment, setIndex]);

	useEffect(() => {
		if (confirm !== undefined) {
			setKnowledge(confirm == true);
		}
	}, [confirm, setKnowledge]);

	useEffect(() => {
		const onKeyDown = (event: any) => {
			setIncrement(handleSchift(event));
			setConfirm(handleConfirm(event));
		};
		setKeysFocus(true);
		window.addEventListener("keydown", onKeyDown);

		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	}, []);

	return (
		<div className={styles.grid}>
			<FlipButton
				text="New"
				arrow="*"
				description="Start again"
				onClick={() => resetIndex()}
				checkOver={setKeysFocus}
				keysFocus={keysFocus}
				disable={sync}
			/>
			<FlipButton
				text="Prevew"
				arrow="&lt;-"
				description="Show previous word"
				checkOver={setKeysFocus}
				onClick={() => {
					setIncrement(-1);
				}}
				hasFocus={(increment as number) < 0}
				keysFocus={keysFocus}
				disable={sync}
			/>
			<FlipButton
				text="Next"
				arrow="-&gt;"
				description="Show next word"
				checkOver={setKeysFocus}
				onClick={() => {
					setIncrement(+1);
				}}
				hasFocus={(increment as number) > 0}
				keysFocus={keysFocus}
				disable={sync}
			/>

			<Link href="?modal=true">
				<FlipButton
					text="Export"
					arrow="&#2197;"
					description="Upload a list of words to a file for further work with them."
					checkOver={setKeysFocus}
					keysFocus={keysFocus}
					disable={sync}
				/>
			</Link>
		</div>
	);
};
