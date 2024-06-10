import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export const useEscNav = () => {
	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		const onKeyDown = (event: any) => {
			switch (event.code) {
				case "Escape":
					router.push(pathname);
				default:
					return;
			}
		};
		window.addEventListener("keydown", onKeyDown);

		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [pathname, router]);

	return { pathname, close: () => router.push(pathname) };
};
