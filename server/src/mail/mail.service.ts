import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { reset_password, verify_email } from './template';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(
    email: string[],
    rememberToken: string,
  ): Promise<void> {
    await this.mailerService.sendMail(verify_email(rememberToken, email));
  }

  async sendPasswordResetEmail(
    email: string[],
    resetToken: string,
  ): Promise<void> {
    await this.mailerService.sendMail(reset_password(resetToken, email));
  }
}
