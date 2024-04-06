import { Injectable } from '@nestjs/common';
import { pbkdf2Sync } from 'crypto';
import { IPasswordGenerator } from './password.interface';

@Injectable()
export class PasswordGeneratorService implements IPasswordGenerator {
  generateKey(secret: string): string {
    return pbkdf2Sync(secret, 'salt', 100000, 256, 'sha512').toString();
  }
}
