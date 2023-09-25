import { formatLongUrl } from "@/lib/utils";
import { toast } from "@/components/shadui/use-toast";
import { useSession } from 'next-auth/react';
import { useStore } from "@/lib/globalState";

export function useHandleUpload() {
    const { setIsPsychicLoading, setIsPsychicDoneLoading } = useStore();
    async function psychicCallback(connection) {

        console.log("Inside psychicCallback", connection)
        try {
            setIsPsychicLoading(true);
            const formData = new FormData();
            formData.append('user_id', connection.accountId);
            formData.append('connection_id', connection.connectorId);
            console.log("Inside psychicCallback", connection.connectorId)
            const response = await fetch("https://api.typefrost.com/Integrations", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setIsPsychicLoading(false);
                setIsPsychicDoneLoading(true);
                toast({
                    title: "✅ Success!",
                    description: `Added your integration!`,
                });
                return await response.json();

            } else {
                const errorData = await response.json();

                toast({
                    title: "Uh oh! Something went wrong.",
                    description: errorData.message || "Unknown error",
                });
                return null;
            }

        } catch (error) {
            setIsPsychicLoading(false);
            setIsPsychicDoneLoading(true);
            let errorMessage = "Unknown error";
            if (error instanceof TypeError && error.message === "Failed to fetch") {
                errorMessage = "Network error: Could not connect to the server";
            } else if (error.message) {
                errorMessage = error.message;
            }
            toast({
                title: "Uh oh! Something went wrong.",
                description: errorMessage,
            });
            return null;
        }
        finally {
            setIsPsychicLoading(false);
            setIsPsychicDoneLoading(true);
        }

    }


    async function uploadYoutube(youtubeUrl: string, userId: string) {
        if (!youtubeUrl || !youtubeUrl.trim()) {
            toast({
                title: "Please enter a YouTube URL",
            });
            return null;
        }

        if (!userId) {
            toast({
                title: "User ID is missing",
            });
            return null;
        }


        try {
            const formData = new FormData();
            formData.append('url', youtubeUrl);
            formData.append('user_id', userId);

            const response = await fetch("https://api.typefrost.com/youtube", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                toast({
                    title: "✅ Success!",
                    description: `Added ${formatLongUrl(youtubeUrl, 15)} into knowledge base`,
                });
                return await response.json();
            } else {
                const errorData = await response.json();

                toast({
                    title: "Uh oh! Something went wrong.",
                    description: errorData.message || "Unknown error",
                });
                return null;
            }
        } catch (error) {
            toast({
                title: "Uh oh! Something went wrong.",
                description: error.message || "Unknown error",
            });
            return null;
        }
    };


    async function uploadURL(url: string, userId: string) {
        if (!url || !url.trim()) {
            toast({
                title: "Please enter a url",
            });
            return null;
        }

        if (!userId) {
            toast({
                title: "User ID is missing",
            });
            return null;
        }

        try {
            const formData = new FormData();
            formData.append("url", url); // Append the single URL to formData
            formData.append('user_id', userId);

            const response = await fetch("https://api.typefrost.com/url", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                toast({
                    title: "✅ Success!",
                    description: `Scraped ${formatLongUrl(url, 15)} sucessfully!`, // Use the given URL instead of urls[0]
                });
                return await response.json();
            } else {
                const errorData = await response.json();
                toast({
                    title: "Uh oh! Something went wrong.",
                    description: errorData.message || "Unknown error",
                });
                return null;
            }
        } catch (error) {
            toast({
                title: "Uh oh! Something went wrong.",
                description: error.message || "Unknown error",
            });
            return null;
        }
    }

    async function uploadClipboard(clipboard: string, userId: string) {
        if (!clipboard || !clipboard.trim()) {
            toast({
                title: "Please enter a url",
            });
            return null;
        }

        if (!userId) {
            toast({
                title: "User ID is missing",
            });
            return null;
        }

        try {
            const formData = new FormData();
            formData.append("clipboard", clipboard);
            formData.append('user_id', userId);

            const response = await fetch("https://api.typefrost.com/clipboard", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                toast({
                    title: "✅ Success!",
                    description: `Added your clipboard succesfully!`,
                });
                return await response.json();
            } else {
                const errorData = await response.json();
                toast({
                    title: "Uh oh! Something went wrong.",
                    description: errorData.message || "Unknown error",
                });
                return null;
            }
        } catch (error) {
            toast({
                title: "Uh oh! Something went wrong.",
                description: error.message || "Unknown error",
            });
            return null;
        }
    }
    return { uploadYoutube, uploadURL, uploadClipboard, psychicCallback }
}
