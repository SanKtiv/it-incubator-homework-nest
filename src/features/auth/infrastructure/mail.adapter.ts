import nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailAdapter {
  async sendConfirmationCode(email: string, code: string) {
    const options = this.mailOptions(email, code);
    const transporter = nodemailer.createTransport(this.mailTransport());
    await transporter.sendMail(options);
  }

  message(code: string) {
    return (
      '<h1>Thank for your registration</h1>\n' +
      ' <p>To finish registration please follow the link below:\n' +
      `     <a href=https://somesite.com/confirm-email?code=${code}>complete registration</a>\n` +
      ' </p>'
    );
  }

  mailOptions(email: string, code: string) {
    return {
      from: 'Aleksandr <aleksandr.mail.test@gmail.com>',
      to: email,
      subject: 'confirmation registration',
      html: this.message(code),
    };
  }

  mailTransport() {
    return {
      service: 'gmail',
      auth: {
        user: 'aleksandr.mail.test@gmail.com',
        pass: 'rglgkegtcyunuxds',
      },
    };
  }
}
