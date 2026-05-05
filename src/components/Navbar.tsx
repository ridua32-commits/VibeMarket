import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { ShoppingBag, User, LogOut, Search, Plus, LayoutDashboard, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export default function Navbar() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/70 backdrop-blur-xl border-b border-border transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transition-all duration-300 shadow-glow">
                <span className="text-white font-bold text-xl leading-none font-display">V</span>
              </div>
              <span className="text-foreground font-bold text-xl tracking-tight hidden lg:block">
                VibeMarket
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to="/marketplace" className="text-[10px] font-bold text-muted-foreground hover:text-accent transition-colors uppercase tracking-[0.3em]">
                Assets
              </Link>
              <Link to="/marketplace?category=SaaS" className="text-[10px] font-bold text-muted-foreground hover:text-accent transition-colors uppercase tracking-[0.3em]">
                Architectures
              </Link>
              <Link to="/marketplace?category=Landing Page" className="text-[10px] font-bold text-muted-foreground hover:text-accent transition-colors uppercase tracking-[0.3em]">
                Templates
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden lg:block relative w-64 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                placeholder="Search premium vibes..." 
                className="w-full pl-11 pr-4 py-2 bg-surface border border-border rounded-full focus:border-primary/60 focus:ring-4 focus:ring-primary/10 outline-none text-xs font-semibold placeholder:text-muted-foreground/50 transition-all text-white"
              />
            </div>

            {user ? (
              <div className="flex items-center gap-4">
                {profile?.role === 'admin' ? (
                  <Link 
                    to="/dashboard" 
                    className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-hero-gradient text-white rounded-full text-[9px] font-bold uppercase tracking-[0.2em] shadow-glow hover:shadow-cyan-glow transition-all active:scale-[0.98]"
                  >
                    <Shield className="w-3 h-3" />
                    Admin Panel
                  </Link>
                ) : profile?.role === 'seller' ? (
                  <Link 
                    to="/dashboard/sell" 
                    className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-hero-gradient text-white rounded-full text-[9px] font-bold uppercase tracking-[0.2em] shadow-glow hover:shadow-cyan-glow transition-all active:scale-[0.98]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    List Asset
                  </Link>
                ) : null}
                
                <div className="relative">
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 p-1 border border-border rounded-xl hover:bg-surface-elevated transition-colors"
                  >
                    <div className="w-8 h-8 bg-surface rounded-lg flex items-center justify-center overflow-hidden border border-border group-hover:border-primary/50 transition-all">
                      {profile?.avatarUrl ? (
                        <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-56 bg-surface-elevated border border-border-strong rounded-2xl shadow-elegant overflow-hidden py-2 backdrop-blur-xl"
                      >
                        <div className="px-4 py-3 border-b border-border mb-2">
                          <p className="text-xs font-bold text-foreground truncate tracking-tight">{profile?.displayName || 'User'}</p>
                          <p className="text-[9px] font-bold text-accent uppercase tracking-widest mt-0.5">{profile?.role || 'buyer'}</p>
                        </div>
                        
                        <Link 
                          to="/dashboard" 
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        
                        {profile?.role === 'buyer' && (
                          <Link 
                            to="/dashboard/purchases" 
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            My Purchases
                          </Link>
                        )}

                        <div className="h-px bg-border my-2" />
                        
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <Link to="/auth" className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] hover:text-foreground transition-colors">
                  Sign In
                </Link>
                <Link 
                  to="/auth?mode=register" 
                  className="px-6 py-2.5 bg-hero-gradient text-white rounded-full text-[9px] font-bold uppercase tracking-[0.2em] shadow-glow hover:shadow-cyan-glow transition-all active:scale-[0.98]"
                >
                  Join the Elite
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
