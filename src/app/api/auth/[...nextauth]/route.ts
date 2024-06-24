import NextAuth, { Account, CallbacksOptions, NextAuthOptions, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import { OAuthUserConfig } from "next-auth/providers/oauth";
import { OAuth2Client } from "google-auth-library";

const googleClientId = process.env.GOOGLE_CLIENT_ID as string;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
const redirectUri = JSON.parse(process.env.GOOGLE_REDIRECT_URIS as string);
const scope: string[] = JSON.parse(process.env.GOOGLE_SCOPES as string);
const secret = process.env.NEXTAUTH_SECRET;
const access_type = process.env.GOOGLE_ACCESS_TYPE || "offline";
const prompt = process.env.GOOGLE_PROMT || "none";
const response_type = process.env.GOOGLE_RESPONSE_TYPE || "code";

const GOOGLE_AUTHORIZATION_URL =
	"https://accounts.google.com/o/oauth2/v2/auth?" +
	new URLSearchParams({
		prompt: "none",
		access_type,
		response_type,
	});

async function refreshAccessToken(token: JWT) {
	try {
		if (!token.refresh_token) {
			throw new Error("refresh_token");
		}
		const url =
			"https://oauth2.googleapis.com/token?" +
			new URLSearchParams({
				client_id: googleClientId,
				client_secret: googleClientSecret,
				grant_type: "refresh_token",
				refresh_token: token.refresh_token as string,
			});

		const response = await fetch(url, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			method: "POST",
		});

		const refreshedTokens = await response.json();

		if (!response.ok) {
			throw refreshedTokens;
		}

		return {
			...token,
			access_token: refreshedTokens.access_token,
			access_token_expires: Date.now() + refreshedTokens.expires_in * 1000,
			refresh_token: refreshedTokens.refresh_token ?? token.refresh_token, // Fall back to old refresh token
		};
	} catch (error) {
		console.log(error);

		return {
			...token,
			error: "RefreshAccessTokenError",
		};
	}
}

const googleCredentialsDefined = googleClientId && googleClientSecret;

const providers = [];

if (googleCredentialsDefined) {
	const googleConfig: OAuthUserConfig<GoogleProfile> = {
		clientId: googleClientId,
		clientSecret: googleClientSecret,
		allowDangerousEmailAccountLinking: true,
		authorization: {
			params: {
				scope: scope.join(" "),
				access_type,
				prompt,
				authorizationUrl: GOOGLE_AUTHORIZATION_URL,
			},
		},
	};
	const googleProvider = GoogleProvider(googleConfig);
	providers.push(googleProvider);
}

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

export const authOptions: NextAuthOptions = {
	theme: {
		colorScheme: "light", //TODO
	},
	providers,
	callbacks,
	session: {
		strategy: "jwt",
		maxAge: 1 * 24 * 60 * 60, // 1 day
	},
	secret,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
