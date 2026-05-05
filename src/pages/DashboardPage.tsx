import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { UserProfile } from '../types';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Tag, 
  Settings, 
  PlusCircle, 
  TrendingUp, 
  Download,
  CreditCard,
  User,
  ExternalLink
} from 'lucide-react';
import { cn } from '../lib/utils';

// Sub-pages
import Overview from './dashboard/Overview';
import Purchases from './dashboard/Purchases';
import MyListings from './dashboard/MyListings';
import CreateListing from './dashboard/CreateListing';
import SettingsPage from './dashboard/SettingsPage';
import ManageUsers from './dashboard/ManageUsers';
import ManageListings from './dashboard/ManageListings';
import ManageOrders from './dashboard/ManageOrders';

export default function DashboardPage({ user, profile }: { user: any, profile: UserProfile | null }) {
  const location = useLocation();

  const isSeller = profile?.role === 'seller';
  const isAdmin = profile?.role === 'admin';

  const sidebarItems = [
    { label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    ...(isAdmin 
      ? [
          { label: 'Users', icon: User, path: '/dashboard/admin/users' },
          { label: 'All Listings', icon: Tag, path: '/dashboard/admin/listings' },
          { label: 'Transactions', icon: CreditCard, path: '/dashboard/admin/orders' },
        ]
      : (isSeller 
          ? [{ label: 'My Listings', icon: Tag, path: '/dashboard/listings' }]
          : [{ label: 'My Purchases', icon: ShoppingBag, path: '/dashboard/purchases' }]
        )
    ),
    { label: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 space-y-1">
            <div className="p-2 mb-4 space-y-2">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3">
                {isAdmin ? 'System Master' : (isSeller ? 'Creator Hub' : 'Collector Hub')}
              </h3>
              {isAdmin && (
                <Link
                  to="/"
                  className="flex items-center gap-2 px-3 py-1 text-[9px] font-bold text-indigo-600 hover:text-slate-900 transition-colors uppercase tracking-widest"
                >
                  <ExternalLink className="w-3 h-3" />
                  Visit Hub Front
                </Link>
              )}
            </div>
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all mb-1",
                    isActive 
                      ? "bg-white text-indigo-600 shadow-sm border border-slate-200" 
                      : "text-slate-500 hover:bg-slate-100/50 hover:text-slate-700"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", isActive ? "text-indigo-600" : "text-slate-400")} />
                  {item.label}
                </Link>
              );
            })}
            
            <div className="pt-8">
              {isSeller ? (
                <div className="bg-indigo-600 border border-indigo-500 rounded-3xl p-5 shadow-xl shadow-indigo-100">
                  <p className="text-white font-bold text-sm mb-1 font-display italic">List New Asset</p>
                  <p className="text-indigo-100 text-[10px] font-medium mb-4">Share your vibe-coded logic with the world.</p>
                  <Link
                    to="/dashboard/sell"
                    className="w-full flex items-center justify-center gap-2 bg-white text-indigo-600 text-[10px] font-bold py-3 rounded-xl hover:bg-slate-50 transition-all shadow-md focus:ring-4 focus:ring-white/20"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Publish Listing
                  </Link>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl shadow-slate-200">
                  <p className="text-white font-bold text-sm mb-1 font-display italic">Marketplace</p>
                  <p className="text-slate-400 text-[10px] font-medium mb-4">Find more vibe-coded apps to accelerate your workflow.</p>
                  <Link
                    to="/marketplace"
                    className="w-full flex items-center justify-center gap-2 bg-white text-slate-900 text-[10px] font-bold py-3 rounded-xl hover:bg-slate-50 transition-all shadow-md"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Browse Latest
                  </Link>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
          <Routes>
            <Route index element={<Overview user={user} profile={profile} />} />
            <Route path="purchases" element={<Purchases />} />
            <Route path="listings" element={<MyListings />} />
            <Route path="sell" element={<CreateListing />} />
            <Route path="edit/:id" element={<CreateListing />} />
            <Route path="settings" element={<SettingsPage profile={profile} />} />
            
            {/* Admin Routes */}
            {isAdmin && (
              <>
                <Route path="admin/users" element={<ManageUsers />} />
                <Route path="admin/listings" element={<ManageListings />} />
                <Route path="admin/orders" element={<ManageOrders />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </div>
  );
}
