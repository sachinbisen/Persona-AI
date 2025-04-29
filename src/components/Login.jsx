import React, { useState } from "react";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified) {
        await sendEmailVerification(userCredential.user);
        setError("Please verify your email first. We've sent you a new verification link.");
        setIsLoading(false);
        return;
      }
      
      navigate("/persona");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="glass-card form-container fade-in">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
        {error && <div className="alert-error mb-4">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-full flex justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="loader-small w-4 h-4"></div>
                <span>Signing In...</span>
              </div>
            ) : "Sign In"}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-purple-400 hover:underline">
              Sign up
            </Link>
          </p>
          <p className="mt-2">
            <Link to="/forgot-password" className="text-purple-400 hover:underline">
              Forgot your password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;