import bcrypt from "bcryptjs";
import crypto from "crypto";

export const hashFunction: (unHashString: string) => Promise<string> = async (
  unHashString: string
) => {
  try {
    const hashedString = crypto.createHash('sha256').update(unHashString).digest('hex');

    return hashedString;
  } catch (err) {
    return "error";
  }
};

export const hashCompareFunction: (
  password: string,
  confirmPassword: string
) => Promise<boolean | undefined> = async (
  password: string,
  confirmPassword: string
) => {
  try {
    const isMatch = await new Promise((resolve, reject) => {
      // const hashPass = hashFunction(password).then((res) =>{return res})
      // const hashConfPsw = hashFunction(confirmPassword).then((res) =>{return res})
      const isMatch = password === confirmPassword
      
      // bcrypt.compare(password, confirmPassword, (err, result) => {
        // if (isMatch) {
          // reject(isMatch);
        // } else {
          resolve(isMatch);
        // }
      // });
    });

    if (isMatch) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error comparing passwords:", error);
  }
};
