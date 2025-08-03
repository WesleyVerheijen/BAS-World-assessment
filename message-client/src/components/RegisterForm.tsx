import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey, faUser } from "@fortawesome/free-solid-svg-icons";

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: 1, // Default role (adjust as needed)
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post("http://localhost/api/auth/register", formData);
      console.log("User registered:", response.data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed.");
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="register-form">
      <form onSubmit={handleSubmit}>
        <fieldset>
          <header>
            <h2>Register</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">✅ Registration successful!</p>}
          </header>
          <div className="form-row">
            <label htmlFor="name"><FontAwesomeIcon icon={faUser} /> Name</label>
            <div className="field">
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="email"><FontAwesomeIcon icon={faEnvelope} /> E-mail</label>
            <div className="field">
              <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="password"><FontAwesomeIcon icon={faKey} /> Password</label>
            <div className="field">
              <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required />
            </div>
          </div>

          {/* <div>
            <label>Role:</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value={1}>Customer</option>
              <option value={2}>Management</option>
              <option value={3}>Operator</option>
            </select>
          </div> */}

          <footer>
            <button type="submit">Register</button>
          </footer>
        </fieldset>
      </form>
    </div>
  );
};

export default RegisterForm;
