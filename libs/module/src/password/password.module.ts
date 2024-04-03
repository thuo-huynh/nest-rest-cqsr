import { Module } from '@nestjs/common';
import { PasswordGeneratorService } from './password.service';

@Module({
  providers: [PasswordGeneratorService],
  exports: [PasswordGeneratorService],
})
export class PasswordModule {}
