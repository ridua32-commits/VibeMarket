import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Mail, Lock, User, Github, Chrome, Phone } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isRegister = searchParams.get('mode') === 'register';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email,
          displayName: name,
          phoneNumber,
          role,
          createdAt: serverTimestamp(),
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || email}`
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError('Login failed. If you usually use Google, please click the Google button below. Otherwise, check your password.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Check if user exists, if not create profile
      const userRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        const isAdmin = result.user.email === 'ridua32@gmail.com';
        await setDoc(userRef, {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          role: isAdmin ? 'admin' : 'buyer',
          avatarUrl: result.user.photoURL,
          createdAt: serverTimestamp(),
        });
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 bg-[#F8FAFC]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-200"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-100">
            <span className="text-white font-bold text-xl">V</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 font-display italic tracking-tight">
            {isRegister ? 'Join the Circle' : 'Welcome Back'}
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
            {isRegister ? 'Start your journey as a creator or buyer' : 'Access your vibe-coded library'}
          </p>
        </div>

        {isRegister && (
          <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl mb-8 border border-slate-100">
            <button
              onClick={() => setRole('buyer')}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl text-[10px] font-bold transition-all uppercase tracking-widest",
                role === 'buyer' 
                  ? "bg-white text-indigo-600 shadow-sm border border-slate-200" 
                  : "text-slate-400 hover:text-slate-500"
              )}
            >
              Buyer Focus
            </button>
            <button
              onClick={() => setRole('seller')}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl text-[10px] font-bold transition-all uppercase tracking-widest",
                role === 'seller' 
                  ? "bg-white text-indigo-600 shadow-sm border border-slate-200" 
                  : "text-slate-400 hover:text-slate-500"
              )}
            >
              Seller Focus
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-tight rounded-xl border border-red-100 italic">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          {isRegister && (
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 text-sm font-medium"
                  placeholder="Enter your name"
                />
              </div>
            </div>
          )}

          {isRegister && (
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 ml-1">Phone Number (WhatsApp)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 text-sm font-medium"
                  placeholder="e.g. +1234567890"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 text-sm font-medium"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 text-sm font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 mt-2"
          >
            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Secure Login'}
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-100"></span>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
            <span className="bg-white px-4 text-slate-300">Fast Connect</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-xs text-slate-600 hover:bg-slate-50 transition-all mb-6 shadow-sm"
        >
          <Chrome className="w-4 h-4" />
          Continue with Google
        </button>

        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            {isRegister ? 'Already verified?' : "New to VibeMarket?"}
          </p>
          <Link
            to={isRegister ? '/auth' : '/auth?mode=register'}
            className="text-indigo-600 font-bold text-sm tracking-tight hover:text-indigo-700 transition-colors italic font-display"
          >
            {isRegister ? 'Sign in to your account' : 'Create an account in seconds'}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
