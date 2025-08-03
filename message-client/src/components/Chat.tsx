import React, { useContext, useEffect } from "react";
import { OrderContext } from "../data/OrderContext";
import { useParams } from "react-router-dom";
import { MessageForm } from "./MessageForm";
import '../assets/styles/Chat.less';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export const Chat: React.FC = () => {
    const { users, setCorrespondentId, messages, decryptMessages } = useContext(OrderContext);
    const userId = parseInt(useParams().userId ?? '');

    const chatMessages = messages?.filter(message => message.sender_id === userId || message.recipient_id === userId) ?? [];

    useEffect(() => {
        (setCorrespondentId ?? (() => {}))(userId);
    }, [userId])

    const showDate = (date: Date) => {
        return `${date.getHours()}:${date.getMinutes()}`;
    };

    decryptMessages ? decryptMessages(chatMessages) : null;

    chatMessages.sort((a, b) => a.created_at - b.created_at);

    console.log(chatMessages, messages);

    return (
        <div className="chat">
            <header title={localStorage.getItem(`key-${userId}`) ?? ''}>
                {((users??[]).find(user => user.id == userId)??{ name: '' }).name}
            </header>
            <div className="log">
                {chatMessages?.map(message => (
                    <div key={message.id} className={message.sender_id === userId ? 'received' : 'sent'}>
                        <span className="date">{showDate(new Date(message?.created_at))}</span>
                        <div className="cipher">{message.cipher}</div>
                        <div className="message">{message.message}</div>
                        <span className="sent-as">
                            <FontAwesomeIcon icon={message.read_once ? faEyeSlash : faClock} />
                        </span>
                        <span className="expires">{message.expires_at}</span>
                    </div>
                ))}
            </div>
            <MessageForm />
        </div>
    );
}