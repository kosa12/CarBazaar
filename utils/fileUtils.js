import { promises as fsPromises } from 'fs';

export async function deleteFile(filePath) {
  try {
    await fsPromises.unlink(filePath);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}
