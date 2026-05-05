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
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-12 h-12 animate-pulse text-primary shadow-glow italic" />
      </div>
    );
  }

  if (!listing) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Dynamic Header/Breadcrumb Area */}
      <div className="bg-surface/50 backdrop-blur-xl border-b border-border sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] italic">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <span className="opacity-30">/</span>
            <Link to="/marketplace" className="hover:text-accent transition-colors">Marketplace</Link>
            <span className="opacity-30">/</span>
            <span className="text-foreground line-clamp-1">{listing.title}</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-[10px] font-black text-accent bg-accent/10 px-4 py-2 rounded-full border border-accent/20 shadow-cyan-glow italic uppercase tracking-widest">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-cyan-glow" />
                Live Asset
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Header Block */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="px-4 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {listing.category}
                  </div>
                  <div className="px-3 py-1 bg-surface-elevated border border-border text-muted-foreground rounded-full text-[10px] font-medium uppercase tracking-wider">
                    ID: {listing.id.substring(0, 8)}
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
                  {listing.title}
                </h1>
                
                <div className="flex items-center gap-6 py-4 border-y border-border">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span className="text-base font-bold text-foreground">{listing.rating}</span>
                    <span className="text-sm text-muted-foreground font-medium">({listing.reviewCount} reviews)</span>
                  </div>
                  <div className="w-px h-6 bg-border" />
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-accent" />
                    <span className="text-sm font-bold text-foreground uppercase tracking-tight">Verified Module</span>
                  </div>
                  {listing.demoLink && (
                    <>
                      <div className="w-px h-6 bg-border" />
                      <a 
                        href={listing.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 group/preview"
                      >
                        <ExternalLink className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">Live Preview</span>
                      </a>
                    </>
                  )}
                </div>
              </div>

              <div className="aspect-[16/10] bg-surface rounded-3xl overflow-hidden shadow-elegant border border-border group">
                <img 
                  src={listing.screenshots[0]} 
                  alt={listing.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                />
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-20">
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Layout className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-foreground">Overview</h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                  {listing.description}
                </p>
              </section>

              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-foreground">Technical Stack</h3>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {listing.techStack?.map(tech => (
                    <div key={tech} className="p-8 bg-surface rounded-2xl border border-border flex flex-col items-center gap-4 hover:border-accent/30 transition-all group">
                      <div className="w-12 h-12 bg-background border border-border rounded-xl flex items-center justify-center text-muted-foreground group-hover:text-accent transition-all">
                        {TECH_ICONS[tech] || <Code2 className="w-6 h-6" />}
                      </div>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">{tech}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-8">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-brand-glow/10 border border-brand-glow/20 flex items-center justify-center text-brand-glow">
                      <Layers className="w-5 h-5" />
                   </div>
                   <h3 className="text-2xl font-bold tracking-tight text-foreground">Features</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {listing.features?.map(feature => (
                    <div key={feature} className="flex items-center gap-4 p-8 bg-surface/50 border border-border rounded-2xl group transition-all">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-background transition-all">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-base font-bold text-foreground tracking-tight transition-colors group-hover:text-accent">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Version History */}
              <section className="p-10 md:p-12 bg-surface border border-border rounded-[2.5rem] relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                 <div className="relative z-10 space-y-10">
                    <div className="flex items-center justify-between">
                       <h3 className="text-2xl font-bold tracking-tight text-foreground">Changelog</h3>
                       <div className="px-4 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-bold tracking-wider text-primary uppercase">v2.1.0_LATEST</div>
                    </div>
                    <div className="space-y-6">
                       {[
                         { v: "2.1.0", date: "MAY 2024", note: "Integrated full dark-mode support and optimized hydration logic." },
                         { v: "2.0.4", date: "APR 2024", note: "Refactored API handlers for better latency and type safety." }
                       ].map((log, i) => (
                         <div key={i} className="flex items-center justify-between py-6 border-b border-border/50 last:border-0">
                            <div className="space-y-1">
                               <p className="text-xs font-bold text-accent uppercase tracking-widest">{log.v}</p>
                               <p className="text-base text-muted-foreground font-medium leading-relaxed">{log.note}</p>
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">{log.date}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </section>
            </div>
          </div>

          {/* Right Column: Checkout Block */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <div className="bg-surface border border-border rounded-[2.5rem] p-10 md:p-12 shadow-elegant relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10 space-y-12">
                  <div className="space-y-4 text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Asset Value</p>
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-6xl font-bold text-foreground tracking-tight">{formatPrice(listing.price)}</span>
                      <span className="text-muted-foreground/40 font-medium line-through text-xl">$299.00</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-5 bg-background/50 border border-border rounded-2xl group/row hover:border-accent transition-all">
                      <div className="flex items-center gap-4">
                        <Shield className="w-5 h-5 text-primary" />
                        <span className="text-sm font-bold text-foreground uppercase tracking-tight">Support Included</span>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex items-center justify-between p-5 bg-background/50 border border-border rounded-2xl group/row hover:border-accent transition-all">
                      <div className="flex items-center gap-4">
                        <Globe className="w-5 h-5 text-primary" />
                        <span className="text-sm font-bold text-foreground uppercase tracking-tight">Lifetime Access</span>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 pt-2">
                    {!user ? (
                      <>
                        <button
                          onClick={() => navigate('/auth')}
                          className="w-full flex items-center justify-center gap-3 py-5 bg-white text-background rounded-full font-bold text-sm hover:bg-accent transition-all shadow-glow active:scale-[0.98] uppercase tracking-wider"
                        >
                          <LogIn className="w-5 h-5" />
                          Login to Buy
                        </button>
                        <button
                          onClick={() => navigate('/auth?mode=register')}
                          className="w-full flex items-center justify-center gap-3 py-5 bg-surface-elevated border border-border text-foreground rounded-full font-bold text-sm hover:bg-surface transition-all active:scale-[0.98] uppercase tracking-wider"
                        >
                          <UserPlus className="w-5 h-5 text-accent" />
                          Register
                        </button>
                      </>
                    ) : user.uid === listing.sellerId ? (
                      <button
                        onClick={() => navigate(`/dashboard/edit/${listing.id}`)}
                        className="w-full flex items-center justify-center gap-3 py-5 bg-white text-background rounded-full font-bold text-sm hover:bg-primary hover:text-white transition-all shadow-glow active:scale-[0.98] uppercase tracking-wider"
                      >
                        <Edit2 className="w-5 h-5" />
                        Edit Listing
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleGmailConnect}
                          className="w-full flex items-center justify-center gap-3 py-5 bg-white text-background rounded-full font-bold text-sm hover:bg-accent transition-all shadow-glow active:scale-[0.98] uppercase tracking-wider"
                        >
                          <Mail className="w-5 h-5" />
                          Contact via Email
                        </button>
                        <button
                          onClick={handleConnect}
                          className="w-full flex items-center justify-center gap-3 py-5 bg-primary text-white rounded-full font-bold text-sm shadow-glow hover:bg-accent transition-all active:scale-[0.98] uppercase tracking-wider"
                        >
                          <MessageCircle className="w-5 h-5" />
                          Buy on WhatsApp
                        </button>
                      </>
                    )}
                  </div>

                  <div className="pt-8 border-t border-border flex items-center justify-between">
                    <div className="flex -space-x-3">
                       {[1,2,3].map(i => (
                         <div key={i} className="w-10 h-10 rounded-full border-2 border-surface bg-surface-elevated overflow-hidden">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + listing.id}`} alt="User" />
                         </div>
                       ))}
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Acquired by</p>
                       <p className="text-sm font-bold text-foreground">1.2k+ builders</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="p-8 bg-surface rounded-3xl border border-border flex items-center gap-5 hover:border-primary/30 transition-all">
                 <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Shield className="w-6 h-6" />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-base font-bold text-foreground uppercase tracking-tight leading-none">Safe Trade</h4>
                    <p className="text-xs text-muted-foreground font-medium">Verified by VibeMarket team.</p>
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
