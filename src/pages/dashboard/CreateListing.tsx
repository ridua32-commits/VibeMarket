import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db, auth, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, addDoc, updateDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../App';
import { 
  Plus, 
  Trash2, 
  ChevronRight, 
  Upload, 
  Link as LinkIcon, 
  DollarSign,
  Layers,
  FileCode
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function CreateListing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('SaaS');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [newTech, setNewTech] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [screenshots, setScreenshots] = useState<string[]>(['']);
  const [demoLink, setDemoLink] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => {
    if (id) {
      fetchListing();
    }
  }, [id]);

  const fetchListing = async () => {
    if (!id) return;
    try {
      const docRef = doc(db, 'listings', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price.toString());
        setCategory(data.category);
        setTechStack(data.techStack || []);
        setFeatures(data.features || []);
        setScreenshots(data.screenshots || ['']);
        setDemoLink(data.demoLink || '');
        setFileUrl(data.fileUrl || '');
      } else {
        console.error("Listing not found");
        navigate('/dashboard/listings');
      }
    } catch (error) {
      console.error("Error fetching listing:", error);
    } finally {
      setFetching(false);
    }
  };

  const addTech = () => {
    if (newTech && !techStack.includes(newTech)) {
      setTechStack([...techStack, newTech]);
      setNewTech('');
    }
  };

  const removeTech = (tech: string) => {
    setTechStack(techStack.filter(t => t !== tech));
  };

  const addFeature = () => {
    if (newFeature && !features.includes(newFeature)) {
      setFeatures([...features, newFeature]);
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFeatures(features.filter(f => f !== feature));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const path = id ? `listings/${id}` : 'listings';

    try {
      const listingData = {
        title,
        description,
        price: parseFloat(price) || 0,
        category,
        techStack,
        features,
        screenshots: screenshots.filter(s => s !== ''),
        demoLink,
        fileUrl,
        status: 'active',
        tags: techStack,
        updatedAt: serverTimestamp(),
      };

      if (id) {
        await updateDoc(doc(db, 'listings', id), listingData);
        navigate(`/listing/${id}`);
      } else {
        const docRef = await addDoc(collection(db, 'listings'), {
          ...listingData,
          sellerId: user.uid,
          rating: 5.0,
          reviewCount: 0,
          createdAt: serverTimestamp(),
        });
        navigate(`/listing/${docRef.id}`);
      }
    } catch (error) {
      handleFirestoreError(auth, error, id ? OperationType.UPDATE : OperationType.CREATE, path);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary shadow-glow"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-12">
      <div>
        <div className="flex items-center gap-3 text-[11px] font-black text-accent uppercase tracking-[0.4em] mb-3 italic">
          <div className="w-8 h-px bg-accent/30" />
          Deployment Portal
        </div>
        <h1 className="text-5xl font-black text-foreground font-display tracking-[-0.05em] leading-[0.85] uppercase italic">
          {id ? 'Modify <span class="text-glow-gradient">Node</span>' : 'New <span class="text-glow-gradient">Deployment</span>'}
          <div dangerouslySetInnerHTML={{ __html: id ? 'Modify <span class="text-glow-gradient">Node</span>' : 'New <span class="text-glow-gradient">Deployment</span>' }} />
          <span className="sr-only">{id ? 'Modify Node' : 'New Deployment'}</span>
        </h1>
        <p className="text-muted-foreground text-sm font-bold italic border-l-2 border-primary/20 pl-6 mt-6">
          {id ? 'Recalibrate your engineered logic for maximum performance.' : 'Prepare your engineered logic for broadcast across the nebula network.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Basic Info */}
        <section className="bg-surface border border-border rounded-[3rem] p-10 md:p-14 shadow-elegant relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <h2 className="text-2xl font-black mb-10 flex items-center gap-4 text-foreground uppercase italic tracking-tighter">
            <Layers className="w-6 h-6 text-primary shadow-glow" />
            Core Identity
          </h2>
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4 italic">Protocol Title</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Minimalist AI Writing Dashboard"
                className="w-full px-6 py-5 bg-background border border-border rounded-3xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 text-foreground text-sm font-bold italic"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4 italic">Documentation Summary</label>
              <textarea 
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Declare the unique capabilities and logic of this module..."
                className="w-full px-6 py-5 bg-background border border-border rounded-3xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none placeholder:text-muted-foreground/30 text-foreground text-sm font-bold italic"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4 italic">Acquisition Value (USD)</label>
                <div className="relative group">
                  <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                  <input 
                    type="number" 
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="29.00"
                    className="w-full pl-14 pr-6 py-5 bg-background border border-border rounded-3xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 text-foreground text-sm font-bold italic"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4 italic">Classification</label>
                <div className="relative group">
                   <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-6 py-5 bg-background border border-border rounded-3xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-foreground text-sm font-black uppercase italic tracking-widest appearance-none cursor-pointer"
                  >
                    <option value="SaaS">SaaS</option>
                    <option value="AI Tool">AI Tool</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Game">Game</option>
                    <option value="Dashboard">Dashboard</option>
                    <option value="Landing Page">Landing Page</option>
                    <option value="Mobile App">Mobile App</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <ChevronRight className="w-5 h-5 rotate-90" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Info */}
        <section className="bg-surface border border-border rounded-[3rem] p-10 md:p-14 shadow-elegant relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
          <h2 className="text-2xl font-black mb-10 flex items-center gap-4 text-foreground uppercase italic tracking-tighter">
            <FileCode className="w-6 h-6 text-accent shadow-cyan-glow" />
            Engineering Specs
          </h2>
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4 italic">Architecture Stack</label>
              <div className="flex gap-3 mb-4">
                <input 
                  type="text" 
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                  placeholder="e.g. React, Fastify, Python"
                  className="flex-1 px-6 py-5 bg-background border border-border rounded-3xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 text-foreground text-sm font-bold italic"
                />
                <button 
                  type="button" 
                  onClick={addTech}
                  className="px-8 py-5 bg-primary text-white rounded-3xl font-black text-[11px] uppercase tracking-widest italic hover:shadow-glow transition-all active:scale-95"
                >
                  Inject
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {techStack.map(tech => (
                  <span key={tech} className="inline-flex items-center gap-3 px-5 py-2.5 bg-background border border-border rounded-full text-[10px] font-black text-foreground uppercase italic tracking-widest shadow-sm group-hover:border-primary/20 transition-all">
                    {tech}
                    <button type="button" onClick={() => removeTech(tech)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4 italic">Module Features</label>
              <div className="flex gap-3 mb-4">
                <input 
                  type="text" 
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  placeholder="e.g. SEO Optimized, Dark Mode"
                  className="flex-1 px-6 py-5 bg-background border border-border rounded-3xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 text-foreground text-sm font-bold italic"
                />
                <button 
                  type="button" 
                  onClick={addFeature}
                  className="px-8 py-5 bg-primary text-white rounded-3xl font-black text-[11px] uppercase tracking-widest italic hover:shadow-glow transition-all active:scale-95"
                >
                  Inject
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {features.map(feature => (
                  <span key={feature} className="inline-flex items-center gap-3 px-5 py-2.5 bg-background border border-border rounded-full text-[10px] font-black text-foreground uppercase italic tracking-widest shadow-sm group-hover:border-primary/20 transition-all">
                    {feature}
                    <button type="button" onClick={() => removeFeature(feature)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4 italic">Broadcast Preview (URL)</label>
              <div className="relative group">
                <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <input 
                  type="url" 
                  value={demoLink}
                  onChange={(e) => setDemoLink(e.target.value)}
                  placeholder="https://yourdemoapp.com"
                  className="w-full pl-14 pr-6 py-5 bg-background border border-border rounded-3xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 text-foreground text-sm font-bold italic"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4 italic">Private Logic Access (URL)</label>
              <div className="relative group">
                <FileCode className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <input 
                  type="url" 
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="e.g. Private Github Repo or Download link"
                  className="w-full pl-14 pr-6 py-5 bg-background border border-border rounded-3xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 text-foreground text-sm font-bold italic"
                />
              </div>
              <p className="mt-4 text-[10px] text-muted-foreground font-black uppercase tracking-widest ml-4 italic flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-glow" />
                This link is strictly isolated to verified logic-investors.
              </p>
            </div>
          </div>
        </section>

        {/* Media */}
        <section className="bg-surface border border-border rounded-[3rem] p-10 md:p-14 shadow-elegant relative overflow-hidden group">
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <h2 className="text-2xl font-black mb-10 flex items-center gap-4 text-foreground uppercase italic tracking-tighter">
            <Upload className="w-6 h-6 text-primary shadow-glow" />
            Visual Telemetry
          </h2>
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4 italic">Screenshot Transmissions (URLs)</label>
              {screenshots.map((url, i) => (
                <div key={i} className="flex gap-4">
                  <input 
                    type="url" 
                    value={url}
                    onChange={(e) => {
                      const newScreenshots = [...screenshots];
                      newScreenshots[i] = e.target.value;
                      setScreenshots(newScreenshots);
                    }}
                    placeholder="https://images.unsplash.com/your-image-id"
                    className="flex-1 px-6 py-5 bg-background border border-border rounded-3xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 text-foreground text-sm font-bold italic"
                  />
                  {screenshots.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => setScreenshots(screenshots.filter((_, idx) => idx !== i))}
                      className="w-16 h-16 flex items-center justify-center bg-destructive/10 text-destructive rounded-3xl hover:bg-destructive shadow-sm hover:text-white transition-all active:scale-90 border border-destructive/20"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => setScreenshots([...screenshots, ''])}
                className="mt-4 text-[11px] font-black text-primary hover:text-accent transition-all flex items-center gap-2 uppercase tracking-[0.3em] italic ml-4 group"
              >
                <div className="w-8 h-8 rounded-full border border-primary/30 flex items-center justify-center group-hover:scale-110 group-hover:border-accent transition-all">
                  <Plus className="w-4 h-4" />
                </div>
                Transmit New Frame
              </button>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-end gap-6 pt-8">
          <button 
            type="button" 
            onClick={() => navigate('/dashboard')}
            className="px-10 py-5 font-black text-muted-foreground hover:text-foreground transition-all text-[11px] uppercase tracking-[0.4em] italic active:scale-95"
          >
            Abort
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-14 py-6 bg-white text-background rounded-full font-black text-xl hover:bg-accent transition-all shadow-glow hover:shadow-cyan-glow disabled:opacity-50 uppercase italic tracking-tighter active:scale-95 ring-2 ring-white/10"
          >
            {loading ? (id ? 'Syncing...' : 'Deploying...') : (id ? 'Modify Protocol' : 'Broadcast Asset')}
          </button>
        </div>
      </form>
    </div>
  );
}
