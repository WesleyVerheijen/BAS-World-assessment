import { base64 } from "./base64";

export const generateRSAKeyPair = async () => {
  const keyPair = await crypto.subtle.generateKey(
    { name: "RSA-OAEP", modulusLength: 4096, publicExponent: new Uint8Array([1,0,1]), hash: "SHA-256" },
    true,
    ["encrypt", "decrypt"]
  );
  const [exportedPublic, exportedPrivate] = await Promise.all([
    crypto.subtle.exportKey("spki", keyPair.publicKey), 
    crypto.subtle.exportKey("pkcs8", keyPair.privateKey)
  ]);
  
  return { publicKey: base64(exportedPublic), privateKey: base64(exportedPrivate) };
}