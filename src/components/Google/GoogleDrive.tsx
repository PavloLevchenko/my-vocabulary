"use client";

import { useState, useEffect } from "react";
import { ObserveDriveDir, File } from "./GoogleDriveApi";
import useStore from "@/zustand/useStore";
import { zustandStore } from "@/zustand/zustandStore";

const GoogleDrive = () => {
	const [files, setFiles] = useState<File[]>();
	const vocabulary = useStore(zustandStore, state => state.vocabulary) as Map<string, boolean>;

	useEffect(() => {
		ObserveDriveDir(vocabulary).then(files => setFiles(files as File[]));
	}, [vocabulary]);

	return (
		<div>
			{files && files?.length > 0 && (
				<ul>
					{files.map((file: File) => {
						return <li key={file.id}>Found file: {file.name + " " + file.id}</li>;
					})}
				</ul>
			)}
		</div>
	);
};

export default GoogleDrive;
