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
import { Mail, Lock, User, Phone, ChevronRight } from 'lucide-react';
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
      let message = err.message;
      
      if (err.code === 'auth/invalid-credential') {
        message = 'Invalid email or password. Please check your credentials and try again.';
      } else if (err.code === 'auth/user-not-found') {
        message = 'No account found with this email. Would you like to create one?';
      } else if (err.code === 'auth/wrong-password') {
        message = 'Incorrect password. If you signed up with Google, please use the Google button below.';
      } else if (err.code === 'auth/unauthorized-domain') {
        const domain = window.location.hostname;
        message = `Access Denied: Please add "${domain}" to authorized domains in your Firebase Console (Authentication > Settings > Authorized Domains).`;
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'An account with this email already exists. Try logging in instead.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password is too weak. Please use at least 6 characters.';
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
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
      let message = err.message;
      
      if (err.code === 'auth/unauthorized-domain') {
        const domain = window.location.hostname;
        message = `Unauthorized Domain: Please add "${domain}" to your Firebase Console (Authentication > Settings > Authorized Domains) to enable login.`;
      } else if (err.code === 'auth/popup-closed-by-user') {
        message = 'Google sign-in was cancelled. Please try again.';
      } else if (err.code === 'auth/popup-blocked') {
        message = 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
      }
      
      setError(message);
    } finally {
      setLoading(false);
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
               <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] italic">Creator Split</p>
            </div>
            <div className="w-px h-10 bg-border"></div>
            <div>
               <p className="text-3xl font-black text-foreground italic leading-none mb-1">10k+</p>
               <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] italic">Active Nodes</p>
            </div>
         </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-6 sm:p-12 md:p-20 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-white opacity-[0.02] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-0 animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -z-0 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-10 relative z-10"
        >
          <div className="text-center lg:text-left">
            <div className="lg:hidden w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-glow">
              <span className="text-background font-black text-3xl font-display italic">V</span>
            </div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">System Access v2.0</span>
            </motion.div>
            <h1 className="text-5xl font-black text-foreground mb-4 font-display italic tracking-[-0.05em] uppercase leading-none">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground text-sm font-medium tracking-tight max-w-[300px] mx-auto lg:mx-0">
              {isRegister ? 'Join the marketplace and start exploring elite logic systems.' : 'Login to access your personalized architecture node.'}
            </p>
          </div>

          {isRegister && (
            <div className="flex p-1 bg-surface-elevated rounded-2xl border border-border/50 backdrop-blur-sm shadow-inner group">
              <button
                onClick={() => setRole('buyer')}
                className={cn(
                  "flex-1 py-3.5 px-6 rounded-xl text-xs font-black transition-all uppercase tracking-[0.2em] italic",
                  role === 'buyer' 
                    ? "bg-white text-black shadow-lg" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Buy Mode
              </button>
              <button
                onClick={() => setRole('seller')}
                className={cn(
                  "flex-1 py-3.5 px-6 rounded-xl text-xs font-black transition-all uppercase tracking-[0.2em] italic",
                  role === 'seller' 
                    ? "bg-white text-black shadow-lg" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Sell Mode
              </button>
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center"
            >
              <p className="text-sm font-black text-red-500 uppercase tracking-[0.1em] italic">
                {error}
              </p>
            </motion.div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            {isRegister && (
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-4 italic">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-all duration-300" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-surface border border-border rounded-3xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 text-foreground text-sm font-bold italic"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            )}

            {isRegister && (
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-4 italic">WhatsApp Number</label>
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
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-4 italic">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-all duration-300" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-surface border border-border rounded-3xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 text-foreground text-sm font-bold italic"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-4 italic">Password</label>
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
              className="w-full relative group overflow-hidden rounded-2xl py-5 bg-white text-black font-black uppercase tracking-widest text-sm hover:scale-[1.01] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-glow disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed mt-8 italic"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
               <span className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      {isRegister ? 'Register Account' : 'Sign In Now'}
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
               </span>
            </button>
          </form>

          <div className="text-center py-2">
            <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 font-display italic">
              {isRegister ? 'Already have an account?' : 'Need a new identity?'}
            </p>
            <button
              onClick={() => navigate(isRegister ? '/auth' : '/auth?mode=register')}
              className="text-xs font-black text-primary hover:text-primary/80 uppercase tracking-[0.2em] transition-colors italic group"
            >
              {isRegister ? 'Login Instead' : 'Register Now'}
              <span className="block h-0.5 w-0 group-hover:w-full bg-primary transition-all duration-300 mx-auto mt-2"></span>
            </button>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 py-5 bg-surface-elevated/50 border border-border/50 rounded-2xl font-black text-xs text-foreground hover:bg-surface-elevated hover:border-primary/30 transition-all group active:scale-95 uppercase italic tracking-widest disabled:opacity-50"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="w-5 h-5 group-hover:scale-110 transition-all"
            />
            <span>{loading ? 'Processing Sync...' : 'Continue with Google'}</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
