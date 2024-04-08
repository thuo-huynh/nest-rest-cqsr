import { IEmailAdaptor } from 'src/notification/application/adaptor/email-adaptor.interface';
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailAdaptor implements IEmailAdaptor {
  constructor(private configService: ConfigService) {}

  private readonly sesClient = new SESClient({
    region: this.configService.get('AWS_REGION'),
    endpoint: this.configService.get('AWS_ENDPOINT'),
    credentials: {
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    },
  });

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    await this.sesClient.send(
      new SendEmailCommand({
        Destination: { ToAddresses: [to] },
        Source: this.configService.get('EMAIL'),
        Message: {
          Subject: { Data: subject, Charset: 'UTF-8' },
          Body: { Text: { Data: text, Charset: 'UTF-8' } },
        },
      }),
    );
  }
}
