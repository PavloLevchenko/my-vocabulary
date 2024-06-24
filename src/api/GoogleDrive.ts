import { drive_v3 } from "googleapis";

export const appFolderName = process.env.APP_FOLDER_NAME as string;
export const appFileName = process.env.APP_FILE_NAME as string;
export const appFileType = process.env.APP_FILE_TYPE as string;

export const folderMimeType = "application/vnd.google-apps.folder";
export const spaces = "appDataFolder";

export const getList = async (drive: drive_v3.Drive) => {
	const response = await drive.files.list({
		spaces,
		fields: "files(id, name)",
	});

	if (response.status === 200) {
		return response.data.files;
	}
};

export const checkIfFolderExist = async (drive: drive_v3.Drive, name: string) => {
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

export const checkIfFileExist = async (
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

export const createRes = async (
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

export const updateRes = async (
	drive: drive_v3.Drive,
	fileId: string,
	mimeType: string,
	body: any,
) => {
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

export const deleteRes = async (drive: drive_v3.Drive, fileId: string) => {
	const response = await drive.files.delete({
		fileId,
	});

	if (response.status === 200) {
		return fileId;
	}
};

export const getRes = async (drive: drive_v3.Drive, fileId: string) => {
	const response = await drive.files.get({
		fileId,
		alt: "media",
	});

	if (response.status === 200) {
		return response.data;
	}
};
