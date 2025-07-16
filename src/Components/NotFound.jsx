import { Link } from "react-router-dom";
import "../assets/NotFound.css";
export default function NotFound() {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-message">Oops! Page not found.</p>
      <Link to="/" className="notfound-button">Go to Home</Link>
    </div>
  );
}
