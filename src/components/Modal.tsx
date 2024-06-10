"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./Modal.module.css";
import { MdClose } from "react-icons/md";
import { Download } from "@/components";
import { useEscNav } from "@/api/hooks";

export const Modal = () => {
	const searchParams = useSearchParams();
	const modal = searchParams.get("modal");

	const { pathname, close } = useEscNav();

	return (
		<>
			{modal && (
				<dialog key={"Modal" + pathname} className={styles.backdrop} onClick={close}>
					<div className={styles.container}>
						<Download />
						<Link href={pathname} className={styles.close}>
							<MdClose />
						</Link>
					</div>
				</dialog>
			)}
		</>
	);
};
