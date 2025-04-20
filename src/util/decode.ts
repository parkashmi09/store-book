// @ts-ignore
import * as CryptoJS from 'crypto-js';

const secretKey:any="target7038727772"
export function encryptString(input: string): string {
    return CryptoJS.AES.encrypt(input, secretKey).toString();
}

export function decryptString(encryptedInput: string): string {
    const decrypted = CryptoJS.AES.decrypt(encryptedInput, secretKey);
    return decrypted.toString(CryptoJS.enc.Utf8);
}
