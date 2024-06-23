import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Modal } from "@/components/Modal";
import { Providers } from "@/app/Providers";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "My Vocabulary",
	description: "Vocabulary assessment",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession(authOptions);
	return (
		<html lang="en">
			<body className={inter.className}>
				<Providers session={session}>
					{children}
					<Modal />
				</Providers>
			</body>
		</html>
	);
}
