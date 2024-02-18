import * as bcrypt from "bcrypt";

/**
 * Encode a password
 * @param rawPassword - the password to encode
 * @return string
 */
export const encodePassword = (rawPassword: string) => {
  return bcrypt.hashSync(rawPassword, bcrypt.genSaltSync());
}

/**
 * Compare a password
 * @param rawPassword - the password to compare
 * @param hash - the hash to compare
 * @return boolean
 */
export const comparePasswords = (rawPassword: string, hash: string) => {
  return bcrypt.compareSync(rawPassword, hash);
}
