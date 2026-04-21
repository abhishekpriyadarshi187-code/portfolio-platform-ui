import { useState } from "react";
import { loginUser } from "../services/authService";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.token);
      alert("Login successful ✅");

      navigate("/profile");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container">
      {/* LEFT SIDE */}
      <div className="left">
        <h1>Abhishek Portfolio</h1>
        <h2>Why choose us?</h2>
        <p>
          Experience innovation and excellence at every step. Our platform
          delivers cutting-edge solutions tailored to your needs.
        </p>

        <ul>
          <li><span className="highlight">Seamless Integration:</span>{" "}
                Connect with your favourite tools and workflows effortlessly.</li>
          <li><span className="highlight">Advanced Security:</span>{" "}
                Your data is protected with enterprise-grade encryption and security protocols.</li>
          <li><span className="highlight">24/7 Support</span>{" "}
                Our dedicated team is always here to help you succeed.</li>
        </ul>
      </div>

      {/* RIGHT SIDE */}
      <div className="right">
        <h2>Welcome back</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            placeholder="name@example.com"
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            onChange={handleChange}
          />

          <button type="submit">Login</button>
        </form>
        <p style={{ marginTop: "10px" }}>
  Don't have an account?{" "}
  <Link to="/register">Register</Link>
</p>
      </div>
    </div>
  );
}

export default Login;