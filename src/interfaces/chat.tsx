export enum EnumStatus {
  LEAVE,
  MESSAGE,
  Join,
}
export interface IMessage {
  username: string;
  receiverName: string;
  connected: boolean;
  message: string;
  status: EnumStatus;
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
