import { useEffect } from 'react';
import { parseCookies, destroyCookie } from 'nookies';
import { toast } from "@/hooks/use-toast";

const clientId = process.env.NEXT_PUBLIC_NOTION_OAUTH_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_NOTION_OAUTH_CLIENT_SECRET;
const redirectUri = process.env.NEXT_PUBLIC_NOTION_REDIRECT_URI;

export async function getAccessToken(code) {

    const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const response = await fetch('https://api.notion.com/v1/oauth/token', {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Basic ${encoded}`,
        },
        body: JSON.stringify({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: redirectUri,
        }),
    });

    const data = await response.json();
    console.log("Data from Notion API:", data);
    return data.access_token;
}

export function getAuthURL() {
    const authURL = `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(redirectUri)}`;
    return authURL;
}

export const useNotionIntegration = (user_id, isAuthenticatedWithNotion) => {
    useEffect(() => {
        console.log("IsAuthenticatedWithNotion in Notion.tsx", isAuthenticatedWithNotion)
        if (isAuthenticatedWithNotion) {
            const accessToken = parseCookies().notion_access_token;

            const callTypeFrostApi = async () => {
                if (accessToken && !isAccessTokenSentToBackend()) { // Add a check to call the API only once
                    const formData = new FormData();
                    formData.append('access_token', accessToken);
                    formData.append('user_id', user_id);

                    const response = await fetch('https://api.typefrost.com/notion', {
                        method: 'POST',
                        body: formData,
                    });

                    if (response.ok) {
                        // Process the data or redirect the user as needed
                        console.log('Notion data sent successfully');
                        toast({
                            title: "✅ Success!",
                            description: "Notion data sent successfully",
                        });
                        setAccessTokenSentToBackend(); // Add a marker to local storage
                    } else {
                        console.error('Error sending Notion access token');
                        toast({
                            title: "❌ Error!",
                            description: "Error sending Notion access token",
                        });
                    }
                }
            };
            callTypeFrostApi();
        }

    }, [isAuthenticatedWithNotion]);
}

function isAccessTokenSentToBackend() {
    return localStorage.getItem("notion_access_token_sent") === "true";
}

function setAccessTokenSentToBackend() {
    localStorage.setItem("notion_access_token_sent", "true");
}
