
'use server';
/**
 * @fileOverview A server-side flow to securely generate a signature for Cloudinary uploads.
 *
 * THIS FLOW IS CURRENTLY NOT IN USE. The application has been switched to an 'unsigned'
 * upload method which uses an upload_preset on the client-side and does not
 * require a server-side signature. This simplifies the process and avoids
 * environment variable issues.
 *
 * - signCloudinaryUpload - A function that returns a signature and other parameters needed for a signed upload.
 * - SignCloudinaryUploadOutput - The return type for the signCloudinaryUpload function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';

const SignCloudinaryUploadOutputSchema = z.object({
  signature: z.string().describe('The generated signature for the upload.'),
  timestamp: z.number().describe('The timestamp used for the signature.'),
  apiKey: z.string().describe('The Cloudinary API key.'),
  cloudName: z.string().describe('The Cloudinary cloud name.'),
});

export type SignCloudinaryUploadOutput = z.infer<
  typeof SignCloudinaryUploadOutputSchema
>;

export async function signCloudinaryUpload(): Promise<SignCloudinaryUploadOutput> {
  return signCloudinaryUploadFlow();
}

const signCloudinaryUploadFlow = ai.defineFlow(
  {
    name: 'signCloudinaryUploadFlow',
    inputSchema: z.void(),
    outputSchema: SignCloudinaryUploadOutputSchema,
  },
  async () => {
    // Load environment variables at the start of the flow
    config();

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Cloudinary environment variables missing. Check your .env file.');
      throw new Error(
        'Cloudinary API Key, Secret, or Cloud Name is not configured in environment variables.'
      );
    }
    
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
      },
      apiSecret
    );

    return {
      signature,
      timestamp,
      apiKey,
      cloudName,
    };
  }
);
