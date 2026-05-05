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
    <div className="min-h-[calc(100vh-64px)] bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-32 space-y-2">
            <div className="p-3 mb-6 space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground px-3 italic">
                {isAdmin ? 'System Protocol' : (isSeller ? 'Creator Nexus' : 'Collector Node')}
              </h3>
              {isAdmin && (
                <Link
                  to="/"
                  className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black text-accent hover:text-foreground transition-all uppercase tracking-widest italic"
                >
                  <ExternalLink className="w-3.5 h-3.5 shadow-cyan-glow" />
                  View Public Hub
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
                    "flex items-center gap-4 px-6 py-3.5 rounded-full text-xs font-black transition-all mb-2 uppercase tracking-widest italic active:scale-95",
                    isActive 
                      ? "bg-primary text-white shadow-glow border border-white/20" 
                      : "text-muted-foreground hover:bg-surface hover:text-foreground hover:border-border border border-transparent"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-muted-foreground")} />
                  {item.label}
                </Link>
              );
            })}
            
            <div className="pt-12">
              {isSeller ? (
                <div className="bg-card-gradient border border-primary/30 rounded-[3rem] p-8 shadow-glow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-[80px] opacity-10 -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-all duration-700"></div>
                  <p className="text-foreground font-black text-lg mb-2 font-display italic tracking-tighter uppercase leading-none relative z-10">Deploy Logic</p>
                  <p className="text-muted-foreground text-[10px] font-bold mb-6 italic opacity-80 relative z-10 leading-relaxed uppercase tracking-widest">Share your engineered logic with the guild.</p>
                  <Link
                    to="/dashboard/sell"
                    className="w-full flex items-center justify-center gap-3 bg-white text-background text-[11px] font-black py-4 rounded-full hover:bg-accent transition-all shadow-glow relative z-10 uppercase italic active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4" />
                    List Asset
                  </Link>
                </div>
              ) : (
                <div className="bg-surface border border-border rounded-[3rem] p-8 shadow-elegant group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-accent rounded-full blur-[60px] opacity-5 -translate-y-1/2 translate-x-1/2"></div>
                  <p className="text-foreground font-black text-lg mb-2 font-display italic tracking-tighter uppercase leading-none">Expansion</p>
                  <p className="text-muted-foreground text-[10px] font-bold mb-6 italic leading-relaxed uppercase tracking-widest">Discover new modules to optimize your nodes.</p>
                  <Link
                    to="/marketplace"
                    className="w-full flex items-center justify-center gap-3 bg-surface-elevated border border-border text-foreground text-[11px] font-black py-4 rounded-full hover:bg-primary hover:text-white hover:border-white/20 transition-all shadow-sm shadow-primary/10 uppercase italic active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Enter Forge
                  </Link>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 bg-surface/30 backdrop-blur-xl border border-border rounded-[3.5rem] p-8 md:p-12 shadow-elegant relative overflow-hidden">
           {/* Decorative background for the content area */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-[150px] opacity-[0.03] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
           <div className="relative z-10 min-h-[600px]">
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
    </div>
  );
}
