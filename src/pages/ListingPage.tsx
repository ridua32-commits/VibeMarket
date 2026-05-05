import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import { useAuth } from '../App';
import { Listing, Review } from '../types';
import { formatPrice } from '../lib/utils';
import { 
  Star, Shield, Zap, Globe, Github, Terminal, CheckCircle2, MessageCircle, 
  Mail, Loader2, User, ExternalLink, Layout, Bot, Server, Database, 
  Layers, Code2, Smartphone, CreditCard, Lock, Box, Edit2, LogIn, UserPlus
} from 'lucide-react';
import { motion } from 'motion/react';

// Common tech icons mapping
const TECH_ICONS: { [key: string]: React.ReactNode } = {
  'React': <Zap className="w-4 h-4" />,
  'Next.js': <Globe className="w-4 h-4" />,
  'Tailwind': <Layout className="w-4 h-4" />,
  'OpenAI': <Bot className="w-4 h-4" />,
  'Supabase': <Database className="w-4 h-4" />,
  'Firebase': <Database className="w-4 h-4" />,
  'TypeScript': <Code2 className="w-4 h-4" />,
  'Node.js': <Server className="w-4 h-4" />,
  'Prisma': <Layers className="w-4 h-4" />,
  'Vite': <Zap className="w-4 h-4 text-yellow-400" />,
  'Expo': <Smartphone className="w-4 h-4" />,
  'Stripe': <CreditCard className="w-4 h-4" />,
  'Auth.js': <Lock className="w-4 h-4" />,
  'PostgreSQL': <Database className="w-4 h-4" />,
  'Docker': <Box className="w-4 h-4" />,
};

