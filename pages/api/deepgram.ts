// import { NextApiRequest, NextApiResponse } from 'next';
// import formidable from 'formidable';
// import aws from 'aws-sdk';
// import fs from 'fs';
// import { v4 as uuidv4 } from 'uuid';
// import { PutObjectCommand } from "@aws-sdk/client-s3";
// import s3Client from '@/core/s3';
import { supabase } from '@/lib/initSupabase';
// import { createClient } from '@supabase/supabase-js'



// export const config = {
//     api: {
//       bodyParser: false,  // Disabling Next.js's built-in body parser
//     },
//   };

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {

//     console.log("calling deepgram");
//     const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRja3dxZGJ3a294aXN1Znd2bnFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NTY3NzIyOCwiZXhwIjoyMDExMjUzMjI4fQ.tvzvtUgXLSgM_5HR9Nok2L3E7DwEi8Vnx5BIfSl9xrM'
//     const supabaseUrl = 'https://dckwqdbwkoxisufwvnqm.supabase.co'
//     const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRja3dxZGJ3a294aXN1Znd2bnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU2NzcyMjgsImV4cCI6MjAxMTI1MzIyOH0.JBzLD9MZypV64MZ846Mn3Yg1_J8ZqgBiJbL00uxBXRk'
//     const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)
//     // if (req.method === 'POST') {
//         const uniqueId = uuidv4();
//         const form = new formidable.IncomingForm();
//         form.parse(req, async (err, fields, files) => {
//             if (err) {
//                 console.error('Error parsing form:', err);
//                 return res.status(500).json({ error: err.message });
//             }

//             const file = files.files;
//             const userId = "caece279-0941-46cb-a15b-bfd3046786a9";
//             const Key = `dubmaster/${userId}/${uniqueId}/${file?.originalFilename}`;
//             const cloudFrontUrl = `https://dckwqdbwkoxisufwvnqm.supabase.co/storage/v1/object/public/sava/original_video.mp4`
//             const deepgramUrl = "https://api.deepgram.com/v1/listen?model=video&detect_language=true&diarize=true&filler_words=false&summarize=v2";

            

//             try {

//                 console.log("file type is :::",files);

//                 const { data, error } = await supabase.storage.from('sava').upload(`${uniqueId}/${file.originalFilename}`, file, {
//                     contentType: file.mimetype,
//                 })
                
                
//                 if (error) {
//                     console.error('Error uploading file:', error);
//                     return res.status(500).json({ error: error.message });
//                 }

//                 const { data: { publicUrl } } = supabase.storage.from('sava').getPublicUrl(`${uniqueId}/${file.originalFilename}`)

//                 if (error) {
//                     console.error('Error getting public URL:', error);
//                     return res.status(500).json({ error: error.message });
//                 }
//                 console.log(publicUrl);

//                 const options = {
//                     method: 'POST',
//                     headers: {
//                         accept: 'application/json',
//                         'content-type': 'application/json',
//                         Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
//                         },
//                     body: JSON.stringify({url: publicUrl})
//                     };

//             const deepgramResponse = await fetch("https://api.deepgram.com/v1/listen?model=video&detect_language=true&diarize=true&filler_words=false&summarize=v2",options)
//             .then(response => response.json())
//             .then(response => console.log(response))
//             .catch(err => console.error(err));

//             // const restructuredTranscript = restructureTranscript(deepgramResponse.data);
//             // console.log(restructuredTranscript);
//             console.log();
//             } catch (error) {
//                 console.error('Error uploading to S3:', error);
//                 return res.status(500).json({ error: 'Error uploading to S3' });    
//             }

//             // let typefrostResponse;
//             // try {
//             //     typefrostResponse = await axios.post('https://typefrost-backend-ysv2gphq4a-uw.a.run.app/clipboard', {
//             //         user_id: userId,
//             //         clipboard: restructuredTranscript,
//             //     }, {
//             //         headers: {
//             //             'Content-Type': 'application/json',
//             //         },
//             //     });
//             // } catch (error) {
//             //     console.error('Error calling Typefrost API:', error);
//             //     return res.status(500).json({ error: 'Error calling Typefrost API' });
//             // }

//             // if (typefrostResponse.status !== 200) {
//             //     console.error('Typefrost API call failed');
//             //     return res.status(500).json({ error: 'Typefrost API call failed' });
//             // }

//             // return res.status(200).json({ transcript: restructuredTranscript });
//         });
//     // }
// }

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

import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import util from 'util';
import { createClient } from '@supabase/supabase-js'
import axios from 'axios';


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


    const readFile = util.promisify(fs.readFile);
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error parsing form:', err);
            return res.status(500).json({ error: err.message });
        }
        const user_id = fields.user_id;
        const file = files.files;
        const fileBuffer = await readFile(file.filepath);


        try {

            const { data, error } = await supabase.storage.from('sava').upload(`${uniqueId}/${file.originalFilename}`, fileBuffer, {
                contentType: file.mimetype,
            })

            if (error) {
                console.error('Error uploading file:', error);
                return res.status(500).json({ error: error.message });
            }

            try {
                const { data } = supabase
                    .storage
                    .from('sava')
                    .getPublicUrl(`${uniqueId}/${file.originalFilename}`)

                console.log("This is the publicURL", data.publicUrl)


                const options = {
                                        method: 'POST',
                                        headers: {
                                            accept: 'application/json',
                                            'content-type': 'application/json',
                                            Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
                                            },
                                        body: JSON.stringify({url: data.publicUrl})
                                        };

                try {
                    const response = await fetch("https://api.deepgram.com/v1/listen?smart_format=true&punctuate=true&diarize=true&language=en&model=nova", options);
                    const deepgramResponse = await response.json();
                    const restructuredTranscript = restructureTranscript(deepgramResponse);
                    console.log(restructuredTranscript);
                    const FormData = require('form-data');
                    let formData = new FormData();
                    formData.append('clipboard', restructuredTranscript);
                    formData.append('user_id', user_id);
                    
                        try {
                        const typefrostResponse = await axios.post('https://typefrost-backend-ysv2gphq4a-uw.a.run.app/clipboard', formData, {
                            headers: formData.getHeaders()
                        });
                        } catch (err) {
                        console.error(err);
                        }
                    
                    } catch (err) {
                        console.error(err);
                    }


            } catch (error) {
                console.error('Error getting public URL:', error);
                return res.status(500).json({ error: error.message });
            }

            // const restructuredTranscript = restructureTranscript(deepgramResponse.data);
            // console.log(restructuredTranscript);
            console.log();
        } catch (error) {
            console.error('Error uploading to S3:', error);
            return res.status(500).json({ error: 'Error uploading to S3' });
        }
    });
    // }
}
    