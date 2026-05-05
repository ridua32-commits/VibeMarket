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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background selection:bg-primary/30">
      {/* Visual Side */}
      <div className="hidden lg:flex flex-col relative overflow-hidden bg-surface-elevated p-20 justify-between items-start border-r border-border">
         <div className="absolute inset-0 bg-hero-gradient opacity-20"></div>
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,242,0.05),transparent_70%)]"></div>
         <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-primary rounded-full blur-[180px] opacity-10"></div>
         <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-accent rounded-full blur-[150px] opacity-5"></div>
         
         <Link to="/" className="relative z-10 flex items-center gap-3 group">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
               <span className="text-background font-black text-2xl font-display italic">V</span>
            </div>
            <span className="text-2xl font-black text-foreground uppercase italic tracking-tighter font-display">VibeMarket</span>
         </Link>

         <div className="relative z-10 space-y-8 max-w-lg">
            <h2 className="text-5xl xl:text-7xl font-black text-foreground uppercase italic leading-[0.85] tracking-[-0.05em] font-display">
               Unlock <span className="text-glow-gradient">Elite</span> Logic systems
            </h2>
            <p className="text-lg xl:text-xl text-muted-foreground font-bold italic leading-relaxed border-l-2 border-primary/40 pl-8">
              Join the guild of 5,000+ engineers building high-performance architectures in the nebula.
            </p>
         </div>

         <div className="relative z-10 flex items-center gap-12">
            <div>
               <p className="text-3xl font-black text-foreground italic leading-none mb-1">95%</p>
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] italic">Creator Split</p>
            </div>
            <div className="w-px h-10 bg-border"></div>
            <div>
               <p className="text-3xl font-black text-foreground italic leading-none mb-1">10k+</p>
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] italic">Active Nodes</p>
            </div>
         </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-6 sm:p-12 md:p-20 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-white opacity-[0.02] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(111,0,255,0.05),transparent_70%)] pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-12 relative z-10"
        >
          <div className="text-center lg:text-left mb-10">
            <div className="lg:hidden w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-glow">
              <span className="text-background font-black text-3xl font-display italic">V</span>
            </div>
            <h1 className="text-5xl font-black text-foreground mb-3 font-display italic tracking-[-0.05em] uppercase leading-none">
              {isRegister ? 'New Deployment' : 'System Access'}
            </h1>
            <p className="text-muted-foreground text-[11px] font-black uppercase tracking-[0.4em] leading-relaxed italic">
              {isRegister ? 'Initialize your engineering identify' : 'Authorize current session tokens'}
            </p>
          </div>

          {isRegister && (
            <div className="flex gap-2 p-1.5 bg-surface rounded-full border border-border shadow-inner">
              <button
                onClick={() => setRole('buyer')}
                className={cn(
                  "flex-1 py-3 px-4 rounded-full text-[10px] font-black transition-all uppercase tracking-[0.2em] italic",
                  role === 'buyer' 
                    ? "bg-primary text-white shadow-glow" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Acquire Mode
              </button>
              <button
                onClick={() => setRole('seller')}
                className={cn(
                  "flex-1 py-3 px-4 rounded-full text-[10px] font-black transition-all uppercase tracking-[0.2em] italic",
                  role === 'seller' 
                    ? "bg-primary text-white shadow-glow" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Creator Mode
              </button>
            </div>
          )}

          {error && (
            <div className="p-5 bg-destructive/10 text-destructive text-[11px] font-black uppercase tracking-widest rounded-2xl border border-destructive/20 italic text-center animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            {isRegister && (
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4 italic">Identify Handle</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-all duration-300" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-surface border border-border rounded-3xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 text-foreground text-sm font-bold italic"
                    placeholder="Enter full name"
                  />
                </div>
              </div>
            )}

            {isRegister && (
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4 italic">Direct Comms (WhatsApp)</label>
                <div className="relative group">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-all duration-300" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-surface border border-border rounded-3xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 text-foreground text-sm font-bold italic"
                    placeholder="+1 (202) 555-0156"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4 italic">Secure Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-all duration-300" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-surface border border-border rounded-3xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 text-foreground text-sm font-bold italic"
                  placeholder="name@domain.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4 italic">Access Passkey</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-all duration-300" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-surface border border-border rounded-3xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 text-foreground text-sm font-bold italic"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-white text-background rounded-full font-black text-xl uppercase tracking-tighter hover:bg-accent transition-all shadow-glow hover:shadow-cyan-glow disabled:opacity-50 mt-4 active:scale-95 italic group"
            >
              {loading ? 'Initializing...' : isRegister ? 'Establish Node' : 'Authorize Sync'}
            </button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border"></span>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.4em] font-display">
              <span className="bg-background px-8 text-muted-foreground italic">Vibe Protocols</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-5 py-5 bg-surface-elevated border border-border rounded-full font-black text-xs text-foreground hover:bg-surface transition-all shadow-elegant group active:scale-95 uppercase italic tracking-widest"
          >
            <Chrome className="w-6 h-6 text-accent group-hover:scale-125 transition-all shadow-cyan-glow" />
            Sync with Google
          </button>

          <div className="text-center pt-8">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-4 font-display italic">
              {isRegister ? 'Already established?' : "Zero knowledge record?"}
            </p>
            <Link
              to={isRegister ? '/auth' : '/auth?mode=register'}
              className="text-foreground font-black text-lg tracking-tighter hover:text-accent transition-all italic font-display uppercase border-b-2 border-primary/20 pb-2 hover:border-accent"
            >
              {isRegister ? 'Initiate Sign in sequence' : 'Initialize New Account'}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
