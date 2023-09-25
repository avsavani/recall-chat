/* Deprecated NOT IN USE */

import { useEffect, useState } from 'react'


export const useAuth = (supabaseClient) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const session = supabaseClient.auth.getSession();
        if (session) {
            setAuthenticated(true);
        } else {
            setAuthenticated(false);
        }
        setLoading(false);
    }, []);

    return { authenticated, loading };
};
