import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import useSWRImmutable from "swr";
import { fetcher, prepareDefinitions } from "@/api";
import { url } from "inspector";

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
	const [url, setUrl] = useState("");
	const [definitions, setDefinitions] = useState<{ def: string }[]>();

	useEffect(() => {
		if (word) {
			setText(word[0]);
			setConfirm(word[1] === true);
		}
	}, [word]);

	const { data, error, isLoading } = useSWRImmutable(text, fetcher);
	const isError = error;
	useEffect(() => {
		const prepared = prepareDefinitions(data?.de[0]?.definitions, text);
		setDefinitions(prepared.definitions);
		setUrl(prepared.url);
	}, [data, text]);

	return [isLoading, isError, confirm, text, definitions, url];
};
