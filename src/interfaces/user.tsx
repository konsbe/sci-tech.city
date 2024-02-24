export type UserInfo = {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePicture: string | ArrayBuffer | null;
};

export type Base64<imageType extends string> =
  `data:image/${imageType};base64${string}`;
