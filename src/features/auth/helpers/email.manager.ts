import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Mail from 'nodemailer/lib/mailer';
@Injectable()
export class EmailManager {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      service: 'gmail',
      auth: {
        user: this.configService.get('ADMIN_EMAIL'),
        pass: this.configService.get('NODEMAILER_PASSWORD'),
      },
    });
  }

  async sendMail(
    mailDetails: Mail.Options,
    callback?: (info: SMTPTransport.SentMessageInfo) => void,
  ): Promise<void> {
    try {
      const info = await this.transporter.sendMail(mailDetails);
      callback!(info);
    } catch (e) {
      throw Error('Error during email sending');
    }
  }

  async sendRecoveryCodeEmail(userEmail: string, message: string) {
    const messageTemplate = `
            <h1>Password recovery</h1>
            <p>To finish password recovery please follow the link below:
                <h3>recovery code is <h2>${message}<h2></h3>
            </p>`;
    const options = {
      from: `Satyxa <${this.configService.get('ADMIN_EMAIL')}>`,
      to: userEmail,
      subject: 'Recovery code',
      html: messageTemplate,
    };
    try {
      await this.sendMail(options, () => {
        console.log('recovery code Email is delivered successfully');
        return true;
      });
    } catch (e) {
      throw Error('second error');
    }
  }
}
