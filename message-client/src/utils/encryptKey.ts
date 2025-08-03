import { base64 } from "./base64";
import { base64ToArrayBuffer } from "./base64ToArrayBuffer";

export const encryptKey = async (peerKey: CryptoKey, syncKey: ArrayBuffer, privateKeyString: string) => {
    const wrappedKey = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        peerKey,
        syncKey
    );

    const privateKey = await crypto.subtle.importKey(
        "pkcs8",
        base64ToArrayBuffer(privateKeyString),
        {
            name: "RSA-PSS",
            hash: "SHA-256",
        },
        true,
        ["sign"]
    );

    const signature = await crypto.subtle.sign(
        { name: "RSA-PSS", saltLength: 32 },
        privateKey,
        wrappedKey
    );

    return { wrappedKey: base64(wrappedKey), signature: base64(signature), algo: 'AES-256-GCM' };
};