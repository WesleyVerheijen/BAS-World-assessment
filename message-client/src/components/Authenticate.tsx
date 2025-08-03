import React, { useContext } from "react";
import { OrderContext } from "../data/OrderContext";
import Login from "./Login";
import RegisterForm from "./RegisterForm";

const Authenticate: React.FC<{ children: JSX.Element | JSX.Element[] }> = ({ children }) => {
    const { userSignedIn } = useContext(OrderContext);
    return userSignedIn === true ? (<>{children}</>) : (
        <>
            <Login />
            <RegisterForm />
        </>
    );
};

export default Authenticate;
