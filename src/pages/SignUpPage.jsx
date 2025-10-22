// src/pages/SignUpPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function SignUpPage() {
  const [fullName, setFullName] = useState(''); // <-- Add state
  const [username, setUsername] = useState(''); // <-- Add state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // Optional: Add username validation (length, characters) here

    setLoading(true);

    try {
      // 👇 Pass fullName and username to signUp
      const { data, error: signUpError } = await signUp({
        email,
        password,
        fullName, // Pass new data
        username  // Pass new data
      });

      if (signUpError) {
        // Handle specific errors like username already taken if Supabase returns them
        if (signUpError.message.includes('duplicate key value violates unique constraint "profiles_username_key"')) {
            throw new Error(`Username "${username}" is already taken.`);
        }
        throw signUpError;
      }

      alert('Sign up successful! Check your email if confirmation is required.');
      navigate('/login');

    } catch (error) {
      console.error('Error signing up:', error.message);
      setError(error.message || 'Failed to sign up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-10 flex items-center justify-center bg-gradient-to-br from-dark-900 to-dark-800">
      <div className="max-w-md w-full mx-4">
        <div className="bg-dark-800 p-8 rounded-lg shadow-lg border border-dark-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">ARE</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
            <p className="text-gray-400 mt-2">Join Africa Rise Esports</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500 text-center mb-4 bg-red-900/30 p-3 rounded border border-red-700">{error}</p>}

            {/* --- 👇 Add Full Name Input --- */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="fullName">Full Name</label>
              <input
                id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                required autoComplete="name"
                className="input-field w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your full name"
              />
            </div>
            {/* --- End Full Name Input --- */}

            {/* --- 👇 Add Username Input --- */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="username">Username</label>
              <input
                id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                required autoComplete="username" pattern="^[a-zA-Z0-9_]{3,}$" // Example pattern: letters, numbers, underscore, min 3 chars
                title="Username must be at least 3 characters and can only contain letters, numbers, and underscores."
                className="input-field w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Choose a unique username"
              />
            </div>
            {/* --- End Username Input --- */}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">Email</label>
              <input
                id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required autoComplete="email"
                className="input-field w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Inputs remain the same */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">Password</label>
              {/* ... password input with visibility toggle ... */}
               <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" minLength="6" className="input-field w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10" placeholder="Create a password (min. 6 chars)" />
                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
               </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="confirmPassword">Confirm Password</label>
              {/* ... confirm password input with visibility toggle ... */}
               <div className="relative">
                <input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" className="input-field w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10" placeholder="Confirm your password"/>
                 <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white">{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
               </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400"> Already have an account?{' '} <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium"> Log In </Link> </p>
          </div>
        </div>
      </div>
    </div>
  );
}