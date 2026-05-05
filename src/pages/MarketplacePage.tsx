import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import { Listing } from '../types';
import { formatPrice } from '../lib/utils';
import { Link, useSearchParams } from 'react-router-dom';
import { ListingCard } from '../components/ListingCard';
import { Search, Filter, Star, Zap, Layout, Bot, Smartphone, Sparkles, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export default function MarketplacePage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { id: 'All', label: 'All Assets', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'SaaS', label: 'SaaS', icon: <Bot className="w-3.5 h-3.5" /> },
    { id: 'AI Tool', label: 'AI Tool', icon: <Bot className="w-3.5 h-3.5" /> },
    { id: 'E-commerce', label: 'E-commerce', icon: <Smartphone className="w-3.5 h-3.5" /> },
    { id: 'Game', label: 'Game', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'Dashboard', label: 'Dashboard', icon: <Layout className="w-3.5 h-3.5" /> },
    { id: 'Landing Page', label: 'Landing Page', icon: <Layout className="w-3.5 h-3.5" /> },
    { id: 'Mobile App', label: 'Mobile App', icon: <Smartphone className="w-3.5 h-3.5" /> },
  ];

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory('All');
    }
  }, [categoryParam]);

  const isTemplateView = categoryParam !== null;

  useEffect(() => {
    fetchListings();
  }, [activeCategory]);

  const fetchListings = async () => {
    setLoading(true);
    const path = 'listings';
    try {
      const constraints: any[] = [
        where('status', '==', 'active'), // Pillar 8: Secure List Queries
        limit(20)
      ];
      
      if (activeCategory !== 'All') {
        constraints.push(where('category', '==', activeCategory));
      }
      
      const q = query(collection(db, path), ...constraints);
      
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
      
      // If empty (new environment), show some placeholder data for demo
      if (items.length === 0) {
        setListings(PLACEHOLDER_LISTINGS.filter(l => activeCategory === 'All' || l.category === activeCategory));
      } else {
        setListings(items);
      }
    } catch (error) {
      handleFirestoreError(auth, error, OperationType.LIST, path);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(l => 
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Header Section */}
        <div className="flex flex-col gap-10 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[10px] font-bold text-accent uppercase tracking-widest mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Curated Repository
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground font-display tracking-tight leading-tight">
                Marketplace
              </h1>
              <p className="text-muted-foreground mt-2 max-w-xl font-medium leading-relaxed">
                {isTemplateView 
                  ? `Acquire battle-tested ${activeCategory} architectures and UI systems designed for maximum velocity.`
                  : 'Acquire premium source code and modular systems from the world\'s most specialized engineers.'
                }
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative group min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-all duration-300" />
                <input 
                  type="text"
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/40 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-4 py-4 border-y border-border/50 overflow-x-auto no-scrollbar mask-fade-right">
             <div className="flex gap-3 px-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`
                      flex items-center gap-2.5 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap italic active:scale-95
                      ${activeCategory === cat.id 
                        ? 'bg-primary text-white shadow-glow border border-white/20' 
                        : 'bg-surface border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                      }
                    `}
                  >
                    {cat.icon}
                    {cat.label}
                  </button>
                ))}
             </div>
          </div>
        </div>

        {isTemplateView && (
          <div className="mb-16 p-10 md:p-14 bg-card-gradient border border-primary/30 rounded-[3rem] text-foreground shadow-glow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary rounded-full blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-[9px] font-black uppercase tracking-widest italic w-fit">
                  Top Tier Deployment
                </div>
                <h2 className="text-4xl md:text-5xl font-black font-display uppercase italic tracking-tighter leading-none">Editor's Choice: <span className="text-glow-gradient">{activeCategory}</span></h2>
                <p className="text-muted-foreground text-lg font-bold italic leading-relaxed max-w-2xl">Hand-picked deployments engineered for immediate scale. Vetted for security, performance, and elite aesthetics.</p>
              </div>
              <div className="bg-background/40 p-1 rounded-3xl border border-white/5 backdrop-blur-xl">
                 <div className="px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black uppercase italic tracking-tighter shadow-glow text-xl">
                    PRO GRADE
                 </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
           <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.4em] italic leading-none">
             Displaying <span className="text-foreground">{filteredListings.length}</span> verified results
           </p>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl">
                 <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                 <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">Sorted by Recent</span>
              </div>
           </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="space-y-6">
                <div className="aspect-[16/10] bg-surface border border-border rounded-[2.5rem] animate-shimmer" />
                <div className="space-y-3">
                  <div className="h-4 bg-surface rounded-full w-3/4 animate-shimmer" />
                  <div className="h-4 bg-surface rounded-full w-1/2 animate-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 xl:gap-12">
            {filteredListings.map((listing, index) => (
              <ListingCard key={listing.id} listing={listing} index={index} />
            ))}
          </div>
        )}
        
        {!loading && filteredListings.length === 0 && (
          <div className="text-center py-40 bg-surface/30 border-2 border-dashed border-border rounded-[4rem]">
            <div className="w-24 h-24 bg-surface-elevated rounded-[2rem] border border-border flex items-center justify-center mx-auto mb-10 text-muted-foreground shadow-elegant">
               <Search className="w-10 h-10 opacity-30" />
            </div>
            <h3 className="text-3xl font-black text-foreground uppercase italic tracking-tighter mb-4">No assets detected</h3>
            <p className="text-muted-foreground font-bold italic text-lg mb-8">Refine your scanning parameters or clear all filters to reset.</p>
            <button 
              onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
              className="px-8 py-3 bg-white text-background rounded-full font-black uppercase italic tracking-widest hover:bg-accent transition-all shadow-glow active:scale-95 text-xs"
            >
              Reset Scan
            </button>
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-24 relative overflow-hidden bg-surface border border-border rounded-[2.5rem] p-10 md:p-16 shadow-elegant group">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
            <div className="text-center lg:text-left space-y-4">
              <h2 className="text-foreground text-4xl md:text-5xl font-bold font-display tracking-tight leading-tight">
                Sell Your <span className="text-glow-gradient">Products</span>
              </h2>
              <p className="text-muted-foreground max-w-xl font-medium text-lg leading-relaxed">
                Monetize your battle-tested code systems and reach thousands of builders worldwide.
              </p>
            </div>
            <Link to="/auth?mode=register" className="whitespace-nowrap px-10 py-5 bg-white text-background rounded-full font-bold text-xl shadow-glow hover:bg-accent hover:text-white transition-all active:scale-95 uppercase tracking-tight">
              Launch Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryButton({ label, active, onClick, icon }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap active:scale-95
        ${active 
          ? 'bg-primary text-white shadow-glow' 
          : 'bg-surface border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

const PLACEHOLDER_LISTINGS: Listing[] = [
  {
    id: '1',
    sellerId: 's1',
    title: 'Minimalist SaaS Landing Page',
    description: 'A high-converting landing page built with React, Tailwind, and Motion. Perfect for your next AI startup.',
    price: 49,
    category: 'Landing Page',
    techStack: ['React', 'Tailwind', 'Motion'],
    features: ['Full authentication', 'Direct WhatsApp integration', 'SEO performance', 'Stripe ready'],
    screenshots: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'],
    demoLink: 'https://ais-pre-gcogqwicstql2libl6t2qb-27407493822.asia-southeast1.run.app',
    tags: ['SaaS', 'Modern', 'Premium'],
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
    description: 'Built with Next.js and OpenAI API. Includes authentication, subscription management, and user dashboard.',
    price: 129,
    category: 'AI Tool',
    techStack: ['Next.js', 'OpenAI', 'Supabase'],
    features: ['Real-time streaming', 'Advanced RAG components', 'Stripe integration', 'History management'],
    screenshots: ['https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800'],
    demoLink: 'https://ais-pre-gcogqwicstql2libl6t2qb-27407493822.asia-southeast1.run.app',
    tags: ['AI', 'Intelligence', 'Enterprise'],
    rating: 5.0,
    reviewCount: 18,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    sellerId: 's3',
    title: 'Project Management Mobile UI',
    description: 'Beautifully designed project management application UI kit for iOS and Android. 40+ screens.',
    price: 79,
    category: 'Mobile App',
    techStack: ['React Native', 'Expo'],
    features: ['40+ High-fidelity screens', 'Dark mode support', 'Custom icon sets', 'Native animations'],
    screenshots: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800'],
    demoLink: 'https://ais-pre-gcogqwicstql2libl6t2qb-27407493822.asia-southeast1.run.app',
    tags: ['Mobile', 'UI Kit', 'Expo'],
    rating: 4.8,
    reviewCount: 42,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    sellerId: 's4',
    title: 'E-commerce Starter Kit',
    description: 'Full-featured e-commerce boilerplate with product management, cart, and Stripe integration.',
    price: 199,
    category: 'SaaS',
    techStack: ['T3 Stack', 'Stripe', 'Prisma'],
    features: ['Inventory control', 'PCI DSS compliant', 'Analytics engine', 'Webhooks integrated'],
    screenshots: ['https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800'],
    demoLink: 'https://ais-pre-gcogqwicstql2libl6t2qb-27407493822.asia-southeast1.run.app',
    tags: ['E-commerce', 'Stripe', 'Revenue'],
    rating: 5.0,
    reviewCount: 12,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    sellerId: 's5',
    title: 'Cyberpunk RPG Engine',
    description: 'A complete 2D RPG engine build with PixiJS. Includes tilemap editor, inventory system, and dialogue tree.',
    price: 149,
    category: 'Game',
    techStack: ['PixiJS', 'Typescript', 'WebAudio'],
    features: ['Custom ECS architecture', 'Dialogue system', 'Inventory & Crafting', 'Save game state'],
    screenshots: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800'],
    demoLink: 'https://ais-pre-gcogqwicstql2libl6t2qb-27407493822.asia-southeast1.run.app',
    tags: ['GameDev', 'Engine', 'Pixi'],
    rating: 4.7,
    reviewCount: 8,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    sellerId: 's6',
    title: 'FinTech Analytics Dashboard',
    description: 'Enterprise-grade financial dashboard with complex data visualizations and predictive analysis charts.',
    price: 249,
    category: 'Dashboard',
    techStack: ['React', 'D3.js', 'Tailwind'],
    features: ['Advanced DataViz', 'Export to PDF/CSV', 'Real-time tickers', 'Role-based access'],
    screenshots: ['https://images.unsplash.com/photo-1551288049-bbdac8a28a1e?auto=format&fit=crop&q=80&w=800'],
    demoLink: 'https://ais-pre-gcogqwicstql2libl6t2qb-27407493822.asia-southeast1.run.app',
    tags: ['Fintech', 'Analytics', 'Enterprise'],
    rating: 4.9,
    reviewCount: 31,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
