import { useState } from "react";
import { registerUser } from "../services/authService";
import "./Login.css"; // reuse same CSS
import { Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(form);
      console.log(res);
      alert("Registration successful ✅");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container">
      {/* LEFT SIDE (same as login) */}
      <div className="left">
        <h1>Abhishek Portfolio</h1>
        <h2>Why choose us?</h2>
        <p>
          Experience innovation and excellence at every step. Our platform
          delivers cutting-edge solutions tailored to your unique needs.
        </p>

        <ul>
          <li>Seamless Integration</li>
          <li>Advanced Security</li>
          <li>24/7 Support</li>
        </ul>
      </div>

      {/* RIGHT SIDE */}
      <div className="right">
        <h2>Create an account</h2>
        <p>Enter your information to get started</p>

        <form onSubmit={handleSubmit}>
          <input
            name="fullName"
            placeholder="John Doe"
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="name@example.com"
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Create a strong password"
            onChange={handleChange}
          />

          <button type="submit">Register</button>
        </form>

        <p style={{ marginTop: "10px" }}>
            Already have an account?{" "}
            <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;