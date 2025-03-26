import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class AppService {
  private auth;
  private drive;

  constructor() {
    this.auth = new google.auth.GoogleAuth({
      keyFile: 'service-acount.json',
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    this.drive = google.drive({ version: 'v3', auth: this.auth });
  }

  async shareFile(fileId: string, email: string): Promise<any> {
    try {
      const permission = await this.drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader', 
          type: 'user',
          emailAddress: email,
        },
        fields: 'id',
      });

      console.log(`Chia sẻ thành công với ${email}`);
      return 1;
    } catch (error) {
      console.error('Lỗi khi chia sẻ file:', error.message);
      return 2;
    }
  }
}

// Ví dụ sử dụng
const appService = new AppService();
