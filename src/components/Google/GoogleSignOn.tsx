"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { PropsWithChildren, useState, useEffect } from "react";
import { GoogleSignContainer } from "./GoogleSignContainer";
import { ExtSession } from "./GoogleDriveSync";

const GoogleSignOn = ({ children }: PropsWithChildren) => {
	const { data, status } = useSession();
	const [loading, setLoading] = useState(false);
	const session = data as ExtSession;

	useEffect(() => {
		if (session?.error === "RefreshAccessTokenError") {
			signIn("google"); // Force sign in to hopefully resolve error
		}
	}, [session]);

	useEffect(() => {
		setLoading(status === "loading");
	}, [status]);

	if (loading) return <div> loading... please wait</div>;

	if (status === "authenticated") {
		return (
			<GoogleSignContainer
				name={"Sign out"}
				description={"Signed in as " + session?.user?.email}
				onClick={() => {
					signOut();
					setLoading(true);
				}}
			>
				{children}
			</GoogleSignContainer>
		);
	}

	return (
		<GoogleSignContainer
			name={"Sign On with Google"}
			description={"Not signed in"}
			onClick={() => {
				signIn("google");
				setLoading(true);
			}}
		></GoogleSignContainer>
	);
};

export default GoogleSignOn;
