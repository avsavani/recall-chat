import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import aws from 'aws-sdk';
import fs from 'fs';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const uniqueId = uuidv4();
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const { input_language, userId } = fields;
            const file = files.file_upload;

            aws.config.update({ region: process.env.S3_UPLOAD_REGION, accessKeyId: process.env.S3_ACCESS_KEY, secretAccessKey: process.env.S3_ACCESS_SECRET });
            const s3 = new aws.S3();
            const params = {
                Bucket: 'hypercharged',
                Key: `dubmaster/${userId}/${uniqueId}/${file.name}`,
                Body: fs.createReadStream(file.path),
                ACL: 'public-read',
            };

            try {
                const uploaded = await s3.upload(params).promise();
                const deepgramUrl = `https://api.deepgram.com/v1/listen?smart_format=true&diarize=true&language=${input_language}&model=base`;
                const deepgramResponse = await axios.post(deepgramUrl, {
                    url: uploaded.Location,
                }, {
                    headers: {
                        'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
                    },
                });

                if (deepgramResponse.status !== 200) {
                    throw new Error('Deepgram API call failed');
                }
                
                const restructuredTranscript = restructureTranscript(deepgramResponse.data);
                return res.status(200).json(restructuredTranscript);

            } catch (error) {
                console.error(error);
                res.status(500).json({ error: error.message });
            }
        });
    }
}

function restructureTranscript(transcript: any) {
    const alternative = transcript['results']['channels'][0]['alternatives'][0];
    const paragraphs = alternative['paragraphs']['paragraphs'];
    let continuousSpeaker: string | null = null;
    let newParagraph = { 'text': '', 'start': null, 'end': null, 'speaker': null };
    let finalTranscript = '';

    for (let paragraph of paragraphs) {
        if (paragraph['speaker'] !== continuousSpeaker) {
            if (continuousSpeaker !== null) {
                finalTranscript += newParagraph['speaker'] + ': ' + newParagraph['text'] + '\n';
            }
            newParagraph = { 'text': '', 'start': paragraph['sentences'][0]['start'], 'end': null, 'speaker': paragraph['speaker'] };
            continuousSpeaker = paragraph['speaker'];
        }
        const text = paragraph['sentences'].map((sent: any) => sent['text']).join(" ");
        newParagraph['text'] += " " + text;
        newParagraph['end'] = paragraph['sentences'][paragraph['sentences'].length - 1]['end'];
    }
    if (newParagraph !== null) {
        finalTranscript += newParagraph['speaker'] + ': ' + newParagraph['text'] + '\n';
    }
    return finalTranscript;
}