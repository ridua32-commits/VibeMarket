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
    <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-2xl border-b border-slate-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          <div className="flex items-center gap-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-slate-900 rounded-[12px] flex items-center justify-center group-hover:bg-indigo-600 transition-all duration-300 shadow-xl shadow-indigo-100/20">
                <span className="text-white font-bold text-xl leading-none font-display">V</span>
              </div>
              <span className="text-slate-900 font-bold text-xl tracking-tight hidden lg:block font-display uppercase italic">VibeMarket</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-10">
              <Link to="/marketplace" className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">
                Assets
              </Link>
              <Link to="/marketplace?category=SaaS" className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">
                Architectures
              </Link>
              <Link to="/marketplace?category=Landing Page" className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">
                Templates
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:block relative w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search premium vibes..." 
                className="w-full pl-11 pr-4 py-2.5 border-none rounded-xl bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-100 outline-none text-xs font-medium placeholder:text-slate-300 shadow-inner transition-all"
              />
            </div>

            {user ? (
              <div className="flex items-center gap-4">
                {profile?.role === 'admin' ? (
                  <Link 
                    to="/dashboard" 
                    className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
                  >
                    <Shield className="w-3.5 h-3.5 text-indigo-400" />
                    Admin Panel
                  </Link>
                ) : profile?.role === 'seller' ? (
                  <Link 
                    to="/dashboard/sell" 
                    className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    List Asset
                  </Link>
                ) : null}
                
                <div className="relative">
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 p-1 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200">
                      {profile?.avatarUrl ? (
                        <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden py-2"
                      >
                        <div className="px-4 py-3 border-b border-slate-100 mb-2">
                          <p className="text-xs font-bold text-slate-900 truncate tracking-tight">{profile?.displayName || 'User'}</p>
                          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-0.5">{profile?.role || 'buyer'}</p>
                        </div>
                        
                        <Link 
                          to="/dashboard" 
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        
                        {profile?.role === 'buyer' && (
                          <Link 
                            to="/dashboard/purchases" 
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            My Purchases
                          </Link>
                        )}

                        <div className="h-px bg-slate-100 my-2" />
                        
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
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
              <div className="flex items-center gap-6">
                <Link to="/auth" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                  Sign In
                </Link>
                <Link 
                  to="/auth?mode=register" 
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
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
