export interface IPasswordGenerator {
  generateKey: (secret: string) => string;
}
