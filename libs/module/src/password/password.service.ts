import { Injectable } from '@nestjs/common';
import { PasswordGenerator } from './password.interface';
import { pbkdf2Sync } from 'crypto';

@Injectable()
export class PasswordGeneratorService implements PasswordGenerator {
  generateKey(secret: string): string {
    return pbkdf2Sync(secret, 'salt', 100000, 256, 'sha512').toString();
  }
}
