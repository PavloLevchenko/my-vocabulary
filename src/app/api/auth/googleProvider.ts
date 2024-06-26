import { JWT } from "next-auth/jwt";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth";

const googleClientId = process.env.GOOGLE_CLIENT_ID as string;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
const scope: string[] = JSON.parse(process.env.GOOGLE_SCOPES as string);
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

const googleCredentialsDefined = googleClientId && googleClientSecret;

export let googleProvider: OAuthConfig<GoogleProfile>;

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
	googleProvider = GoogleProvider(googleConfig);
}

export async function refreshAccessToken(token: JWT) {
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
