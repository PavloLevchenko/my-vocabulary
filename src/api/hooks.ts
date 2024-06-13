import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import useSWRImmutable from "swr";
import { fetcher, prepareDefinitions } from "@/api";

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

export const useDefinition = (word: [text: string, confirm?: boolean] | undefined) => {
	const [confirm, setConfirm] = useState(true);
	const [text, setText] = useState("");
	const [urlString, setUrlString] = useState("");
	const [definitions, setDefinitions] = useState<{ def: string; url: string }[]>();

	useEffect(() => {
		if (word) {
			setText(word[0]);
			setConfirm(word[1] === true);
		}
	}, [word]);

	useEffect(() => {
		if (text.length > 2) {
			setUrlString("/w/api.php?origin=*&action=query&list=search&format=json&srsearch=" + text);
		}
	}, [text]);

	const { data, error, isLoading } = useSWRImmutable(urlString, fetcher);
	const isError = error;
	useEffect(() => {
		setDefinitions(prepareDefinitions(data?.query?.search, text));
	}, [data, text]);

	return [isLoading, isError, confirm, text, definitions];
};
