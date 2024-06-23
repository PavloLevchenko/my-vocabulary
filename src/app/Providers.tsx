"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

interface IProvidersProps {
	children: React.ReactNode;
	session: Session | null;
}

export const Providers = ({ session, children }: IProvidersProps) => (
	<SessionProvider session={session}>{children}</SessionProvider>
);
