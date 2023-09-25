import { useStore } from "@/lib/globalState";
import { useRouter } from 'next/router';

export function SearchInputHelpers() {
    const { setCurrentChatThread, chatClicked, setChatClicked, setChatHistory, setFetchedMessages, selectedThreadId, setSelectedThreadId } = useStore();
    const router = useRouter();

    function onButtonClick() {
        setChatClicked(true);
        setCurrentChatThread(null);
        setSelectedThreadId(null);
        setFetchedMessages([]);
        setChatHistory([]);
        router.push('/dashboard');
    }



    return { onButtonClick }
}