import { Account, CallbacksOptions, Profile } from "next-auth";
import { refreshAccessToken } from "./googleProvider";

const callbacks: Partial<CallbacksOptions<Profile, Account>> = {
	async signIn({ account, profile }: { account: Account | null; profile?: Profile | undefined }) {
		const isAccount = account && profile;
		if (isAccount && account.provider === "google") {
			// return profile.email_verified && profile.email.endsWith("@example.com")
			return true;
		}
		return true; // Do different verification for other providers that don't have `email_verified`
	},
	async jwt({ token, user, account }) {
		// Persist the OAuth access_token to the token right after signin
		if (account && user && account.provider === "google") {
			const expires_at = account.expires_at as number;

			token.access_token = account.access_token;
			token.access_token_expires = new Date(expires_at * 1000);
			token.refresh_token = account.refresh_token;
			//console.log(account.refresh_token);
			return token;
		}
		// Return previous token if the access token has not expired yet
		if (Date.now() < (token.access_token_expires as unknown as number)) {
			return token;
		}
		// Access token has expired, try to update it
		return refreshAccessToken(token);
	},
	async session({ session, token }) {
		// Send properties to the client, like an access_token from a provider.
		const access_token = token.access_token as string;
		const refresh_token = token.refresh_token as string;

		return {
			...session,
			user: {
				...session.user,
				refresh_token,
				access_token,
			},
			error: token.error,
		};
	},
};

export default callbacks;
