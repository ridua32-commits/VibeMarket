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
      }
    }

    if (user) {
      fetchStats();
    }
  }, [user, isAdmin, isSeller]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display italic">
            Hi, {profile?.displayName?.split(' ')[0] || 'Maker'}!
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            {isAdmin 
              ? 'Platform commander overview. System integrity at 100%.'
              : (isSeller 
                ? 'Your vibe-coded products are reaching new creators.' 
                : 'Explore and manage your collection of high-vibe assets.'
              )
            }
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold px-4 py-1.5 bg-slate-900 text-white rounded-full uppercase tracking-widest shadow-lg shadow-slate-100">
          <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", 
            isAdmin ? "bg-indigo-400" : (isSeller ? "bg-green-400" : "bg-indigo-400")
          )} />
          {isAdmin ? 'System Admin' : (isSeller ? 'Creator Account' : 'Collector Account')}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isAdmin ? (
          <>
            <StatCard label="Total Users" value={stats.loading ? "..." : stats.totalUsers.toString()} icon={<TrendingUp className="w-4 h-4" />} color="indigo" />
            <StatCard label="Total Listings" value={stats.loading ? "..." : stats.totalListings.toString()} icon={<Tag className="w-4 h-4" />} color="slate" />
            <StatCard label="Platform Volume" value={stats.loading ? "..." : formatPrice(stats.platformVolume)} icon={<ShoppingCart className="w-4 h-4" />} color="slate" />
          </>
        ) : isSeller ? (
          <>
            <StatCard label="Earnings" value={stats.loading ? "..." : formatPrice(stats.sellerEarnings)} icon={<TrendingUp className="w-4 h-4" />} color="indigo" />
            <StatCard label="Active Listings" value={stats.loading ? "..." : stats.activeListings.toString()} icon={<Tag className="w-4 h-4" />} color="slate" />
            <StatCard label="Creator Rating" value="5.0" icon={<Star className="w-4 h-4" />} color="slate" />
          </>
        ) : (
          <>
            <StatCard label="Total Invested" value={stats.loading ? "..." : formatPrice(stats.buyerInvested)} icon={<ShoppingCart className="w-4 h-4" />} color="indigo" />
            <StatCard label="Library Size" value={stats.loading ? "..." : stats.librarySize.toString()} icon={<Tag className="w-4 h-4" />} color="slate" />
            <StatCard label="Wishlist" value="0" icon={<Star className="w-4 h-4" />} color="slate" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900 font-display italic uppercase tracking-tight">
              {isAdmin ? 'Recent Platform Activity' : (isSeller ? 'Latest Sales' : 'Latest Purchases')}
            </h2>
          </div>
          <div className="text-center py-20 bg-white/50 border border-dashed border-slate-200 rounded-2xl space-y-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-slate-200 shadow-sm border border-slate-100">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No activity found</p>
              <p className="text-slate-300 text-xs font-medium">Your activity history will appear here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color: 'indigo' | 'slate' }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col items-center text-center group hover:border-indigo-100 transition-all shadow-sm hover:shadow-md">
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm mb-6 transition-all group-hover:scale-110",
        color === 'indigo' ? "bg-indigo-600 text-white shadow-indigo-100" : "bg-slate-100 text-slate-500 border border-slate-200"
      )}>
        {icon}
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
      <p className="text-3xl font-bold text-slate-900 font-display italic tracking-tight">{value}</p>
    </div>
  );
}
