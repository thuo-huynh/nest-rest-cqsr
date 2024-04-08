export interface IEmailAdaptor {
  sendEmail: (email: string, subject: string, text: string) => Promise<void>;
}
