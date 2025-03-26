import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Sử dụng Express để phục vụ file tĩnh (fe.html)
  app.use(express.static(join(__dirname, '..')));

  // Lấy AppService từ NestJS container
  const appService = app.get(AppService);

  // Lấy đối tượng Express underlying từ NestJS
  const expressApp = app.getHttpAdapter().getInstance();

  // Tạo API để xử lý yêu cầu chia sẻ file
  expressApp.post('/api/share', express.json(), async (req, res) => {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Email không hợp lệ!' });
    }

    try {
      // Gọi hàm shareFile từ AppService
      await appService.shareFile('1-KzPohMk6BcD1ch8zkc_ZsUhjgd3JlB0', email);
      return res.status(200).json({ message: 'Chia sẻ thành công!' });
    } catch (error) {
      console.error('Lỗi khi chia sẻ file:', error.message);
      return res.status(500).json({ message: 'Lỗi khi chia sẻ file!' });
    }
  });

  await app.listen(3000);
}
bootstrap();