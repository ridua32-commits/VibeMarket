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
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-200 pb-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">
              <Sparkles className="w-3 h-3" />
              Verified Assets
            </div>
            <h1 className="text-4xl font-bold text-slate-900 font-display tracking-tight">
              {isTemplateView ? `${activeCategory} Templates` : 'The Marketplace'}
            </h1>
            <p className="text-slate-500 mt-1 max-w-xl">
              {isTemplateView 
                ? `Acquire battle-tested ${activeCategory} architectures and UI systems.`
                : 'Exclusive source code and templates from specialized engineers.'
              }
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text"
                placeholder="Search code bases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="flex gap-2">
              <select className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 cursor-pointer">
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Rating</option>
              </select>
              <select 
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="SaaS">SaaS</option>
                <option value="AI Tool">AI Tool</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Game">Game</option>
                <option value="Dashboard">Dashboard</option>
                <option value="Landing Page">Landing Page</option>
                <option value="Mobile App">Mobile App</option>
              </select>
            </div>
          </div>
        </div>

        {isTemplateView && (
          <div className="mb-8 p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl text-white">
            <h2 className="text-xl font-bold mb-2">Editor's Choice: {activeCategory}</h2>
            <p className="text-indigo-100 text-sm">Hand-picked templates that are ready to deploy in seconds.</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-white border border-slate-200 rounded-2xl mb-4" />
                <div className="h-6 bg-slate-200 rounded-lg w-3/4 mb-2" />
                <div className="h-4 bg-slate-200 rounded-lg w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((listing, index) => (
              <ListingCard key={listing.id} listing={listing} index={index} />
            ))}
          </div>
        )}
        
        {!loading && filteredListings.length === 0 && (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl">
            <p className="text-slate-500 font-medium">No listings found matching your criteria.</p>
          </div>
        )}

        <div className="mt-16 bg-indigo-600 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-white text-2xl font-bold mb-2 font-display">Join 5,000+ indie builders</h2>
            <p className="text-indigo-100 max-w-lg">Start selling your vibe-coded creations today and keep 95% of every sale.</p>
          </div>
          <Link to="/onboarding" className="whitespace-nowrap bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-sm shadow-xl hover:bg-slate-50 transition-colors">
            Become a Seller
          </Link>
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
        flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all
        ${active 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' 
          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
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
