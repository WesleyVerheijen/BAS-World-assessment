import React from "react";
import Login from "../components/Login";
import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";
import { MessageForm } from "../components/MessageForm";
import { Inbox } from "../components/Inbox";
import Authenticate from "../components/Authenticate";

const Home: React.FC = () => {
  return (
    <main className="home">
      <Authenticate>
        <Inbox />
      </Authenticate>
    </main>
  );
};

export default Home;
