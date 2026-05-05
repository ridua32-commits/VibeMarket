import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import { TrendingUp, ShoppingCart, Tag, Star } from 'lucide-react';
import { formatPrice, cn } from '../../lib/utils';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../../lib/firebase';

export default function Overview({ user, profile }: { user: any, profile: UserProfile | null }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    platformVolume: 0,
    sellerEarnings: 0,
    activeListings: 0,
    buyerInvested: 0,
    librarySize: 0,
    loading: true
  });

  const isSeller = profile?.role === 'seller';
  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    async function fetchStats() {
      try {
        if (isAdmin) {
          try {
            const [usersSnap, listingsSnap, ordersSnap] = await Promise.all([
              getDocs(collection(db, 'users')),
              getDocs(collection(db, 'listings')),
              getDocs(collection(db, 'orders'))
            ]);

            const volume = ordersSnap.docs.reduce((sum, doc) => {
              const data = doc.data();
              return data.status === 'completed' ? sum + (data.amount || 0) : sum;
            }, 0);

            setStats(prev => ({
              ...prev,
              totalUsers: usersSnap.size,
              totalListings: listingsSnap.size,
              platformVolume: volume,
              loading: false
            }));
          } catch (err) {
            console.error('Admin stats fetch failed:', err);
            // Fallback for demo/if rules are still propagation
            setStats(prev => ({ ...prev, loading: false }));
          }
        } else if (isSeller) {
          const [listingsSnap, ordersSnap] = await Promise.all([
            getDocs(query(collection(db, 'listings'), where('sellerId', '==', user.uid))),
            getDocs(query(collection(db, 'orders'), where('sellerId', '==', user.uid)))
          ]);

          const earnings = ordersSnap.docs.reduce((sum, doc) => {
            const data = doc.data();
            return data.status === 'completed' ? sum + (data.amount || 0) : sum;
          }, 0);

          setStats(prev => ({
            ...prev,
            activeListings: listingsSnap.docs.filter(d => d.data().status === 'active').length,
            sellerEarnings: earnings,
            loading: false
          }));
        } else {
          const ordersSnap = await getDocs(query(collection(db, 'orders'), where('buyerId', '==', user.uid)));
          
          const invested = ordersSnap.docs.reduce((sum, doc) => {
            const data = doc.data();
            return data.status === 'completed' ? sum + (data.amount || 0) : sum;
          }, 0);

          setStats(prev => ({
            ...prev,
            librarySize: ordersSnap.docs.filter(d => d.data().status === 'completed').length,
            buyerInvested: invested,
            loading: false
          }));
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    }

    if (user && profile) {
      fetchStats();
    }
  }, [user, profile, isAdmin, isSeller]);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-[11px] font-black text-accent uppercase tracking-[0.4em] mb-2 italic">
            <div className="w-8 h-px bg-accent/30" />
            Control Hub
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-foreground font-display tracking-[-0.05em] leading-[0.85] uppercase italic">
            Hi, <span className="text-glow-gradient">{profile?.displayName?.split(' ')[0] || 'Maker'}!</span>
          </h1>
          <p className="text-muted-foreground text-sm font-bold italic border-l-2 border-primary/20 pl-6 mt-4">
            {isAdmin 
              ? 'Platform commander overview. System integrity at 100%.'
              : (isSeller 
                ? 'Your engineered logic is expanding across the network.' 
                : 'Manage your acquired assets and initialize new nodes.'
              )
            }
          </p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-black px-6 py-3 bg-surface border border-border text-foreground rounded-full uppercase tracking-[0.3em] shadow-elegant italic group hover:border-primary/50 transition-all">
          <div className={cn("w-2 h-2 rounded-full animate-pulse shadow-glow", 
            isAdmin ? "bg-accent" : (isSeller ? "bg-primary" : "bg-accent")
          )} />
          {isAdmin ? 'System Protocol' : (isSeller ? 'Creator Node' : 'Collector Node')}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {isAdmin ? (
          <>
            <StatCard label="Total Users" value={stats.loading ? "..." : stats.totalUsers.toString()} icon={<TrendingUp className="w-5 h-5" />} color="primary" />
            <StatCard label="Assets Deployed" value={stats.loading ? "..." : stats.totalListings.toString()} icon={<Tag className="w-5 h-5" />} color="accent" />
            <StatCard label="Network Volume" value={stats.loading ? "..." : formatPrice(stats.platformVolume)} icon={<TrendingUp className="w-5 h-5" />} color="accent" />
          </>
        ) : isSeller ? (
          <>
            <StatCard label="Total Revenue" value={stats.loading ? "..." : formatPrice(stats.sellerEarnings)} icon={<TrendingUp className="w-5 h-5" />} color="primary" />
            <StatCard label="Nodes Active" value={stats.loading ? "..." : stats.activeListings.toString()} icon={<Tag className="w-5 h-5" />} color="accent" />
            <StatCard label="Trust Score" value="99.9%" icon={<Star className="w-5 h-5" />} color="accent" />
          </>
        ) : (
          <>
            <StatCard label="Acquisition Cost" value={stats.loading ? "..." : formatPrice(stats.buyerInvested)} icon={<TrendingUp className="w-5 h-5" />} color="primary" />
            <StatCard label="Module Repository" value={stats.loading ? "..." : stats.librarySize.toString()} icon={<Tag className="w-5 h-5" />} color="accent" />
            <StatCard label="Wishlist" value="0" icon={<Star className="w-5 h-5" />} color="accent" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-12">
        <div className="bg-surface border border-border rounded-[3rem] p-10 md:p-14 relative overflow-hidden group shadow-elegant">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-black text-foreground font-display italic uppercase tracking-tighter leading-none">
                {isAdmin ? (
                  <>System <span className="text-glow-gradient">Events</span></>
                ) : (isSeller ? (
                  <>Market <span className="text-glow-gradient">Velocity</span></>
                ) : (
                  <>Acquisition <span className="text-glow-gradient">Track</span></>
                ))}
              </h2>
            </div>
            <div className="text-center py-28 bg-background/40 backdrop-blur-md border-2 border-dashed border-border rounded-[2.5rem] space-y-8 group/empty hover:border-primary/20 transition-all">
              <div className="w-24 h-24 bg-background border border-border rounded-[2rem] flex items-center justify-center mx-auto text-muted-foreground/30 shadow-inner group-hover/empty:scale-110 group-hover/empty:rotate-6 transition-all duration-500">
                <ShoppingCart className="w-10 h-10" />
              </div>
              <div className="space-y-3">
                <p className="text-foreground font-black text-xl uppercase tracking-tighter italic">Signal Empty</p>
                <p className="text-muted-foreground text-sm font-bold italic max-w-xs mx-auto">Future event transmissions will materialize here automatically.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color: 'primary' | 'accent' }) {
  return (
    <div className="bg-card-gradient border border-border rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center text-center group hover:border-primary/30 transition-all shadow-elegant relative overflow-hidden active:scale-95">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity"></div>
      <div className={cn(
        "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 transition-all group-hover:scale-110 group-hover:rotate-6 shadow-glow ring-2 ring-white/5",
        color === 'primary' ? "bg-primary text-white" : "bg-background text-accent border border-border"
      )}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-3 sm:mb-4 italic group-hover:text-foreground transition-colors">{label}</p>
      <div className="relative w-full overflow-hidden">
        <p className="text-3xl sm:text-4xl lg:text-3xl xl:text-5xl font-black text-foreground font-display italic tracking-[-0.08em] leading-tight text-glow-gradient pb-2 px-2 truncate">{value}</p>
      </div>
    </div>
  );
}
