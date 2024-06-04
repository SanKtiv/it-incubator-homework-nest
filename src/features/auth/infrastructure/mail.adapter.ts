import nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailAdapter {
  async sendConfirmationCode(email: string, code: string) {
    const message = this.messageRegistration(code);

    await this.mailTransporter(email, message);
  }

  async sendRecoveryConfirmationCode(email: string, code: string) {
    const message = this.messageRecovery(code);

    await this.mailTransporter(email, message);
  }

  messageRegistration(code: string) {
    return (
      '<h1>Thank for your registration</h1>\n' +
      ' <p>To finish registration please follow the link below:\n' +
      `     <a href=https://somesite.com/confirm-email?code=${code}>complete registration</a>\n` +
      ' </p>'
    );
  }

  messageRecovery(code: string) {
    return (
      '<h1>Password recovery</h1>\n' +
      ' <p>To finish password recovery please follow the link below:\n' +
      `     <a href=https://somesite.com/password-recovery?recoveryCode=${code}>recovery password</a>\n` +
      ' </p>'
    );
  }

  async mailTransporter(email: string, message: string) {
    const options = {
      from: 'Aleksandr <aleksandr.mail.test@gmail.com>',
      to: email,
      subject: 'confirmation registration',
      html: message,
    };

    const transport = {
      service: 'gmail',
      auth: {
        user: 'aleksandr.mail.test@gmail.com',
        pass: 'rglgkegtcyunuxds',
      },
    };

    const transporter = nodemailer.createTransport(transport);

    return transporter.sendMail(options);
  }
}
