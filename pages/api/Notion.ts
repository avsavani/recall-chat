// /pages/api/Notion.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from 'nookies';
import { getAccessToken } from '@/components/Upload/Integrations/Notion/Notion';

export default async function callback(req: NextApiRequest, res: NextApiResponse) {
    const { code } = req.query;
    if (!code) {
        return res.status(400).json({ error: 'Code parameter is missing' });
    }

    try {
        const accessToken = await getAccessToken(code as string);
        setCookie({ res }, 'notion_access_token', accessToken, { maxAge: 30 * 24 * 60 * 60, path: '/' });
        setCookie({ res }, 'notion_authenticated', 'true', { maxAge: 30 * 24 * 60 * 60, path: '/' }); // Set the authentication flag
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error exchanging code for access token:', error);
        res.status(500).json({ error: 'Error exchanging code for access token' });
    }
}