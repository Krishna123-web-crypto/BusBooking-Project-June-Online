import React, { useState, useContext } from "react";
import { AuthContext } from "./Context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [role, setRole] = useState("user"); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");   
  const [phone, setPhone] = useState("");  
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegister) {
      if (!name || !email || !password || !phone) {
        alert("All fields are required!");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];
      if (users.find(u => u.email === email)) {
        alert("User already exists! Please sign in.");
        return;
      }

      const newUser = { name, email, password, role: "user", phone };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      alert("User registration successful. Please sign in.");
      setIsRegister(false);
      setName(""); setEmail(""); setPassword(""); setPhone("");
      return;
    }

    // Sign In logic
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const admins = JSON.parse(localStorage.getItem("admins")) || [];
    let account = null;

    if (role === "admin") {
      const isPredefinedAdmin = email === "admin@example.com" && password === "admin123";
      if (isPredefinedAdmin) {
        account = { name: "Admin", email, role: "admin" };
      } else {
        account = admins.find(a => a.email === email && a.password === password);
      }
    } else {
      account = users.find(u => u.email === email && u.password === password);
    }

    if (!account) {
      alert(`Invalid ${role} credentials!`);
      return;
    }

    login(account);
    navigate(account.role === "admin" ? "/admin" : "/");
  };

  // Inline styles
  const inputStyle = { padding: "16px", fontSize: "18px", width: "350px", marginBottom: "15px", borderRadius: "6px", border: "1px solid #ccc" };
  const buttonStyle = { padding: "16px 32px", fontSize: "18px", cursor: "pointer", borderRadius: "6px", marginTop: "10px" };
  const selectStyle = { ...inputStyle, width: "360px" };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" }}>
      <h2>{isRegister ? "User Registration" : "Sign In"}</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {isRegister && (
          <>
            <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
            <input type="text" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
          </>
        )}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
        <select value={role} onChange={e => setRole(e.target.value)} style={selectStyle}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" style={buttonStyle}>{isRegister ? "Register" : "Sign In"}</button>
      </form>
      <p onClick={() => { setIsRegister(!isRegister); if (!isRegister) setRole("user"); }} style={{ cursor: "pointer", color: "blue", marginTop: "15px" }}>
        {isRegister ? "Already registered? Sign In" : "New user? Register"}
      </p>
    </div>
  );
}
