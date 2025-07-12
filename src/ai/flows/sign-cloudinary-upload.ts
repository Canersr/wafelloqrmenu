'use server';
/**
 * @fileOverview A server-side flow to securely generate a signature for Cloudinary uploads.
 *
 * - signCloudinaryUpload - A function that returns a signature and other parameters needed for a signed upload.
 * - SignCloudinaryUploadOutput - The return type for the signCloudinaryUpload function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with credentials from environment variables
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

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
    if (!apiKey || !apiSecret || !cloudName) {
      throw new Error(
        'Cloudinary API Key, Secret, or Cloud Name is not configured in environment variables.'
      );
    }
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
