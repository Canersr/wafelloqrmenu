import imageCompression from 'browser-image-compression';

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.5, // Compress to under 500KB for faster uploads
    maxWidthOrHeight: 1200, // Resize to a reasonable dimension
    useWebWorker: true,
    fileType: 'image/webp', // Convert to a modern, efficient format
  };

  try {
    const compressedFile = await imageCompression(file, options);
    // Return a new File object with a .webp extension
    return new File([compressedFile], `${file.name.split('.')[0]}.webp`, {
        type: 'image/webp',
        lastModified: Date.now(),
    });
  } catch (error) {
    console.error('Image compression failed:', error);
    // If compression fails for any reason, fall back to the original file
    return file;
  }
}
