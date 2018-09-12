####DES 加/解密

```javascript
// DES crypto加密
        encryptByDES(message){
  		  const keyHex = CryptoJS.enc.Utf8.parse(process.env.KEY_HEX);
  		  const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
  		   mode: CryptoJS.mode.ECB,
  		   padding: CryptoJS.pad.Pkcs7
  		   });
  		  return encrypted.toString();
  		},
  		
  		
  //DES解密
  		decryptByDES(ciphertext){
  		  const keyHex = CryptoJS.enc.Utf8.parse(process.env.KEY_HEX);
  		  const decrypted = CryptoJS.DES.decrypt({
  		     ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
  		   }, keyHex, {
  		     mode: CryptoJS.mode.ECB,
  		     padding: CryptoJS.pad.Pkcs7
  		  });
  		  return decrypted.toString(CryptoJS.enc.Utf8);
  		}
  ```
```process.env.KEY_HEX```  表示密钥

文档参考地址 https://blog.csdn.net/king7950/article/details/70157463