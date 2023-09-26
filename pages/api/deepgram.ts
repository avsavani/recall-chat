import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import aws from 'aws-sdk';
import fs from 'fs';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from '@/core/s3';

export const config = {
    api: {
      bodyParser: false,  // Disabling Next.js's built-in body parser
    },
  };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    console.log("calling deepgram");

    // if (req.method === 'POST') {
        const uniqueId = uuidv4();
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error parsing form:', err);
                return res.status(500).json({ error: err.message });
            }

            const { userId } = fields;
            const file = files.file_upload;



            console.log(files);

            const s3 = new aws.S3();
            const Key = `dubmaster/${userId}/${uniqueId}/${file?.originalFilename}`;
            const params = {
                Bucket: 'hypercharged',
                Key: Key,
                Body: fs.createReadStream(file?.filepath),
            };

            console.log(params);

            let uploaded;

            try {
                uploaded = await s3Client.send(new PutObjectCommand(params));
            } catch (error) {
                console.error('Error uploading to S3:', error);
                return res.status(500).json({ error: 'Error uploading to S3' });    
            }
            
            const cloudFrontUrl = `https://${process.env.CLOUDFRONT_DISTRIBUTION_URL}/${Key}`
            const deepgramUrl = `https://api.deepgram.com/v1/listen?smart_format=true&diarize=true&language=en&model=nova`;
            let deepgramResponse;
            try {

                deepgramResponse = await axios.post(deepgramUrl, {
                    url: cloudFrontUrl,
                }, {
                    headers: {
                        'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
                    },
                });
            } catch (error) {
                console.error('Error calling Deepgram API:', error);
                return res.status(500).json({ error: 'Error calling Deepgram API' });
            }

            if (deepgramResponse.status !== 200) {
                console.error('Deepgram API call failed');
                return res.status(500).json({ error: 'Deepgram API call failed' });
            }
            console.log(deepgramResponse.status);
            const restructuredTranscript = restructureTranscript(deepgramResponse.data);

            let typefrostResponse;
            try {
                typefrostResponse = await axios.post('https://typefrost-backend-ysv2gphq4a-uw.a.run.app/clipboard', {
                    user_id: userId,
                    clipboard: restructuredTranscript,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            } catch (error) {
                console.error('Error calling Typefrost API:', error);
                return res.status(500).json({ error: 'Error calling Typefrost API' });
            }

            if (typefrostResponse.status !== 200) {
                console.error('Typefrost API call failed');
                return res.status(500).json({ error: 'Typefrost API call failed' });
            }

            return res.status(200).json({ transcript: restructuredTranscript });
        });
    // }
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


