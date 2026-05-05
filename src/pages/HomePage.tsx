import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowRight, Zap, Shield, Globe, Sparkles, 
  ChevronRight, Terminal, Layout, Bot, Code2,
  Users, Activity, Lock, Layers, Smartphone,
  Gamepad2, ShoppingBag, PieChart
} from 'lucide-react';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import { Listing } from '../types';
import { ListingCard } from '../components/ListingCard';

export default function HomePage() {
  const [featured, setFeatured] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    const path = 'listings';
    try {
      const q = query(
        collection(db, path),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc'),
        limit(3)
      );
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
      setFeatured(items);
    } catch (error) {
      console.error("Error fetching featured assets:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section - Split Layout Inspiration */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b border-slate-100">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold tracking-[0.2em] uppercase mb-8 shadow-sm">
                <Sparkles className="w-3 h-3" />
                Engineering Excellence
              </div>
              
              <h1 className="text-6xl md:text-[5.5rem] font-bold tracking-[-0.04em] text-slate-900 mb-8 leading-[0.95] font-display">
                The New Standard <br />
                <span className="text-slate-400">for Codebases.</span>
              </h1>
              
              <p className="text-xl text-slate-500 max-w-lg mb-10 leading-relaxed font-medium">
                Acquire battle-tested SaaS templates and AI architectures from the world's elite engineers. Stop building infrastructure. Start shipping value.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link
                  to="/marketplace"
                  className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-slate-200"
                >
                  Explore Assets
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/auth?mode=register"
                  className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all shadow-sm"
                >
                  Sell Your Vibe
                </Link>
              </div>

              <div className="mt-16 flex items-center gap-8 pt-8 border-t border-slate-100">
                <div>
                  <p className="text-2xl font-bold text-slate-900">1.2k+</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Assets</p>
                </div>
                <div className="w-px h-8 bg-slate-100"></div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">$2.4M</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Seller Revenue</p>
                </div>
                <div className="w-px h-8 bg-slate-100"></div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">98%</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Satisfaction</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200 bg-slate-50 p-4">
                 <div className="w-full h-full rounded-[2rem] bg-white border border-slate-100 shadow-inner overflow-hidden flex flex-col">
                    <div className="h-12 border-b border-slate-50 bg-slate-50/50 flex items-center px-6 justify-between">
                       <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                       </div>
                       <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[8px] font-bold text-slate-400 uppercase tracking-widest">VibeMarket_Core_v2.0</div>
                    </div>
                    <div className="flex-1 p-8 space-y-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                             <Terminal className="w-6 h-6" />
                          </div>
                          <div>
                             <div className="h-4 bg-slate-100 rounded-md w-32 mb-2"></div>
                             <div className="h-2 bg-slate-50 rounded-md w-48"></div>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="h-32 bg-slate-50 rounded-2xl border border-slate-100 border-dashed animate-pulse"></div>
                          <div className="h-32 bg-slate-50 rounded-2xl border border-slate-100 border-dashed animate-pulse"></div>
                       </div>
                       <div className="space-y-2">
                          <div className="h-2 bg-slate-100 rounded-md w-full"></div>
                          <div className="h-2 bg-slate-100 rounded-md w-full"></div>
                          <div className="h-2 bg-slate-100 rounded-md w-3/4"></div>
                       </div>
                       <div className="flex justify-between items-center pt-4">
                          <div className="flex -space-x-2">
                             {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100"></div>)}
                          </div>
                          <div className="h-10 w-24 bg-indigo-600 rounded-xl shadow-lg"></div>
                       </div>
                    </div>
                 </div>
                 {/* Floating Badges */}
                 <div className="absolute top-12 -right-6 px-6 py-4 bg-white rounded-2xl shadow-xl border border-slate-100 animate-bounce cursor-default">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-green-50 rounded-lg text-green-600">
                          <Zap className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Status</p>
                          <p className="font-bold text-slate-900 leadng-none">Production Ready</p>
                       </div>
                    </div>
                 </div>
                 <div className="absolute bottom-12 -left-6 px-6 py-4 bg-white rounded-2xl shadow-xl border border-slate-100 cursor-default">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                          <Shield className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Security</p>
                          <p className="font-bold text-slate-900 leadng-none">Fully Vetted</p>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Vibes */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 font-display italic">Latest Vibey Assets</h2>
              <p className="text-slate-500 text-lg max-w-xl">Freshly minted architectures ready for your next project.</p>
            </div>
            <Link to="/marketplace" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">
              View Marketplace <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[16/10] bg-slate-50 rounded-[2rem] mb-6 shadow-inner" />
                  <div className="h-8 bg-slate-100 rounded-xl w-3/4 mb-4" />
                  <div className="h-4 bg-slate-50 rounded-lg w-full mb-2" />
                  <div className="h-4 bg-slate-50 rounded-lg w-1/2" />
                </div>
              ))
            ) : (
              featured.map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} index={i} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Bento Grid Features - Recipe 1 Inspired */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 font-display">Institutional Quality Control.</h2>
              <p className="text-slate-500 text-lg max-w-xl mx-auto">We filter the noise so you only see assets that actually work at scale.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
              <div className="md:col-span-8 md:row-span-1 bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm flex flex-col justify-between group overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <Layers className="w-32 h-32 text-indigo-600" />
                 </div>
                 <div>
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                       <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 font-display">Deep Code Audit</h3>
                    <p className="text-slate-500 max-w-md leading-relaxed">Every asset undergoes a manual review process. We check for security vulnerabilities, scalability patterns, and documentation quality before approval.</p>
                 </div>
                 <div className="flex items-center gap-4 pt-6">
                    <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-bold text-slate-400 uppercase tracking-widest">Static Analysis</div>
                    <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-bold text-slate-400 uppercase tracking-widest">Dependency Check</div>
                 </div>
              </div>

              <div className="md:col-span-4 md:row-span-1 bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-2xl shadow-indigo-100 group">
                 <div className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold mb-4 font-display">Instant Onboarding</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Buy today, deploy tonight. All assets come with automated setup scripts and environment templates.</p>
                 </div>
                 <div className="flex justify-end pt-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-2 transition-transform">
                       <ArrowRight className="w-5 h-5" />
                    </div>
                 </div>
              </div>

              <div className="md:col-span-4 md:row-span-1 bg-white rounded-[2.5rem] p-10 border border-slate-200/60 shadow-sm flex flex-col justify-between">
                 <div className="w-12 h-12 bg-slate-50 text-slate-900 rounded-xl flex items-center justify-center mb-6">
                    <Activity className="w-6 h-6" />
                 </div>
                 <h3 className="text-2xl font-bold mb-4 font-display">Revenue Sync</h3>
                 <p className="text-slate-500 text-sm leading-relaxed">Direct payments to sellers via Stripe. No hidden fees. Keep 95% of your asset's value.</p>
              </div>

              <div className="md:col-span-8 md:row-span-1 bg-indigo-600 rounded-[2.5rem] p-10 text-white flex items-center gap-10 group cursor-pointer relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                 <div className="flex-1 space-y-6 relative z-10">
                    <h3 className="text-3xl font-bold font-display leading-tight">Join the Vibe Engineer <br /> Community</h3>
                    <p className="text-indigo-100 opacity-80 leading-relaxed">A selective marketplace for engineers who care about code quality, aesthetics, and high-performance builds.</p>
                    <Link to="/auth?mode=register" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-sm shadow-xl hover:scale-105 transition-all">
                       Become a Seller
                       <Users className="w-5 h-5" />
                    </Link>
                 </div>
                 <div className="hidden lg:block w-48 relative z-10 group-hover:scale-105 transition-transform">
                    <Bot className="w-full h-auto text-white/20" />
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-24 border-y border-slate-100 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-16">Built by builders at leading tech icons</p>
          <div className="flex flex-wrap justify-center items-center gap-20 opacity-30 grayscale hover:opacity-60 transition-opacity">
             <span className="text-3xl font-black tracking-tighter">STRIPE</span>
             <span className="text-3xl font-bold tracking-tighter italic">Vercel</span>
             <span className="text-3xl font-bold tracking-tighter uppercase font-display">Linear</span>
             <span className="text-3xl font-bold tracking-tighter">SUPABASE</span>
             <span className="text-3xl font-bold tracking-tighter uppercase">Airbnb</span>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-20">
              <h2 className="text-3xl font-bold font-display uppercase tracking-widest italic text-slate-900">Explore by specialized vertical</h2>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <CategoryCard 
                icon={<Layout className="w-6 h-6" />}
                title="SaaS Templates"
                count="420+ assets"
                to="/marketplace?category=SaaS"
              />
              <CategoryCard 
                icon={<Bot className="w-6 h-6" />}
                title="AI Agents"
                count="180+ assets"
                to="/marketplace?category=AI Tool"
              />
              <CategoryCard 
                icon={<ShoppingBag className="w-6 h-6" />}
                title="E-commerce"
                count="150+ assets"
                to="/marketplace?category=E-commerce"
              />
              <CategoryCard 
                icon={<Gamepad2 className="w-6 h-6" />}
                title="Game Assets"
                count="90+ assets"
                to="/marketplace?category=Game"
              />
              <CategoryCard 
                icon={<PieChart className="w-6 h-6" />}
                title="Dashboards"
                count="210+ assets"
                to="/marketplace?category=Dashboard"
              />
              <CategoryCard 
                icon={<Smartphone className="w-6 h-6" />}
                title="Mobile Apps"
                count="240+ assets"
                to="/marketplace?category=Mobile App"
              />
              <CategoryCard 
                icon={<Globe className="w-6 h-6" />}
                title="Landing Pages"
                count="350+ assets"
                to="/marketplace?category=Landing Page"
              />
              <CategoryCard 
                icon={<Code2 className="w-6 h-6" />}
                title="Components"
                count="1.2k+ assets"
                to="/marketplace"
              />
           </div>
        </div>
      </section>

      {/* CTA Section - Dark Luxury Pattern */}
      <section className="py-32 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-slate-900 rounded-[3rem] p-12 md:p-24 overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[150px] opacity-20"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[150px] opacity-10"></div>
            
            <div className="relative z-10 text-center space-y-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-bold tracking-widest uppercase shadow-sm">
                Join the Elite
              </div>
              <h2 className="text-5xl md:text-[5.5rem] font-bold text-white tracking-[-0.05em] font-display leading-[0.9] max-w-4xl mx-auto">
                Ready to Sell Your <br />
                <span className="text-slate-500">Masterpieces?</span>
              </h2>
              <p className="text-slate-400 text-xl max-w-xl mx-auto font-medium leading-relaxed italic border-l border-indigo-500 pl-6">
                "VibeMarket changed how I view my side projects. Now they are assets generating passive income while I sleep."
              </p>
              <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link
                  to="/auth?mode=register"
                  className="w-full sm:w-auto px-12 py-6 bg-indigo-600 text-white rounded-2xl font-bold text-2xl hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] flex items-center justify-center gap-4"
                >
                  Get Started
                  <ArrowRight className="w-7 h-7" />
                </Link>
                <Link
                  to="/marketplace"
                  className="w-full sm:w-auto px-12 py-6 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-2xl hover:bg-white/10 transition-all"
                >
                  Browse Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

       {/* Footer */}
       <footer className="py-24 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
              <div className="col-span-1 md:col-span-1 space-y-6">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                       <span className="text-white font-bold text-sm">V</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">VibeMarket</span>
                 </div>
                 <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    The premium marketplace for verified codebases, architectures, and SaaS templates.
                 </p>
              </div>
              <div className="space-y-4">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Platform</h4>
                 <ul className="space-y-3 text-sm font-semibold text-slate-600">
                    <li><Link to="/marketplace" className="hover:text-indigo-600 transition-colors">All Assets</Link></li>
                    <li><Link to="/marketplace?category=SaaS" className="hover:text-indigo-600 transition-colors">SaaS Templates</Link></li>
                    <li><Link to="/marketplace?category=AI Tool" className="hover:text-indigo-600 transition-colors">AI Models</Link></li>
                    <li><Link to="/auth?mode=register" className="hover:text-indigo-600 transition-colors">Sell on VibeMarket</Link></li>
                 </ul>
              </div>
              <div className="space-y-4">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Company</h4>
                 <ul className="space-y-3 text-sm font-semibold text-slate-600">
                    <li><a href="#" className="hover:text-indigo-600 transition-colors">Our Standard</a></li>
                    <li><a href="#" className="hover:text-indigo-600 transition-colors">Audit Process</a></li>
                    <li><a href="#" className="hover:text-indigo-600 transition-colors">Careers</a></li>
                    <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact</a></li>
                 </ul>
              </div>
              <div className="space-y-4">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Legal</h4>
                 <ul className="space-y-3 text-sm font-semibold text-slate-600">
                    <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-indigo-600 transition-colors">Cookie Policy</a></li>
                 </ul>
              </div>
           </div>
           <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-slate-50">
              <p className="text-sm text-slate-400">© 2026 VibeMarket Inc. All rights reserved.</p>
              <div className="flex gap-6 opacity-40">
                 <Globe className="w-5 h-5" />
                 <Activity className="w-5 h-5" />
                 <Lock className="w-5 h-5" />
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
}

function CategoryCard({ icon, title, count, to }: { icon: React.ReactNode, title: string, count: string, to: string }) {
  return (
    <Link to={to} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
      <div className="w-12 h-12 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors font-display tracking-tight leading-tight">{title}</h3>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{count}</p>
    </Link>
  );
}
