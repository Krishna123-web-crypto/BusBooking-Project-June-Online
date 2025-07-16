import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/SignIn.css";
export default function SignIn() {
  const [loginMethod, setLoginMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const handleSignIn = (e) => {
    e.preventDefault();
    if (loginMethod === "email") {
      if (email && password) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("user", email);
        alert(`Signed in with Email: ${email}`);
        navigate("/");
        window.location.reload(); // Reload to update NavBar
      } else {
        alert("Please enter both email and password.");
      }
    } else {
      if (!otpSent) {
        if (phone) {
          setOtpSent(true);
          alert("OTP sent to your phone (simulated)");
        } else {
          alert("Please enter phone number.");
        }
      } else {
        if (otp === "1234") {
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("user", phone);
          alert(`Signed in with Phone: ${phone}`);
          navigate("/");
          window.location.reload();
        } else {
          alert("Invalid OTP");
        }
      }
    }
  };
  return (
    <div className="signin-container">
      <h2>Sign In</h2>

      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <button
          onClick={() => setLoginMethod("email")}
          style={{
            flex: 1,
            padding: "10px",
            background: loginMethod === "email" ? "#007bff" : "#ddd",
            color: loginMethod === "email" ? "#fff" : "#000",
            border: "none",
            cursor: "pointer",
          }}
        >
          Email
        </button>
        <button
          onClick={() => {
            setLoginMethod("phone");
            setOtpSent(false);
          }}
          style={{
            flex: 1,
            padding: "10px",
            background: loginMethod === "phone" ? "#007bff" : "#ddd",
            color: loginMethod === "phone" ? "#fff" : "#000",
            border: "none",
            cursor: "pointer",
          }}
        >
          Phone
        </button>
      </div>
      <form onSubmit={handleSignIn}>
        {loginMethod === "email" ? (
          <>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </>
        ) : (
          <>
            <label>Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={otpSent}
            />
            {otpSent && (
              <>
                <label>OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="Enter OTP (1234)"
                />
              </>
            )}
          </>
        )}
        <button type="submit">
          {loginMethod === "phone" && !otpSent ? "Send OTP" : "Sign In"}
        </button>
      </form>
    </div>
  );
}



