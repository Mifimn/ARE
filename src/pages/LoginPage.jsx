// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState(''); // <-- Renamed state
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 👇 Pass emailOrUsername to signIn
      const { error: signInError } = await signIn({ emailOrUsername, password });

      if (signInError) {
        throw signInError;
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Error signing in:', error); // Keep detailed log
      // Provide a user-friendly error
      setError(error.message === 'Invalid login credentials' ? error.message : 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="min-h-screen pt-10 flex items-center justify-center bg-gradient-to-br from-dark-900 to-dark-800">
      <div className="max-w-md w-full mx-4">
        <div className="bg-dark-800 p-8 rounded-lg shadow-lg border border-dark-700">
          <div className="text-center mb-8">
             {/* --- UPDATED LOGO BLOCK: Replaced text 'ARE' with image --- */}
             <div className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 bg-dark-700 p-1">
              <img
                src="/images/logo.png"
                alt="ARE Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="text-gray-400 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500 text-center mb-4 bg-red-900/30 p-3 rounded border border-red-700">{error}</p>}

            {/* --- 👇 Update Email/Username Input --- */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="emailOrUsername">Email or Username</label>
              <input
                id="emailOrUsername" type="text" value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)}
                required autoComplete="username email" // Help browsers autofill
                className="input-field w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter email or username"
              />
            </div>
            {/* --- End Update --- */}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">Password</label>
              {/* ... password input with visibility toggle ... */}
               <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className="input-field w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10" placeholder="Enter your password"/>
                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
               </div>
            </div>

            <div className="flex items-center justify-end text-sm"> {/* Changed justify */}
                {/* Optional Remember Me removed for brevity */}
                <Link to="/forgot-password" className="text-primary-400 hover:text-primary-300">Forgot password?</Link>
             </div>

            <button type="submit" disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400"> Don't have an account?{' '} <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium"> Sign Up </Link> </p>
          </div>
        </div>
      </div>
    </div>
  );
}