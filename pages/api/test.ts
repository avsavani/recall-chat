import { replicate } from "@/core/replicate";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth";
import s3Client from '@/core/s3';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import axios from 'axios';
import { storeImageUtilsInDB } from "@/lib/replicate-utils/image";

interface ReplicateOutput {
    id: string;
}

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);
        const user = session?.user;
        const userId = user?.id;
        if (req.method === 'POST') {
            const { img_data, negative_prompt, uniqId } = req.body;
            console.log("img_data", img_data);
            console.log("negative_prompt", negative_prompt);

            try {
                const output = await replicate.run(
                "stability-ai/sdxl:a00d0b7dcbb9c3fbb34ba87d2d5b46c56969c84a628bf778a7fdaec30b1b99c5",
                {
                    input: {
                        prompt: img_data.prompt,
                        negative_prompt: negative_prompt,
                    }
                }
            ) as ReplicateOutput;

            const { data: pngFile } = await axios.get(output[0], { responseType: 'arraybuffer' });

            const Key = `${userId}/music/${uniqId}.png`;

            // Upload the audio file to Amazon S3 bucket
            const uploadParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key,
                Body: pngFile,
            };

            try {
                const data = await s3Client.send(new PutObjectCommand(uploadParams));

                // URL pointing to uploaded file in Amazon S3
                //const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_UPLOAD_REGION}.amazonaws.com/${Key}`

                const cloudFrontUrl = `https://${process.env.CLOUDFRONT_DISTRIBUTION_URL}/${Key}`
                console.log("cloudFrontUrl", cloudFrontUrl);
                await storeImageUtilsInDB(uniqId, userId, img_data.prompt, cloudFrontUrl);


                console.log("Inside webhook.ts--Music generation completed and uploaded to S3")

                res.status(200).json({ message: "Music generation completed and uploaded to S3", data });

            } catch (err) {
                console.log("Inside webhook.ts--Failed to upload the file to S3", err.message);
                res.status(500).json({ message: "Failed to upload the file to S3", error: err.message });
            }

            res.status(200).json({ job_id: output.id });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}