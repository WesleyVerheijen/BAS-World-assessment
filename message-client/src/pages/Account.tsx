import React, { useContext } from "react";
import Login from "../components/Login";
import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";
import { OrderContext } from "../data/OrderContext";
import AccountDetails from "../components/AccountDetails";

const Account: React.FC<{ registration?: boolean }> = ({ registration }) => {
  const { userSignedIn } = useContext(OrderContext);
  return userSignedIn 
    ? (
      <main>
        <AccountDetails />
      </main>
    )
    : (registration 
      ? (
        <main className="login">
          <RegisterForm />
        </main>
      ) : (
        <main className="login">
          <Login />
          <center>
            <Link to="/login/register">Register</Link>
          </center>
        </main>
      )
    );
};

export default Account;