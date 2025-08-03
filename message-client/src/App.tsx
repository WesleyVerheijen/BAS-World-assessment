import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { OrderWrapper } from "./data/OrderWrapper";
import "./assets/styles/global.less";
import "./app.less";
import APIStatus from "./components/APIStatus";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Account from "./pages/Account";
import ChatPage from "./pages/ChatPage";

const App: React.FC = () => {
  const [collapse, setCollapse] = useState<boolean>(false);
  const isUserSignedIn = (): boolean => {
    const token = localStorage.getItem("token");
    return token !== null;
  };
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("Logged out");
    // location.reload();
  };
  return (
    <Router>
      <OrderWrapper>
        <div id="app" className={collapse ? `collapse` : ""}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat/:userId" element={<ChatPage />} />
            <Route path="/login" element={<Account />} />
            <Route path="/login/register" element={<Account registration={true} />} />
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <footer>
            <APIStatus />
          </footer>
        </div>
      </OrderWrapper>
    </Router>
  );
};

export default App;
