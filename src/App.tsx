import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState, createContext, useContext } from 'react';
import { auth, db } from './lib/firebase';
import { UserProfile } from './types';

// Pages
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import ListingPage from './pages/ListingPage';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import Navbar from './components/Navbar';

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      if (authUser) {
        const docRef = doc(db, 'users', authUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          // Auto-admin for the owner email
          if (authUser.email === 'ridua32@gmail.com' && data.role !== 'admin') {
            data.role = 'admin';
          }
          setProfile(data);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl mb-4 animate-bounce shadow-lg shadow-indigo-100 flex items-center justify-center">
            <span className="text-white font-bold">V</span>
          </div>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">VibeMarket Loading</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      <Router>
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-indigo-600 selection:text-white font-sans">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/listing/:id" element={<ListingPage />} />
              <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
              <Route path="/dashboard/*" element={user ? <DashboardPage user={user} profile={profile} /> : <Navigate to="/auth" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}
