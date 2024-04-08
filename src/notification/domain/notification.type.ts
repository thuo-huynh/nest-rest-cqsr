export type NotificationProperties = Readonly<{
  id: string;
  accountId: string;
  to: string;
  subject: string;
  content: string;
  createdAt: Date;
}>;

export type CreateNotificationOptions = Omit<
  NotificationProperties,
  'createdAt'
>;
