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
    <div className="flex flex-col bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-grid-white">
        {/* Radial blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary rounded-full blur-[180px] opacity-10 animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-accent rounded-full blur-[150px] opacity-10"></div>
        <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-brand-glow rounded-full blur-[160px] opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-elevated border border-border-strong text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-10 shadow-glow">
                <Sparkles className="w-3.5 h-3.5" />
                Engineering <span className="text-glow-gradient">Excellence</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-8 leading-[1.1] font-display">
                The New <br />
                Standard for <br />
                <span className="text-glow-gradient">Codebases.</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed font-medium">
                Acquire battle-tested SaaS templates and AI architectures from the world's elite engineers. Stop building infrastructure. <span className="text-foreground font-semibold">Start shipping value.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link
                  to="/marketplace"
                  className="w-full sm:w-auto px-10 py-4 bg-hero-gradient text-white rounded-full font-bold text-base hover:shadow-cyan-glow transition-all flex items-center justify-center gap-2 group shadow-glow active:scale-[0.98]"
                >
                  Explore Assets
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/auth?mode=register"
                  className="w-full sm:w-auto px-10 py-4 bg-surface border border-border rounded-full font-bold text-base text-foreground hover:bg-surface-elevated transition-all active:scale-[0.98]"
                >
                  Sell Your Vibe
                </Link>
              </div>

              <div className="mt-20 flex flex-wrap items-center gap-8 sm:gap-12 pt-10 border-t border-border">
                <div className="group cursor-default">
                  <p className="text-2xl sm:text-3xl font-black text-foreground group-hover:text-primary transition-colors">1.2k+</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Verified Assets</p>
                </div>
                <div className="hidden sm:block w-px h-10 bg-border"></div>
                <div className="group cursor-default">
                  <p className="text-2xl sm:text-3xl font-black text-foreground group-hover:text-accent transition-colors">$2.4M</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Seller Revenue</p>
                </div>
                <div className="hidden sm:block w-px h-10 bg-border"></div>
                <div className="group cursor-default">
                  <p className="text-2xl sm:text-3xl font-black text-foreground group-hover:text-brand-glow transition-colors">98%</p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Satisfaction</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative animate-[float_6s_ease-in-out_infinite]">
                <style dangerouslySetInnerHTML={{ __html: `
                  @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                  }
                `}} />
                <div className="relative aspect-square rounded-[3.5rem] overflow-hidden shadow-elegant border border-border-strong bg-card-gradient p-5 group">
                  <div className="w-full h-full rounded-[2.5rem] bg-background border border-border shadow-inner overflow-hidden flex flex-col">
                    <div className="h-14 border-b border-border bg-surface/50 flex items-center px-8 justify-between">
                       <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-destructive/40"></div>
                          <div className="w-3 h-3 rounded-full bg-warning/40"></div>
                          <div className="w-3 h-3 rounded-full bg-success/40"></div>
                       </div>
                       <div className="px-4 py-1.5 bg-surface-elevated border border-border-strong rounded-lg text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">VibeMarket_Core_v2.1</div>
                    </div>
                    <div className="flex-1 p-10 space-y-8">
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-glow">
                             <Terminal className="w-7 h-7" />
                          </div>
                          <div className="space-y-2">
                             <div className="h-5 bg-surface-elevated rounded-md w-40"></div>
                             <div className="h-3 bg-surface rounded-md w-56 opacity-50"></div>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-5">
                          <div className="h-40 bg-surface rounded-[2rem] border border-border border-dashed flex items-center justify-center">
                             <Layout className="w-10 h-10 text-muted-foreground/20" />
                          </div>
                          <div className="h-40 bg-surface rounded-[2rem] border border-border border-dashed flex items-center justify-center">
                             <Bot className="w-10 h-10 text-muted-foreground/20" />
                          </div>
                       </div>
                       <div className="space-y-4">
                          <div className="h-2.5 bg-surface-elevated rounded-full w-full"></div>
                          <div className="h-2.5 bg-surface-elevated rounded-full w-full"></div>
                          <div className="h-2.5 bg-surface-elevated rounded-full w-3/4"></div>
                       </div>
                       <div className="flex justify-between items-center pt-6">
                          <div className="flex -space-x-3">
                             {[1,2,3,4].map(i => (
                               <div key={i} className="w-10 h-10 rounded-full border-4 border-background bg-surface-elevated ring-1 ring-border shadow-lg"></div>
                             ))}
                          </div>
                          <div className="h-12 w-28 bg-hero-gradient rounded-xl shadow-glow"></div>
                       </div>
                    </div>
                  </div>
                  
                  {/* Floating Badges */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-16 -right-10 px-8 py-5 bg-surface-elevated rounded-[2rem] shadow-elegant border border-border-strong group-hover:border-accent/40 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-accent/10 rounded-xl text-accent border border-accent/20">
                          <Zap className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1.5 italic">Status</p>
                          <p className="font-black text-foreground leading-none tracking-tighter uppercase font-display italic">Production Ready</p>
                       </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-16 -left-10 px-8 py-5 bg-surface-elevated rounded-[2rem] shadow-elegant border border-border-strong group-hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
                          <Shield className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1.5 italic">Security</p>
                          <p className="font-black text-foreground leading-none tracking-tighter uppercase font-display italic">Fully Vetted</p>
                       </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Vibes */}
      <section className="py-32 relative bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-display">
                Latest <span className="text-glow-gradient">Vibey</span> Assets
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl font-medium">Freshly minted architectures ready for your next project.</p>
            </div>
            <Link to="/marketplace" className="inline-flex items-center gap-2 text-accent font-bold uppercase text-[10px] tracking-widest hover:gap-3 transition-all group">
              View Marketplace <ChevronRight className="w-4 h-4 group-hover:text-foreground" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="animate-pulse space-y-6">
                  <div className="aspect-[16/10] bg-surface rounded-[2.5rem] shadow-inner" />
                  <div className="h-10 bg-surface rounded-xl w-3/4" />
                  <div className="space-y-3">
                    <div className="h-4 bg-surface rounded-lg w-full" />
                    <div className="h-4 bg-surface rounded-lg w-2/3" />
                  </div>
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

      {/* Bento Grid Features */}
      <section className="py-40 bg-surface/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-28 space-y-6">
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground font-display uppercase italic leading-none">
                Institutional <span className="text-glow-gradient">Quality</span> Control.
              </h2>
              <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">We filter the noise so you only see assets that actually work at scale.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-8 h-auto">
              <div className="md:col-span-8 md:row-span-1 bg-card-gradient rounded-[3rem] p-12 border border-border shadow-glow flex flex-col justify-between group overflow-hidden relative min-h-[350px]">
                 <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-700">
                    <Layers className="w-48 h-48 text-primary" />
                 </div>
                 <div>
                    <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-8 border border-primary/20 shadow-glow">
                       <Shield className="w-7 h-7" />
                    </div>
                    <h3 className="text-3xl font-black mb-6 font-display text-foreground uppercase italic tracking-tighter transition-colors group-hover:text-primary">Deep Code Audit</h3>
                    <p className="text-muted-foreground max-w-lg leading-relaxed font-medium text-lg">Every asset undergoes a manual review process. We check for <span className="text-foreground">security vulnerabilities</span>, scalability patterns, and documentation quality before approval.</p>
                 </div>
                 <div className="flex items-center gap-5 pt-8">
                    <div className="px-5 py-2 bg-surface-elevated border border-border rounded-full text-[10px] font-black text-muted-foreground uppercase tracking-widest shadow-sm">Static Analysis</div>
                    <div className="px-5 py-2 bg-surface-elevated border border-border rounded-full text-[10px] font-black text-muted-foreground uppercase tracking-widest shadow-sm">Dependency Check</div>
                 </div>
              </div>

              <div className="md:col-span-4 md:row-span-1 bg-hero-gradient rounded-[3rem] p-12 text-white flex flex-col justify-between shadow-glow group relative overflow-hidden min-h-[350px]">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                 <div className="w-14 h-14 bg-white text-primary rounded-xl flex items-center justify-center mb-8 shadow-cyan-glow">
                    <Zap className="w-7 h-7" />
                 </div>
                 <div>
                    <h3 className="text-3xl font-black mb-6 font-display uppercase italic tracking-tighter leading-[0.9]">Instant <br />Onboarding</h3>
                    <p className="text-white/80 text-base leading-relaxed font-bold">Buy today, deploy tonight. All assets come with automated setup scripts and environment templates.</p>
                 </div>
                 <div className="flex justify-end pt-6">
                    <div className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all shadow-xl">
                       <ArrowRight className="w-6 h-6" />
                    </div>
                 </div>
              </div>

              <div className="md:col-span-4 md:row-span-1 bg-surface-elevated rounded-[3rem] p-12 border border-border shadow-elegant flex flex-col justify-between min-h-[350px] group">
                 <div className="w-14 h-14 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-8 border border-accent/20 group-hover:shadow-cyan-glow transition-all">
                    <Activity className="w-7 h-7" />
                 </div>
                 <div className="space-y-4">
                    <h3 className="text-3xl font-black font-display text-foreground uppercase italic tracking-tighter">Revenue Sync</h3>
                    <p className="text-muted-foreground text-base leading-relaxed font-medium italic border-l border-accent/30 pl-4">Direct payments to sellers via Stripe. Keep <span className="text-foreground">95%</span> of your asset's total value.</p>
                 </div>
              </div>

              <div className="md:col-span-8 md:row-span-1 bg-surface rounded-[3rem] p-12 border border-border shadow-elegant text-foreground flex items-center gap-12 group cursor-pointer relative overflow-hidden min-h-[350px]">
                 <div className="absolute top-0 right-0 w-80 h-80 bg-brand-glow rounded-full blur-[150px] opacity-10 -translate-y-1/4 translate-x-1/4 group-hover:opacity-20 transition-opacity"></div>
                 <div className="flex-1 space-y-10 relative z-10">
                    <h3 className="text-4xl font-black font-display leading-[0.9] uppercase italic tracking-tighter">Join the Vibe <br />Engineer <span className="text-glow-gradient">Community</span></h3>
                    <p className="text-muted-foreground opacity-90 leading-relaxed font-medium text-lg italic max-w-md border-l border-brand-glow/40 pl-6">A selective marketplace for engineers who care about code quality, aesthetics, and high-performance builds.</p>
                    <Link to="/auth?mode=register" className="inline-flex items-center gap-4 px-10 py-5 bg-hero-gradient text-white rounded-full font-black text-sm shadow-glow hover:scale-105 transition-all">
                       Become a Seller
                       <Users className="w-5 h-5" />
                    </Link>
                 </div>
                 <div className="hidden lg:block w-56 relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 opacity-20">
                    <Bot className="w-full h-auto text-foreground" />
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-24 border-y border-border bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em] mb-16 font-display italic">Built by builders at leading tech icons</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 sm:gap-24 opacity-60 hover:opacity-100 transition-opacity duration-500">
             <span className="text-2xl sm:text-4xl font-black tracking-tighter text-foreground selection:bg-primary">STRIPE</span>
             <span className="text-2xl sm:text-4xl font-bold tracking-tighter italic text-foreground font-display">Vercel</span>
             <span className="text-2xl sm:text-4xl font-bold tracking-tighter uppercase font-display text-foreground">Linear</span>
             <span className="text-2xl sm:text-4xl font-black tracking-tighter text-foreground">SUPABASE</span>
             <span className="text-2xl sm:text-4xl font-bold tracking-tighter uppercase text-foreground">Airbnb</span>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-40 bg-background relative">
         <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-primary rounded-full blur-[200px] opacity-5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="text-center mb-28">
              <h2 className="text-4xl font-black font-display uppercase tracking-[0.2em] italic text-foreground leading-none">
                Explore by <span className="text-glow-gradient">Specialized</span> Vertical
              </h2>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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

      {/* CTA Section */}
      <section className="py-40 px-4 bg-background relative">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-card-gradient rounded-[4rem] p-16 md:p-32 overflow-hidden border border-border shadow-glow group">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary rounded-full blur-[200px] opacity-20"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-accent rounded-full blur-[200px] opacity-20"></div>
            
            <div className="relative z-10 text-center space-y-14">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-surface-elevated border border-border-strong text-accent text-[11px] font-black tracking-[0.4em] uppercase shadow-cyan-glow italic">
                Join the Circle
              </div>
              <h2 className="text-[clamp(2.5rem,10vw,6.5rem)] font-black text-foreground tracking-[-0.06em] font-display leading-[0.8] max-w-5xl mx-auto uppercase italic">
                Ready to Sell Your <br />
                <span className="text-glow-gradient">Masterpieces?</span>
              </h2>
              <p className="text-muted-foreground text-2xl max-w-2xl mx-auto font-medium leading-relaxed italic border-l-2 border-primary pl-10 text-left">
                "VibeMarket changed how I view my side projects. Now they are assets generating <span className="text-foreground">passive income</span> while I sleep."
              </p>
              <div className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-8">
                <Link
                  to="/auth?mode=register"
                  className="w-full sm:w-auto px-16 py-7 bg-hero-gradient text-white rounded-full font-black text-2xl shadow-glow hover:shadow-cyan-glow transition-all hover:scale-[1.05] flex items-center justify-center gap-5 active:scale-[0.98]"
                >
                  Get Started
                  <ArrowRight className="w-8 h-8" />
                </Link>
                <Link
                  to="/marketplace"
                  className="w-full sm:w-auto px-16 py-7 bg-surface/40 backdrop-blur-xl border border-border text-foreground rounded-full font-black text-2xl hover:bg-surface-elevated transition-all active:scale-[0.98]"
                >
                  Browse Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 border-t border-border bg-background relative overflow-hidden">
        <div className="absolute bottom-0 left-[50%] -translate-x-1/2 w-full h-[500px] bg-primary rounded-full blur-[250px] opacity-5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-28">
              <div className="col-span-1 md:col-span-1 space-y-8">
                 <div className="flex items-center gap-3 group translate-x-[-4px]">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-glow group-hover:rotate-12 transition-transform">
                       <span className="text-background font-black text-xl font-display italic">V</span>
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-foreground font-display italic uppercase">
                      Vibe<span className="text-glow-gradient">Market</span>
                    </span>
                 </div>
                 <p className="text-muted-foreground text-base leading-relaxed font-bold italic border-l border-border pl-6">
                    The premium marketplace for verified codebases, architectures, and SaaS templates.
                 </p>
              </div>
              <div className="space-y-6">
                 <h4 className="text-[11px] font-black text-foreground uppercase tracking-[0.3em] font-display italic border-b border-primary/20 pb-2">Platform</h4>
                 <ul className="space-y-4 text-sm font-bold text-muted-foreground italic">
                    <li><Link to="/marketplace" className="hover:text-accent transition-colors">All Assets</Link></li>
                    <li><Link to="/marketplace?category=SaaS" className="hover:text-accent transition-colors">SaaS Templates</Link></li>
                    <li><Link to="/marketplace?category=AI Tool" className="hover:text-accent transition-colors">AI Models</Link></li>
                    <li><Link to="/auth?mode=register" className="hover:text-accent transition-colors">Sell on VibeMarket</Link></li>
                 </ul>
              </div>
              <div className="space-y-6">
                 <h4 className="text-[11px] font-black text-foreground uppercase tracking-[0.3em] font-display italic border-b border-accent/20 pb-2">Company</h4>
                 <ul className="space-y-4 text-sm font-bold text-muted-foreground italic">
                    <li><a href="#" className="hover:text-brand-glow transition-colors">Our Standard</a></li>
                    <li><a href="#" className="hover:text-brand-glow transition-colors">Audit Process</a></li>
                    <li><a href="#" className="hover:text-brand-glow transition-colors">Careers</a></li>
                    <li><a href="#" className="hover:text-brand-glow transition-colors">Contact</a></li>
                 </ul>
              </div>
              <div className="space-y-6">
                 <h4 className="text-[11px] font-black text-foreground uppercase tracking-[0.3em] font-display italic border-b border-brand-glow/20 pb-2">Legal</h4>
                 <ul className="space-y-4 text-sm font-bold text-muted-foreground italic">
                    <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
                 </ul>
              </div>
           </div>
           <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-16 border-t border-border">
              <p className="text-sm text-muted-foreground font-black italic">© 2026 VibeMarket Inc. All rights reserved.</p>
              <div className="flex gap-10 opacity-30">
                 <Globe className="w-6 h-6 text-foreground hover:text-accent hover:opacity-100 transition-all cursor-pointer" />
                 <Activity className="w-6 h-6 text-foreground hover:text-primary hover:opacity-100 transition-all cursor-pointer" />
                 <Lock className="w-6 h-6 text-foreground hover:text-brand-glow hover:opacity-100 transition-all cursor-pointer" />
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
}

function CategoryCard({ icon, title, count, to }: { icon: React.ReactNode, title: string, count: string, to: string }) {
  return (
    <Link to={to} className="p-10 bg-surface rounded-[2.5rem] border border-border shadow-sm hover:border-primary/30 transition-all group overflow-hidden relative group active:scale-95">
      <div className="w-14 h-14 bg-background text-muted-foreground rounded-2xl flex items-center justify-center mb-6 border border-border group-hover:bg-primary group-hover:text-white transition-all">
        {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors font-display tracking-tight leading-tight uppercase">{title}</h3>
      <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest font-display opacity-60">{count}</p>
    </Link>
  );
}

