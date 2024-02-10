export enum EnumStatus {
  LEAVE,
  MESSAGE,
  JOIN,
  CALLOFFER,
  CALLACCEPTED,
  CANDIDATE,
  CALLREJECTED,
  CALLENDED
}
export interface IMessage {
  senderName: string;
  date: Date;
  message: string;
  receiverName: string;
  status: string;
}
export type TypeChat = IMessage[];
export type IUserProps = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  userId: string;
};
export type TypeChats = { [key: string]: TypeChat };

export type ChatItem = {
  [key: string]: { offer: MediaStream }; // Replace YourOfferType with the actual type of 'offer'
};
