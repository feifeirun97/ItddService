import { AES, mode, pad, enc } from 'crypto-js';

export const ESCEncryptionData =
  (data, key = enc.Utf8.parse("430225216d7945f3b9407381399d4003"), encMode = mode.ECB,
    encPadding = pad.Pkcs7) => {
    let encData = data;
    if (typeof data === 'object') {
      encData = JSON.stringify(data);
    } else if (typeof data !== 'string') return null;
    
    const encrypt = AES.encrypt(encData, key, {
      mode: encMode,
      padding: encPadding,
    })
    const str = encrypt.toString()
    return str;
  }