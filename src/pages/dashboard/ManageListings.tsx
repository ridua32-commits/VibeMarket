import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, orderBy, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../../lib/firebase';
import { Listing } from '../../types';
import { Search, Tag, Eye, CheckCircle, XCircle, Trash2, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function ManageListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    const path = 'listings';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
      setListings(items);
    } catch (error) {
      handleFirestoreError(auth, error, OperationType.GET, path);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const path = `listings/${id}`;
    try {
      await updateDoc(doc(db, 'listings', id), { status: newStatus, updatedAt: new Date() });
      setListings(listings.map(l => l.id === id ? { ...l, status: newStatus as any } : l));
    } catch (error) {
      handleFirestoreError(auth, error, OperationType.UPDATE, path);
    }
  };

  const deleteListing = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this listing permanently?')) return;
    const path = `listings/${id}`;
    try {
      await deleteDoc(doc(db, 'listings', id));
      setListings(listings.filter(l => l.id !== id));
    } catch (error) {
      handleFirestoreError(auth, error, OperationType.DELETE, path);
    }
  };

  const filteredListings = listings.filter(l => 
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4 border-b border-border">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-[11px] font-black text-accent uppercase tracking-[0.4em] mb-2 italic">
            <div className="w-8 h-px bg-accent/30" />
            Module Inventory
          </div>
          <h1 className="text-5xl font-black text-foreground font-display tracking-[-0.05em] leading-[0.85] uppercase italic">
            Assets <span className="text-glow-gradient">Forge</span>
          </h1>
          <p className="text-muted-foreground text-sm font-bold italic border-l-2 border-primary/20 pl-6 mt-4">Moderate and monitor engineered logic systems broadcasted across the network.</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-glow transition-colors" />
          <input
            type="text"
            placeholder="Search Modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-14 pr-6 py-4 bg-surface border border-border rounded-full focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-[11px] font-black uppercase tracking-widest italic w-full md:w-80 placeholder:text-muted-foreground/30 shadow-elegant transition-all text-foreground"
          />
        </div>
      </div>

      <div className="bg-surface border border-border rounded-[3.5rem] overflow-hidden shadow-elegant">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-elevated/50 border-b border-border">
                <th className="px-6 py-5 sm:px-10 sm:py-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] italic">Protocol</th>
                <th className="px-6 py-5 sm:px-10 sm:py-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] italic">Category</th>
                <th className="px-6 py-5 sm:px-10 sm:py-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] italic">Value</th>
                <th className="px-6 py-5 sm:px-10 sm:py-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] italic">Broadcast Status</th>
                <th className="px-6 py-5 sm:px-10 sm:py-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] italic text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-shimmer">
                    <td className="px-6 py-5 sm:px-10 sm:py-8"><div className="h-12 w-64 bg-surface-elevated rounded-2xl" /></td>
                    <td className="px-6 py-5 sm:px-10 sm:py-8"><div className="h-6 w-20 bg-surface-elevated rounded-full" /></td>
                    <td className="px-6 py-5 sm:px-10 sm:py-8"><div className="h-6 w-16 bg-surface-elevated rounded-md" /></td>
                    <td className="px-6 py-5 sm:px-10 sm:py-8"><div className="h-6 w-24 bg-surface-elevated rounded-full" /></td>
                    <td className="px-6 py-5 sm:px-10 sm:py-8"><div className="h-8 w-24 bg-surface-elevated rounded-full ml-auto" /></td>
                  </tr>
                ))
              ) : filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 sm:px-10 sm:py-24 text-center text-muted-foreground/30 font-black uppercase tracking-widest italic">Forge Depleted: No assets found.</td>
                </tr>
              ) : (
                filteredListings.map((l) => (
                  <motion.tr 
                    key={l.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-primary/5 transition-all group"
                  >
                    <td className="px-6 py-5 sm:px-10 sm:py-8">
                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className="w-12 h-8 sm:w-16 sm:h-10 rounded-lg bg-background border border-border flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform overflow-hidden px-1">
                          {l.screenshots?.[0] ? (
                            <img src={l.screenshots[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Tag className="w-4 h-4 text-primary/30" />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-foreground text-sm uppercase tracking-tighter italic leading-none mb-2 group-hover:text-glow-gradient transition-colors line-clamp-1">{l.title}</p>
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">REF: {l.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 sm:px-10 sm:py-8">
                      <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-surface-elevated text-muted-foreground border border-border rounded-full text-[9px] font-black uppercase tracking-widest italic whitespace-nowrap">
                        {l.category}
                      </span>
                    </td>
                    <td className="px-6 py-5 sm:px-10 sm:py-8 font-black text-foreground text-sm sm:text-base tracking-tighter italic whitespace-nowrap">
                      ${l.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-5 sm:px-10 sm:py-8">
                      <select
                        value={l.status}
                        onChange={(e) => updateStatus(l.id, e.target.value)}
                        className={`px-3 sm:px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border outline-none cursor-pointer transition-all appearance-none text-center italic mb-1
                          ${l.status === 'active' ? 'bg-primary/10 text-primary border-primary/20 shadow-glow' : 
                            l.status === 'suspended' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                            'bg-surface-elevated text-muted-foreground border-border'}`}
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="sold">Sold</option>
                      </select>
                    </td>
                    <td className="px-6 py-5 sm:px-10 sm:py-8 text-right">
                      <div className="flex items-center justify-end gap-2 sm:gap-3">
                        <Link to={`/listing/${l.id}`} className="p-2 sm:p-3 bg-surface-elevated border border-border rounded-lg sm:rounded-xl text-muted-foreground hover:text-primary hover:border-primary/30 transition-all shadow-sm active:scale-95" title="Inspect Node">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => deleteListing(l.id)}
                          className="p-2 sm:p-3 bg-surface-elevated border border-border rounded-lg sm:rounded-xl text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all shadow-sm active:scale-95" title="Purge Node"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