export default function ListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [sellerInfo, setSellerInfo] = useState<{ email: string; displayName: string; avatarUrl?: string; phoneNumber?: string } | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      const path = `listings/${id}`;
      try {
        const docRef = doc(db, 'listings', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as Listing;
          setListing({ id: docSnap.id, ...data } as Listing);
          
          // Fetch seller info
          try {
            const sellerRef = doc(db, 'users', data.sellerId);
            const sellerSnap = await getDoc(sellerRef);
            if (sellerSnap.exists()) {
              const sData = sellerSnap.data();
              setSellerInfo({
                email: sData.email,
                displayName: sData.displayName || 'Vibe Creator',
                avatarUrl: sData.avatarUrl,
                phoneNumber: sData.phoneNumber
              });
            }
          } catch (e) {
            console.error("Error fetching seller info:", e);
          }
        } else {
          // Check placeholder data for demo
          const placeholder = PLACEHOLDER_LISTINGS.find(l => l.id === id);
          if (placeholder) {
            setListing(placeholder);
          } else {
            navigate('/marketplace');
          }
        }
      } catch (err) {
        handleFirestoreError(auth, err, OperationType.GET, path);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, navigate]);

  const handleConnect = () => {
    if (!listing) return;
    
    // Use seller phone if available, otherwise fallback
    const phone = sellerInfo?.phoneNumber || '1234567890';
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hi, I'm interested in your vibe-coded asset: ${listing.title}.\n\nListing Link: ${window.location.href}`);
    
    // Using WhatsApp direct link
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleGmailConnect = () => {
    if (!listing) return;
    
    // Use seller email if available, otherwise fallback
    const email = sellerInfo?.email || 'creator@vibemarket.com';
    const subject = encodeURIComponent(`Interested in "${listing.title}" on VibeMarket`);
    const body = encodeURIComponent(`Hi,\n\nI'm interested in your vibe-coded asset: ${listing.title}.\n\nListing Link: ${window.location.href}\n\nCan we discuss the details?`);
    
    // Using direct Gmail compose link
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!listing) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Header/Breadcrumb Area */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Link to="/" className="hover:text-indigo-600">Home</Link>
            <span>/</span>
            <Link to="/marketplace" className="hover:text-indigo-600">Marketplace</Link>
            <span>/</span>
            <span className="text-slate-900 line-clamp-1">{listing.title}</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Live in Marketplace
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-20">
            
            {/* Header Block */}
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-lg shadow-indigo-100">
                    {listing.category}
                  </div>
                  <div className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-bold uppercase tracking-widest">
                    ID: {listing.id.substring(0, 8)}
                  </div>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.05] font-display uppercase italic">
                  {listing.title}
                </h1>
                
                <div className="flex items-center gap-6 py-2 border-y border-slate-50">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-slate-900">{listing.rating}</span>
                    <span className="text-sm text-slate-400">({listing.reviewCount} reviews)</span>
                  </div>
                  <div className="w-px h-4 bg-slate-100" />
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-bold text-slate-900">Verified Vibe</span>
                  </div>
                </div>
              </div>

              <div className="aspect-[16/10] bg-slate-50 border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-500/5 group relative">
                <img 
                  src={listing.screenshots[0]} 
                  alt={listing.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-16">
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                    <Layout className="w-4 h-4" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight font-display">Overview</h3>
                </div>
                <p className="text-lg text-slate-500 leading-relaxed max-w-3xl font-medium">
                  {listing.description}
                </p>
              </section>

              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight font-display">Technical Spec</h3>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {listing.techStack?.map(tech => (
                    <div key={tech} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col items-center gap-4 hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shadow-sm">
                        {TECH_ICONS[tech] || <Code2 className="w-6 h-6" />}
                      </div>
                      <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">{tech}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-8">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                      <Layers className="w-4 h-4" />
                   </div>
                   <h3 className="text-2xl font-bold tracking-tight font-display">In the Box</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {listing.features?.map(feature => (
                    <div key={feature} className="flex items-center gap-4 p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:border-indigo-100 transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 tracking-tight leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Version History */}
              <section className="p-10 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                 <div className="relative z-10 space-y-8">
                    <div className="flex items-center justify-between">
                       <h3 className="text-2xl font-bold font-display uppercase italic">Engineering Log</h3>
                       <div className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-bold tracking-widest">v2.1.0_LATEST</div>
                    </div>
                    <div className="space-y-4">
                       {[
                         { v: "2.1.0", date: "MAY 2024", note: "Integrated full dark-mode support and optimized hydration logic." },
                         { v: "2.0.4", date: "APR 2024", note: "Refactored API handlers for better latency and type safety." }
                       ].map((log, i) => (
                         <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                            <div>
                               <p className="text-xs font-bold text-indigo-400 mb-1">{log.v}</p>
                               <p className="text-sm text-slate-400 font-medium">{log.note}</p>
                            </div>
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{log.date}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </section>
            </div>
          </div>

          {/* Right Column: Checkout Block */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-2xl shadow-indigo-500/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl opacity-50" />
                
                <div className="relative z-10 space-y-10">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Ownership Acquisition</p>
                    <div className="flex items-end gap-3">
                      <span className="text-6xl font-bold text-slate-900 font-display tracking-tight leading-none">{formatPrice(listing.price)}</span>
                      <span className="text-slate-300 font-bold mb-1 line-through text-lg">$99.00</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-indigo-500" />
                        <span className="text-sm font-bold">Buyer Protection</span>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-indigo-500" />
                        <span className="text-sm font-bold">Global Support</span>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {!user ? (
                      <>
                        <button
                          onClick={() => navigate('/auth')}
                          className="w-full flex items-center justify-center gap-4 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 group active:scale-[0.98]"
                        >
                          <LogIn className="w-6 h-6 group-hover:scale-110 transition-transform" />
                          Login to Acquire
                        </button>
                        <button
                          onClick={() => navigate('/auth')}
                          className="w-full flex items-center justify-center gap-4 py-5 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all group active:scale-[0.98]"
                        >
                          <UserPlus className="w-6 h-6 text-indigo-600 transition-transform" />
                          Register Now
                        </button>
                      </>
                    ) : user.uid === listing.sellerId ? (
                      <button
                        onClick={() => navigate(`/dashboard/edit/${listing.id}`)}
                        className="w-full flex items-center justify-center gap-4 py-5 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all shadow-xl shadow-slate-50 group active:scale-[0.98]"
                      >
                        <Edit2 className="w-6 h-6 text-indigo-600 transition-transform group-hover:scale-110" />
                        Edit details
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleGmailConnect}
                          className="w-full flex items-center justify-center gap-4 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 group active:scale-[0.98]"
                        >
                          <Mail className="w-6 h-6 group-hover:scale-110 transition-transform" />
                          Inquire via Email
                        </button>
                        <button
                          onClick={handleConnect}
                          className="w-full flex items-center justify-center gap-4 py-5 bg-green-500 text-white rounded-2xl font-bold text-lg hover:bg-green-600 transition-all shadow-2xl shadow-green-100 group active:scale-[0.98]"
                        >
                          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                          Buy via WhatsApp
                        </button>
                      </>
                    )}
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex -space-x-2">
                       {[1,2,3].map(i => (
                         <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + listing.id}`} alt="User" />
                         </div>
                       ))}
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Satisfied Buyers</p>
                       <p className="text-sm font-bold text-slate-900">1.2k+ engineers</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-[2.5rem] flex items-center gap-5">
                 <div className="w-12 h-12 rounded-2xl bg-white border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                    <Shield className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">Standard Guarantee</h4>
                    <p className="text-[11px] text-slate-500 leading-tight">Every purchase includes a 48h review window and direct access to the engineering team.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Same placeholder data as Marketplace
const PLACEHOLDER_LISTINGS = [
    {
        id: '1',
        sellerId: 's1',
        title: 'Minimalist SaaS Landing Page',
        description: 'A high-converting landing page built with React, Tailwind, and Motion. Perfect for your next AI startup. This template includes pre-built sections for features, pricing, testimonials, and a custom interactive hero section designed to capture users eyes immediately. Optimized for both performance and SEO.',
        price: 49,
        category: 'Landing Page',
        techStack: ['React', 'Tailwind', 'Motion', 'Vite', 'TypeScript'],
        features: ['Full authentication', 'Direct WhatsApp integration', 'SEO performance', 'Stripe ready', 'Optimized for Vercel'],
        demoLink: 'https://ais-pre-gcogqwicstql2libl6t2qb-27407493822.asia-southeast1.run.app',
        screenshots: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'],
        tags: ['Modern', 'Fast', 'SaaS'],
        rating: 4.9,
        reviewCount: 24,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        sellerId: 's2',
        title: 'AI Content Generator Tool',
        description: 'Built with Next.js and OpenAI API. Includes authentication, subscription management, and user dashboard. This is a complete boilerplate to jumpstart your AI SaaS journey. It comes with a ready-to-use prompt engineering interface and history persistence.',
        price: 129,
        category: 'AI Tool',
        techStack: ['Next.js', 'OpenAI', 'Supabase', 'Tailwind'],
        features: ['Real-time streaming', 'Advanced RAG components', 'Stripe integration', 'History management'],
        demoLink: 'https://ais-pre-gcogqwicstql2libl6t2qb-27407493822.asia-southeast1.run.app',
        screenshots: ['https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800'],
        tags: ['AI', 'GPT-4', 'Full-stack'],
        rating: 5.0,
        reviewCount: 18,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
];
