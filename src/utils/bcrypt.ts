import bcrypt from "bcryptjs";

export const hashFunction: (unHashString: string) => Promise<string> = async (
  unHashString: string
) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(unHashString, salt);
    return hash;
  } catch (err) {
    return "error";
  }
};

export const hashCompareFunction: (
  password: string,
  hashedPassword: string
) => Promise<boolean | undefined> = async (
  password: string,
  hashedPassword: string
) => {
  try {
    const isMatch = await new Promise((resolve, reject) => {
      bcrypt.compare(password, hashedPassword, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
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
