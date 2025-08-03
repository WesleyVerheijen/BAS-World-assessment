import { base64 } from "./base64";
import { base64ToArrayBuffer } from "./base64ToArrayBuffer";

export const generatePeerKey = async (publicKey: string) => {
    const arrayBuffer = base64ToArrayBuffer(publicKey);
    const peerPublicKey = await crypto.subtle.importKey(
        "spki",
        arrayBuffer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        true,
        ["encrypt"]
    );

    return peerPublicKey;

    // const exported = await crypto.subtle.exportKey("spki", peerPublicKey);
    
    // return base64(exported);
};