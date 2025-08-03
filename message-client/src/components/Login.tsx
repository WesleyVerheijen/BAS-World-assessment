import { useContext, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faUser } from "@fortawesome/free-solid-svg-icons";
import { OrderContext } from "../data/OrderContext";
import { IUser } from "../api/IUser";

const Login = () => {
    const { setUser } = useContext(OrderContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    if(!setUser) return;

    const postLogin = async (token: string) => {
        localStorage.setItem("token", token);
        
        try {
            const response = await fetch("http://localhost/api/auth", {
                headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}), // Add Authorization header if token exists
                },
            });

            const responseUser: IUser = await response.json();

            console.log("User:", responseUser);
            setUser(responseUser);
        } catch (error) {
            console.error("User:", error);
        }
    };

    const handleManualLogin = async () => {
        try {
            const response = await axios.post<{ access_token: string; user: IUser; role: number }>("http://localhost/api/auth/login", {
                email,
                password,
            });

            postLogin(response.data.access_token);
            console.log("Manual login successful:", response.data);
        } catch (error) {
            console.error("Manual login error:", error);
        }
    };

    return (
        <fieldset>
            <header>
                <h2>Login</h2>
            </header>
            <div className="form-row">
                <label htmlFor="email"><FontAwesomeIcon icon={faUser} /> E-mail</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
            </div>
            <div className="form-row">
                <label htmlFor="password"><FontAwesomeIcon icon={faKey} /> Password</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
            </div>
            <footer>
                <button onClick={handleManualLogin}>Login</button>
            </footer>
        </fieldset>
    );
};

export default Login;
