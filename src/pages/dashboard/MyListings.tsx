import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../../lib/firebase';
import { useAuth } from '../../App';
import { Listing } from '../../types';
import { formatPrice, cn } from '../../lib/utils';
import { Edit2, Trash2, Eye, ExternalLink, BarChart3, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyListings();
    }
  }, [user]);

  const fetchMyListings = async () => {
    setLoading(true);
    const path = 'listings';
    try {
      if (!user) return;
      const q = query(
        collection(db, path),
        where('sellerId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
      setListings(items);
    } catch (err) {
      handleFirestoreError(auth, err, OperationType.LIST, path);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      const path = `listings/${id}`;
      try {
        await deleteDoc(doc(db, 'listings', id));
        setListings(listings.filter(l => l.id !== id));
      } catch (err) {
        handleFirestoreError(auth, err, OperationType.DELETE, path);
      }
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-[11px] font-black text-accent uppercase tracking-[0.4em] mb-2 italic">
            <div className="w-8 h-px bg-accent/30" />
            Inventory Protocol
          </div>
          <h1 className="text-5xl font-black text-foreground font-display tracking-[-0.05em] leading-[0.85] uppercase italic">
            Your <span className="text-glow-gradient">Deployments</span>
          </h1>
          <p className="text-muted-foreground text-sm font-bold italic border-l-2 border-primary/20 pl-6 mt-4">Manage your engineered logic and track system throughput.</p>
        </div>
        <Link 
          to="/dashboard/sell" 
          className="flex items-center gap-3 px-10 py-5 bg-white text-background rounded-full font-black text-sm uppercase italic tracking-tighter hover:bg-accent transition-all shadow-glow hover:scale-105 active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Initialize New Listing
        </Link>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1,2,3].map(i => <div key={i} className="h-28 bg-surface border border-border animate-shimmer rounded-[2.5rem]" />)}
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-surface/30 border-2 border-dashed border-border rounded-[3.5rem] p-24 text-center group">
          <div className="w-24 h-24 bg-surface border border-border rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-muted-foreground/30 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
             <Plus className="w-10 h-10" />
          </div>
          <p className="text-foreground font-black text-xl uppercase tracking-tighter italic mb-4">No Nodes Active</p>
          <p className="text-muted-foreground text-sm font-bold italic max-w-xs mx-auto mb-10">Your digital library is currently empty. Broadcast your first deployment to begin.</p>
          <Link to="/dashboard/sell" className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-white rounded-full font-black text-[11px] uppercase tracking-widest italic hover:shadow-glow transition-all active:scale-95">
            <Plus className="w-4 h-4" />
            Publish First Module
          </Link>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-[3rem] overflow-hidden shadow-elegant relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-elevated/50">
                  <th className="px-6 py-5 sm:px-8 sm:py-6 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground border-b border-border italic">Module</th>
                  <th className="px-6 py-5 sm:px-8 sm:py-6 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground border-b border-border italic">Price</th>
                  <th className="px-6 py-5 sm:px-8 sm:py-6 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground border-b border-border italic">Network Hits</th>
                  <th className="px-6 py-5 sm:px-8 sm:py-6 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground border-b border-border italic">Status</th>
                  <th className="px-6 py-5 sm:px-8 sm:py-6 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground border-b border-border italic text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-5 sm:px-8 sm:py-6">
                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-background border border-border overflow-hidden shrink-0 shadow-sm transition-transform group-hover:scale-110">
                          <img src={listing.screenshots[0]} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-black text-foreground uppercase italic tracking-tighter text-base sm:text-lg leading-none mb-1 whitespace-nowrap">{listing.title}</p>
                          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{listing.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 sm:px-8 sm:py-6 font-black text-foreground italic text-base sm:text-lg tracking-tighter whitespace-nowrap">
                      {formatPrice(listing.price)}
                    </td>
                    <td className="px-6 py-5 sm:px-8 sm:py-6">
                      <div className="flex items-center gap-2 font-black text-accent italic uppercase tracking-tighter">
                        <BarChart3 className="w-4 h-4 shadow-cyan-glow" />
                        0
                      </div>
                    </td>
                    <td className="px-6 py-5 sm:px-8 sm:py-6">
                      <span className={cn(
                        "px-3 sm:px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] italic border whitespace-nowrap",
                        listing.status === 'active' 
                          ? "bg-primary/10 text-primary border-primary/20" 
                          : "bg-surface text-muted-foreground border-border"
                      )}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 sm:px-8 sm:py-6">
                      <div className="flex items-center justify-end gap-3">
                        <Link to={`/listing/${listing.id}`} className="w-10 h-10 flex items-center justify-center p-2 text-muted-foreground hover:text-accent transition-all rounded-xl hover:bg-surface-elevated border border-transparent hover:border-border active:scale-90">
                          <Eye className="w-5 h-5" />
                        </Link>
                        <Link to={`/dashboard/edit/${listing.id}`} className="w-10 h-10 flex items-center justify-center p-2 text-muted-foreground hover:text-primary transition-all rounded-xl hover:bg-surface-elevated border border-transparent hover:border-border active:scale-90">
                          <Edit2 className="w-5 h-5" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(listing.id)}
                          className="w-10 h-10 flex items-center justify-center p-2 text-muted-foreground hover:text-destructive transition-all rounded-xl hover:bg-destructive/10 border border-transparent hover:border-destructive/20 active:scale-90"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
