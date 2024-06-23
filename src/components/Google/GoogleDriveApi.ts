"use server";

import { drive_v3, google } from "googleapis";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { JWT } from "next-auth/jwt";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = JSON.parse(process.env.GOOGLE_REDIRECT_URIS as string);
const appFolderName = process.env.APP_FOLDER_NAME as string;
const folderMimeType = "application/vnd.google-apps.folder";
const spaces = "appDataFolder";
const configFileName = "config.json";

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

const getList = async (drive: drive_v3.Drive) => {
	const response = await drive.files.list({
		spaces,
		fields: "files(id, name)",
	});

	if (response.status === 200) {
		return response.data.files;
	}
};

const checkIfFolderExist = async (drive: drive_v3.Drive, name: string) => {
	let q = `name = '${name}' and mimeType = '${folderMimeType}'`;
	const { data } = await drive.files.list({
		spaces,
		q,
		fields: "files(id)",
	});

	if (data?.files) {
		return data?.files[0]?.id as string;
	}
};

const checkIfFileExist = async (
	drive: drive_v3.Drive,
	name: string,
	folderId?: string,
	mimeType?: string,
) => {
	let q = folderId ? `name = '${name}' and parents = '${folderId}'` : `name = '${name}'`;
	if (mimeType) {
		q = q + `mimeType = '${mimeType}'`;
	}
	const { data } = await drive.files.list({
		spaces,
		q,
		fields: "files(id)",
	});

	if (data?.files) {
		return data?.files[0]?.id as string;
	}
};

const createRes = async (
	drive: drive_v3.Drive,
	name: string,
	mimeType: string,
	parent = "appDataFolder",
) => {
	const fileMetadata = {
		name,
		parents: [parent],
		mimeType,
	};

	const response = await drive.files.create({
		requestBody: fileMetadata,
		fields: "id",
	});

	if (response.status === 200) {
		return response.data.id;
	}
};

const updateRes = async (drive: drive_v3.Drive, fileId: string, mimeType: string, body: any) => {
	const media = {
		mimeType,
		body: Buffer.from(body),
	};

	const response = await drive.files.update({
		fileId,
		media,
		fields: "id",
	});

	if (response.status === 200) {
		return response.data.id;
	}
};

const deleteRes = async (drive: drive_v3.Drive, fileId: string) => {
	const response = await drive.files.delete({
		fileId,
	});

	if (response.status === 200) {
		return fileId;
	}
};

const getRes = async (drive: drive_v3.Drive, fileId: string) => {
	const response = await drive.files.get({
		fileId,
		alt: "media",
	});

	if (response.status === 200) {
		return response.data;
	}
};

export const ObserveDriveDir = async (vocabulary: Map<string, boolean>) => {
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

	const drive = google.drive({
		version: "v3",
		auth: client,
	});

	let folderId = (await checkIfFolderExist(drive, appFolderName)) as string;

	if (!folderId) {
		folderId = (await createRes(drive, appFolderName, folderMimeType)) as string;
	}
	let fileId = (await checkIfFileExist(drive, configFileName, folderId)) as string;
	if (!fileId) {
		fileId = (await createRes(drive, configFileName, "application/json", folderId)) as string;
	}

	if (vocabulary?.size > 0) {
		const jsonMap = JSON.stringify([...vocabulary]);
		fileId = (await updateRes(drive, fileId, "application/json", jsonMap)) as string;
		//const jsonContent = await getRes(drive, fileId);
		//const newMap = new Map(jsonContent as Array<[string, boolean]>);
	}

	return await getList(drive);
};
