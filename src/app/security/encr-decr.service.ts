import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncrDecrService {

  constructor() {
  }

  set(keys, value) {
    let _key = CryptoJS.enc.Utf8.parse(keys);
    let _iv = CryptoJS.enc.Utf8.parse(keys);
    console.log('encrypt keys : ' + keys);
    console.log('encrypt value : ' + value);
    let encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(value), _key, {
        keySize: 16,
        iv: _iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
    console.log('encrypt : ' + encrypted.toString());
    return encrypted.toString();
  }


  get(keys, value) {
    let _key = CryptoJS.enc.Utf8.parse(keys);
    let _iv = CryptoJS.enc.Utf8.parse(keys);
    console.log('decrypt keys : ' + keys);
    console.log('decrypt value : ' + value);
    let decrypted = CryptoJS.AES.decrypt(keys, value);
    console.log('decrypt : ' + decrypted.toString());
    return decrypted.toString();
  }

}
