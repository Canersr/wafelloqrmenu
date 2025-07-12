'use server';
/**
 * @fileOverview A server-side flow to securely generate a signature for Cloudinary uploads.
 *
 * - signCloudinaryUpload - A function that returns a signature and other parameters needed for a signed upload.
 * - SignCloudinaryUploadOutput - The return type for the signCloudinaryUpload function.
 */

// IMPORTANT: Load environment variables at the very beginning
import { config } from 'dotenv';
config();

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { v2 as cloudinary } from 'cloudinary';

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
    // Read variables inside the flow to ensure they are loaded at runtime
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    // Check for variables and configure Cloudinary inside the flow
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
