import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export default async function handler(req, res) {
    const fileId = req.query.fileId;
    const authToken = req.query.authToken;

    const oauth2Client = new OAuth2Client();
    oauth2Client.setCredentials({ access_token: authToken });
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    try {
        const response = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });

        // Ensure that response.data is a readable stream
        if (response.data && typeof response.data.pipe === 'function') {
            // Set the appropriate content type for the response
            res.setHeader('Content-Type', response.headers['content-type']);

            // Pipe the response stream directly to the response object
            response.data.pipe(res);
        } else {
            throw new Error('File data is not a readable stream');
        }
    } catch (err) {
        console.error('Error downloading file from Google Drive:', err);
        res.status(500).json({ error: err.message });
    }
}
