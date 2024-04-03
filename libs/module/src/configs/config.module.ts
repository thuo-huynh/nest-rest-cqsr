import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PORT: Joi.number(),

        DATABASE_HOST: Joi.string(),
        DATABASE_PORT: Joi.number(),
        DATABASE_USER: Joi.string(),
        DATABASE_PASSWORD: Joi.string(),
        DATABASE_NAME: Joi.string(),
        DATABASE_SYNC: Joi.boolean(),
        DATABASE_LOGGING: Joi.boolean(),

        AWS_REGION: Joi.string(),
        AWS_ENDPOINT: Joi.string(),
        AWS_ACCESS_KEY_ID: Joi.string(),
        AWS_SECRET_ACCESS_KEY: Joi.string(),
        AWS_SQS_QUEUE_URL: Joi.string(),
      }),
    }),
  ],
})
export class ConfigModule {}
