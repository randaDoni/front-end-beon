import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import
import "./login.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ init navigator

  const handleLogin = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);
      setError("");
      const { access_token } = response.data;
      localStorage.setItem("token", access_token);

      // ✅ Arahkan ke halaman home
      navigate("/");

    } catch (err) {
      console.error(err);
      setError("Email atau password salah.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit">Login</button>
        {/* <p className="register-link">
          Don't have an account? <a href="/register">Register</a>
        </p> */}
      </form>
    </div>
  );
};

export default Login;
