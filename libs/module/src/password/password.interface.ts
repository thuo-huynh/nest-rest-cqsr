export interface PasswordGenerator {
  generateKey: (secret: string) => string;
}
