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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">{id ? 'Edit Listing' : 'Create New Listing'}</h1>
        <p className="text-slate-500">{id ? 'Update your masterpiece details.' : 'Put your vibe-coded masterpiece on the market.'}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            General Information
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Listing Title</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Minimalist AI Writing Dashboard"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea 
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Tell buyers what makes this app special..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Price (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="number" 
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="29.00"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                >
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
        </section>

        {/* Technical Info */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-500" />
            Technical Details
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Tech Stack</label>
              <div className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                  placeholder="e.g. React, Fastify, Python"
                  className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
                <button 
                  type="button" 
                  onClick={addTech}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.map(tech => (
                  <span key={tech} className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium text-slate-700">
                    {tech}
                    <button type="button" onClick={() => removeTech(tech)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Key Features</label>
              <div className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  placeholder="e.g. SEO Optimized, Responsive Design, Dark Mode"
                  className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
                <button 
                  type="button" 
                  onClick={addFeature}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {features.map(feature => (
                  <span key={feature} className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium text-slate-700">
                    {feature}
                    <button type="button" onClick={() => removeFeature(feature)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Demo Link (Optional)</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="url" 
                  value={demoLink}
                  onChange={(e) => setDemoLink(e.target.value)}
                  placeholder="https://yourdemoapp.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Asset Download Link (Private)</label>
              <div className="relative">
                <FileCode className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="url" 
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="e.g. Google Drive link, Github Repo, or Dropbox link"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-400 italic">This link will only be shared with verified buyers.</p>
            </div>
          </div>
        </section>

        {/* Media */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-500" />
            Media & Screenshots
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Product Images (URLs)</label>
              {screenshots.map((url, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input 
                    type="url" 
                    value={url}
                    onChange={(e) => {
                      const newScreenshots = [...screenshots];
                      newScreenshots[i] = e.target.value;
                      setScreenshots(newScreenshots);
                    }}
                    placeholder="https://images.unsplash.com/your-image-id"
                    className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                  {screenshots.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => setScreenshots(screenshots.filter((_, idx) => idx !== i))}
                      className="px-4 py-3 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => setScreenshots([...screenshots, ''])}
                className="mt-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Image
              </button>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-end gap-4 pt-4">
          <button 
            type="button" 
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 font-bold text-slate-400 hover:text-slate-600 transition-all text-xs uppercase tracking-widest"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
          >
            {loading ? (id ? 'Updating...' : 'Creating...') : (id ? 'Update Asset' : 'Publish Asset')}
          </button>
        </div>
      </form>
    </div>
  );
}
