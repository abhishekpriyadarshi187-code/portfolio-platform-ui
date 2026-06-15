import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProfileBuilder from "./pages/ProfileBuilder";
import PortfolioView from "./pages/PortfolioView";
import { useEffect } from "react";
import { getTheme, setTheme } from "./utils/theme";
import ResumeBuilder from "./pages/ResumeBuilder";

function App() {
  useEffect(() => {
    const savedTheme = getTheme();
    setTheme(savedTheme);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileBuilder />
          </ProtectedRoute>
        }
      />

      <Route
        path="/portfolio"
        element={
          <ProtectedRoute>
            <PortfolioView />
          </ProtectedRoute>
        }
      />

      <Route
  path="/resume"
  element={
    <ProtectedRoute>
      <ResumeBuilder />
    </ProtectedRoute>
  }
/>
    </Routes>
  );
}

export default App;