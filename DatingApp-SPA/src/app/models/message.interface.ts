export interface Message {
  id: number;
  senderId: number;
  senderKnowAs: string;
  senderPhotoUrl: string;
  recipientId: number;
  recipientKnowAs: number;
  recipientPhotoUrl: string;
  content: string;
  messageSent: Date;
  isRead: boolean;
  dateRead: Date;
}
