"use client";

import { useState, useEffect } from "react";
import { getVocabulary, saveVocabulary } from "./GoogleDriveSync";
import { appFileName, appFileType } from "@/api/GoogleDrive";
import useStore from "@/zustand/useStore";
import { zustandStore } from "@/zustand/zustandStore";

const GoogleDrive = () => {
	const [downloadLink, setDownloadLink] = useState<string | undefined>();
	const [oldMap, setOldMap] = useState<Map<string, boolean>>();
	const sync = useStore(zustandStore, state => state.sync);
	const vocabulary = useStore(zustandStore, state => state.vocabulary) as Map<string, boolean>;
	const { setVocabulary, setSync } = zustandStore();

	useEffect(() => {
		setSync(true);
		getVocabulary().then(map => setOldMap(map));
	}, [setSync]);

	useEffect(() => {
		if (oldMap) {
			setVocabulary(oldMap);
			setSync(false);
		}
	}, [oldMap, setSync, setVocabulary]);

	useEffect(() => {
		if (oldMap && vocabulary?.size > 1 && vocabulary?.size >= oldMap?.size) {
			setSync(true);
			saveVocabulary(vocabulary).then(id => setSync(false));
			const jsonMap = JSON.stringify([...vocabulary], null, 2);
			const { createObjectURL } = window.URL;
			setDownloadLink(createObjectURL(new Blob([jsonMap], { type: appFileType })));
		}
	}, [oldMap, setSync, vocabulary]);

	return (
		<div>
			<a download={appFileName} href={downloadLink} target="_blank" rel="noopener">
				{sync ? "sync" : "wait"}
			</a>
		</div>
	);
};

export default GoogleDrive;
