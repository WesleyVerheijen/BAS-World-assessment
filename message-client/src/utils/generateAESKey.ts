import { base64 } from "./base64";

export const generateAESKey = async () => {
    const sessionKey = await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true, ["encrypt", "decrypt"]
    );

    const exported = await crypto.subtle.exportKey("raw", sessionKey);

    return exported;
};