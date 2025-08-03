import { JSX, useEffect, useState } from "react";
import { OrderContext, OrderContextType } from "./OrderContext";
import { BASE_URL, getRequest, postRequest, putRequest } from "../utils/api";
import { IUser } from "../api/IUser";
import { Page } from "../utils/Page";
import { useNavigate, useParams } from "react-router-dom";
import { PlainUser, User } from "../api/PlainTypes";
import { generateRSAKeyPair } from "../utils/generateRSAKeyPair";
import { IPublicKey } from "../api/IPublicKey";
import { generatePeerKey } from "../utils/generatePeerKey";
import { generateAESKey } from "../utils/generateAESKey";
import { base64 } from "../utils/base64";
import { base64ToArrayBuffer } from "../utils/base64ToArrayBuffer";
import { encryptKey } from "../utils/encryptKey";
import { ISymetricKey } from "../api/ISymetricKey";
import { IMessage } from "../api/IMessage";

interface IProps {
  children: JSX.Element | JSX.Element[];
};

export const OrderWrapper: React.FC<IProps> = ({ children } :IProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser | null>(null);
  const [users, setUsers] = useState<PlainUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [back, setBack] = useState<{ page: Page, productId?: number }[]>([]);
  const [correspondentId, setCorrespondentId] = useState<number>();
  const [correspondent, setCorrespondent] = useState<IPublicKey>();
  const [messages, setMessages] = useState<IMessage[]>([]);

  const createKeys = async (user: number) => {
    generateRSAKeyPair().then((keyPair) => {
      console.log(keyPair);
      localStorage.setItem(`privateKey-${user}`, keyPair.privateKey);
      postRequest<IPublicKey, any>(`/public-keys`, {
        public_key: keyPair.publicKey
      });
    });
  };

  const loadMessages = async () => {
    setMessages(await getRequest<IMessage[]>('/messages'));
  };

  const fetchData = async () => {
    try {
      const [userResponse, productsResponse] = await Promise.all([
        getRequest<IUser>('/auth'),
        getRequest<PlainUser[]>(`/users`),
      ]);

      setUser(userResponse);
      setUsers(productsResponse);

      !localStorage.getItem(`privateKey-${(userResponse ?? { id: '' }).id}`)
        ? createKeys((userResponse ?? { id: 0 }).id)
        : getRequest<any>(`/public-keys/${userResponse.id}`)
          .then(async publicKeyResponse => {
            // if(localStorage.getItem(`key-${correspondentId || 0}`) || !correspondentId) return;
            // const [peerKey, syncKey] = await Promise.all([generatePeerKey(publicKeyResponse.public_key), generateAESKey()]);
            // console.log('publicKeyResponse', publicKeyResponse, 'Peer', peerKey, 'AES', syncKey);

            // const privateKey = localStorage.getItem(`privateKey-`) ?? '';
            // const encryptedKey = await encryptKey(peerKey, syncKey, privateKey);

            // const symmetricKey: ISymetricKey = {
            //   receiver_id: correspondentId || 0,
            //   cypher: encryptedKey.wrappedKey,
            //   signature: encryptedKey.signature,
            //   algo: encryptedKey.algo
            // };

            // localStorage.setItem(`key-${correspondentId || 0}`, base64(syncKey));

            // console.log(encryptedKey);

            // postRequest<ISymetricKey, any>('/symmetric_keys', symmetricKey)
            //   .then(response => console.log(response));
          })
          .catch((error) => {
            console.log(error);
            console.error(error);
            createKeys((userResponse ?? { id: 0 }).id);
          });
      loadMessages();
    } catch (err) {
      setError("❌ Failed to authenticate.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getSymmetricKey = (correspondentId: number) => localStorage.getItem(`key-${correspondentId || 0}`) ?? '';
  const getMessageKey = async (correspondentId: number) => {
    console.log(getSymmetricKey(correspondentId));
    
    return await crypto.subtle.importKey(
      "raw", base64ToArrayBuffer(getSymmetricKey(correspondentId)),
      "AES-GCM", true, ["encrypt", "decrypt"]
    );
  };

  const encryptMessage = async (correspondentId: number, message: string) => {
    // encrypt
    const iv = crypto.getRandomValues(new Uint8Array(12));   // 96-bit nonce
    const cipher = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      await getMessageKey(correspondentId),
      new TextEncoder().encode(message)
    );

    const payload = new Uint8Array(iv.length + cipher.byteLength);
    payload.set(iv, 0);
    payload.set(new Uint8Array(cipher), iv.length);

    return payload.buffer;
    // return cipher;
  };

  const decryptMessage = async (correspondentId: number, payload: string): Promise<string> => {
    const data = new Uint8Array(base64ToArrayBuffer(payload));
    const iv    = data.slice(0, 12);       // first 12 bytes
    const cipher = data.slice(12);         // rest
    const key = await getMessageKey(correspondentId);

    console.log(key, cipher, iv.length, cipher.length);

    const plaintextBuf = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      cipher
    );
    
    console.log('ok');
    

    return new TextDecoder().decode(plaintextBuf);
  };
  
  const decryptKey = async (correspondentId: number, publicKey: IPublicKey, symmetricKey: ISymetricKey) => {
    // const ok = await crypto.subtle.verify(
    //   { name: "RSA-PSS", saltLength: 32 },
    //   publicKey.public_key,
    //   base64ToArrayBuffer(symmetricKey.signature),
    //   base64ToArrayBuffer(symmetricKey.cypher)
    // );

    // console.log(ok);

    const privateKey = await crypto.subtle.importKey(
      "pkcs8",
      base64ToArrayBuffer(localStorage.getItem(`privateKey-${user?.id}`) ?? ''),
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["decrypt"]
    );

    // Decrypt the session key
    const rawSessionKey = await crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKey,
      base64ToArrayBuffer(symmetricKey.cypher)
    );

    const sessionKey = await crypto.subtle.importKey(
      "raw", rawSessionKey,
      "AES-GCM", true, ["encrypt", "decrypt"]
    );

    localStorage.setItem(`key-${correspondentId}`, base64(rawSessionKey));

    console.log(sessionKey, rawSessionKey, base64(rawSessionKey));
  };
  
  const createSymmetricKey = async (correspondentId: number, publicKey: IPublicKey) => {
    const [peerKey, syncKey] = await Promise.all([generatePeerKey(publicKey.public_key), generateAESKey()]);
    console.log('publicKeyResponse', publicKey, 'Peer', peerKey, 'AES', syncKey);

    const privateKey = localStorage.getItem(`privateKey-${user.id}`) ?? '';
    console.log(privateKey);
    
    const encryptedKey = await encryptKey(peerKey, syncKey, privateKey);
    console.log(encryptKey);

    const symmetricKey: ISymetricKey = {
      receiver_id: correspondentId || 0,
      cypher: encryptedKey.wrappedKey,
      signature: encryptedKey.signature,
      algo: encryptedKey.algo
    };

    console.log(encryptedKey);

    postRequest<ISymetricKey, any>('/symmetric-keys', symmetricKey)
      .then(response => {
        console.log(response);
        localStorage.setItem(`key-${correspondentId || 0}`, base64(syncKey));
      });
  };

  const loadCorrespondent = async (id: number) => {
    setCorrespondentId(id);

    // Handshake
    if(id) {
      const [publicKeyResponse, symmetricKeyResponse] = await Promise.all([
        getRequest<IPublicKey>(`/public-keys/${id}`),
        getRequest<ISymetricKey>(`/symmetric-keys/${id}`)
      ]);

      setCorrespondent(publicKeyResponse);
      const symmetricKey = getSymmetricKey(id);
      
      console.log(publicKeyResponse, symmetricKeyResponse, symmetricKey);
      console.log((symmetricKeyResponse && !symmetricKey), (!symmetricKeyResponse && !symmetricKey));

      if(symmetricKeyResponse && !symmetricKey) decryptKey(id, publicKeyResponse, symmetricKeyResponse);
      if(!symmetricKeyResponse && !symmetricKey) createSymmetricKey(id, publicKeyResponse);
      // End of handshake
    }
  };

  const context: OrderContextType = {
    error: error,
    userName: user?.name ?? null,
    user: user ?? null,
    userSignedIn: user ? true : false,
    users: users ?? [],
    setUser: (user) => {
      setUser(user);
      fetchData();
    },
    setBack: (page, productId?: number) => {
      if(back[back.length - 1].page === page || back[back.length - 1].productId === productId) return;
      setBack([
        ...back,
        { page: page, productId: productId }
      ]);
    },
    handleBack: () => {
      const newBack = [...back];
      const moveTo = newBack.pop();
      setBack(newBack);
      navigate(moveTo?.page || '');
    },
    setCorrespondentId: loadCorrespondent,
    correspondentPublicKey: correspondent ?? null,
    sendMessage: async (message: IMessage) => {
      console.log(message, correspondentId);

      const newMessage: IMessage = {
        ...message,
        cipher: base64(await encryptMessage(correspondentId ?? 0, message.message ?? '')),
        message: undefined
      };

      console.log(newMessage);
      
      postRequest<IMessage, any>('/messages', newMessage)
        .then(response => loadMessages());
    },
    readMessage: async (message: IMessage) => {},
    messages: messages ?? [],
    loadMessages: loadMessages,
    decryptMessages: async (decryptMessages: IMessage[]) => {
      decryptMessages.forEach(async currentMessage => {
        try {
          const message = await decryptMessage(correspondentId ?? 0, currentMessage.cipher);
          console.log(message);
          
          currentMessage.message = message;
          currentMessage.created_at = new Date(currentMessage.created_at ?? new Date());
        } catch(error) {
          console.log(error);
          console.error(error);
        }
      });

      return decryptMessages;
    }
  };

  return (
    <OrderContext.Provider value={context}>
      {children}
    </OrderContext.Provider>
  );
};