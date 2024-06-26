import NextAuth, { NextAuthOptions } from "next-auth";
import { googleProvider } from "../googleProvider";
import callbacks from "../callbacks";

const secret = process.env.NEXTAUTH_SECRET;

export const authOptions: NextAuthOptions = {
	theme: {
		colorScheme: "light", //TODO
	},
	providers: [googleProvider],
	callbacks,
	session: {
		strategy: "jwt",
		maxAge: 1 * 24 * 60 * 60, // 1 day
	},
	secret,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
