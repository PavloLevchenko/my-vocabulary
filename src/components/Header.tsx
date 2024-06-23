import styles from "./Header.module.css";
import GoogleSignOn from "@/components/Google/GoogleSignOn";
import GoogleDrive from "@/components/Google/GoogleDrive";

export const Header = () => {
	return (
		<div className={styles.container}>
			<div className={styles.moto}>
				<p>Get started by word busting</p>
			</div>
			<div className={styles.author}>
				<a href="https://github.com/PavloLevchenko" target="_blank" rel="noopener noreferrer">
					Created by{" "}
				</a>
			</div>
			<div className={styles.login}>
				<GoogleSignOn>
					<GoogleDrive />
				</GoogleSignOn>
			</div>
		</div>
	);
};
