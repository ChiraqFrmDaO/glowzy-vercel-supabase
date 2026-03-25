import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
import { createHash } from 'crypto';

const dataDir = join(process.cwd(), 'data');
const uploadsDir = join(dataDir, 'uploads');

export interface UploadedFile {
  id: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  storagePath: string;
  publicUrl: string;
}

export class LocalStorage {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://glowzy.lol') {
    this.baseUrl = baseUrl;
    // Ensure uploads directory exists
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }
  }

  async uploadFile(userId: string, file: File): Promise<UploadedFile> {
    // Validate file
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Max file size is 10MB');
    }
    
    const allowed = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) {
      throw new Error('Only PNG, JPG, GIF, WEBP allowed');
    }

    // Generate unique filename
    const ext = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const userDir = join(uploadsDir, userId);
    
    // Create user directory if it doesn't exist
    if (!existsSync(userDir)) {
      mkdirSync(userDir, { recursive: true });
    }

    const storagePath = join(userDir, fileName);
    
    // Save file to disk
    const buffer = await file.arrayBuffer();
    writeFileSync(storagePath, new Uint8Array(buffer));

    const publicUrl = `${this.baseUrl}/api/files/${userId}/${fileName}`;

    return {
      id: crypto.randomUUID(),
      fileName,
      originalName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      storagePath,
      publicUrl
    };
  }

  async deleteFile(userId: string, fileName: string): Promise<void> {
    const filePath = join(uploadsDir, userId, fileName);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }

  getPublicUrl(userId: string, fileName: string): string {
    return `${this.baseUrl}/api/files/${userId}/${fileName}`;
  }

  getFilePath(userId: string, fileName: string): string {
    return join(uploadsDir, userId, fileName);
  }
}

export const localStorage = new LocalStorage();
