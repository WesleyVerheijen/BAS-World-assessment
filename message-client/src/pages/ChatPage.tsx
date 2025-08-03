import React from "react";
import Login from "../components/Login";
import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";
import { MessageForm } from "../components/MessageForm";
import { Inbox } from "../components/Inbox";
import { Chat } from "../components/Chat";
import Authenticate from "../components/Authenticate";

const ChatPage: React.FC = () => {
  return (
    <main className="chat-page">
      <Authenticate>
        <Inbox />
        <Chat />
      </Authenticate>
    </main>
  );
};

export default ChatPage;
