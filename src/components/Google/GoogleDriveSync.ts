"use server";

import { drive_v3, google } from "googleapis";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
	appFolderName,
	appFileName,
	appFileType,
	folderMimeType,
	getRes,
	getList,
	createRes,
	updateRes,
	checkIfFolderExist,
	checkIfFileExist,
} from "@/api/GoogleDrive";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = JSON.parse(process.env.GOOGLE_REDIRECT_URIS as string);

export interface File {
	id: string;
	name: string;
}

interface User {
	name?: string | null;
	email?: string | null;
	image?: string | null;
}

export interface ExtSession extends Session {
	user: User & {
		refresh_token?: string | null;
		access_token?: string | null;
	};
	error?: string | null;
}

const driveInstance = async () => {
	const session = (await getServerSession(authOptions)) as ExtSession;
	const access_token = session?.user?.access_token as string;
	const refresh_token = session?.user?.refresh_token as string;

	if (!access_token) {
		return;
	}

	const client = new google.auth.OAuth2({
		clientId: googleClientId,
		clientSecret: googleClientSecret,
		redirectUri,
	});
	client.setCredentials({ access_token, refresh_token });

	return google.drive({
		version: "v3",
		auth: client,
	});
};

const getFileId = async (drive: drive_v3.Drive) => {
	let folderId = (await checkIfFolderExist(drive, appFolderName)) as string;

	if (!folderId) {
		folderId = (await createRes(drive, appFolderName, folderMimeType)) as string;
	}
	let fileId = (await checkIfFileExist(drive, appFileName, folderId)) as string;
	if (!fileId) {
		fileId = (await createRes(drive, appFileName, appFileType, folderId)) as string;
	}
	return fileId;
};

export const observeDriveDir = async () => {
	const drive = await driveInstance();
	if (drive) {
		return await getList(drive);
	}
};

export const saveVocabulary = async (vocabulary: Map<string, boolean>) => {
	const drive = await driveInstance();
	if (drive) {
		let fileId = await getFileId(drive);
		const jsonContent = await getRes(drive, fileId);
		const oldMap = new Map(jsonContent as Array<[string, boolean]>);
		if (vocabulary?.size >= oldMap?.size) {
			const jsonMap = JSON.stringify([...vocabulary]);
			fileId = (await updateRes(drive, fileId, appFileType, jsonMap)) as string;
			return fileId;
		}
	}
};

export const getVocabulary = async () => {
	const drive = await driveInstance();
	if (drive) {
		let fileId = await getFileId(drive);
		const jsonContent = await getRes(drive, fileId);
		const oldMap = new Map(jsonContent as Array<[string, boolean]>);
		if (oldMap?.size > 0) {
			return oldMap;
		}
	}
};
