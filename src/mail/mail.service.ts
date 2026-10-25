import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 1025,
  });

  async sendResetEmail(to: string, token: string) {
    await this.transporter.sendMail({
      from: 'noreply@shelfaware.local',
      to,
      subject: 'Reset your password',
      text: `Click the link: http://localhost:5173/password-reset?token=${token}`,
    });
  }
}
