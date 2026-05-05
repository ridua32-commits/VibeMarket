import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../App';
import { Order, Listing } from '../../types';
import { formatPrice, cn } from '../../lib/utils';
import { Download, ExternalLink, Calendar, CheckCircle2, ShoppingBag, Tag } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export default function Purchases() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<(Order & { listing?: Listing })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success');
  const listingId = searchParams.get('listingId');

  useEffect(() => {
    if (user) {
      if (success && listingId) {
        handleSuccessfulPurchase();
      } else {
        fetchPurchases();
      }
    }
  }, [user, success, listingId]);

  const handleSuccessfulPurchase = async () => {
    try {
      // First check if this order was already recorded
      const q = query(
        collection(db, 'orders'),
        where('buyerId', '==', user.uid),
        where('listingId', '==', listingId)
      );
      const snap = await getDocs(q);
      
      if (snap.empty) {
        // Fetch listing to get sellerId
        const listingDoc = await getDoc(doc(db, 'listings', listingId!));
        if (listingDoc.exists()) {
          const listingData = listingDoc.data() as Listing;
          await addDoc(collection(db, 'orders'), {
            buyerId: user.uid,
            sellerId: listingData.sellerId,
            listingId: listingId,
            amount: listingData.price,
            status: 'completed',
            createdAt: serverTimestamp(),
          });
        }
      }
      fetchPurchases();
    } catch (err) {
      console.error("Error saving purchase:", err);
      fetchPurchases();
    }
  };

  const fetchPurchases = async () => {
    try {
      const q = query(
        collection(db, 'orders'),
        where('buyerId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const orderData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      
      // For each order, fetch listing details
      const ordersWithListings = await Promise.all(orderData.map(async (order) => {
        const listingDoc = await getDocs(query(collection(db, 'listings'), where('id', '==', order.listingId)));
        const listing = listingDoc.docs[0]?.data() as Listing;
        return { ...order, listing };
      }));

      setOrders(ordersWithListings);
    } catch (err) {
      console.error("Error fetching purchases:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <div className="flex items-center gap-3 text-[11px] font-black text-accent uppercase tracking-[0.4em] mb-2 italic">
          <div className="w-8 h-px bg-accent/30" />
          Acquisition Log
        </div>
        <h1 className="text-5xl font-black text-foreground font-display tracking-[-0.05em] leading-[0.85] uppercase italic">
          Verified <span className="text-glow-gradient">Modules</span>
        </h1>
        <p className="text-muted-foreground text-sm font-bold italic border-l-2 border-primary/20 pl-6 mt-4">Access and download your engineered logic systems directly from the network.</p>
      </div>

      {success && (
        <div className="flex items-center gap-4 p-5 bg-primary/10 text-primary rounded-[2rem] border border-primary/20 mb-8 shadow-glow italic animate-pulse">
          <CheckCircle2 className="w-6 h-6" />
          <span className="font-black text-[11px] uppercase tracking-widest">Protocol Success: Acquisition verified and synced to your node library.</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-surface border border-border animate-shimmer rounded-[2.5rem]" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-surface/30 border-2 border-dashed border-border rounded-[3.5rem] p-24 text-center group">
          <div className="w-24 h-24 bg-surface border border-border rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-muted-foreground/30 shadow-inner group-hover/empty:scale-110 group-hover/empty:rotate-6 transition-all duration-500">
             <ShoppingBag className="w-10 h-10" />
          </div>
          <p className="text-foreground font-black text-xl uppercase tracking-tighter italic mb-4">Registry Empty</p>
          <p className="text-muted-foreground text-sm font-bold italic max-w-xs mx-auto mb-10">No modules have been acquisitioned yet. Explore the forge to discover elite logic.</p>
          <Link to="/marketplace" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-background rounded-full font-black text-[11px] uppercase tracking-widest italic hover:bg-accent transition-all shadow-glow active:scale-95">
            <ShoppingBag className="w-4 h-4" />
            Enter Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-surface border border-border rounded-[2.5rem] p-5 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-10 hover:border-primary/30 transition-all group shadow-elegant active:scale-[0.99] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="flex items-center gap-6 sm:gap-8 w-full">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-background rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border border-border shadow-sm group-hover:scale-110 transition-transform duration-500">
                  {order.listing?.screenshots?.[0] ? (
                    <img src={order.listing.screenshots[0]} className="w-full h-full object-cover" />
                  ) : (
                    <Tag className="w-8 h-8 text-muted-foreground/30" />
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="font-black text-2xl text-foreground font-display italic leading-none group-hover:text-glow-gradient transition-colors uppercase tracking-tighter">{order.listing?.title || 'Unknown Protocol'}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-black italic uppercase tracking-[0.2em] text-muted-foreground/60">
                    <span className="flex items-center gap-2 pr-4 border-r border-border"><Calendar className="w-3.5 h-3.5 text-accent" /> May 4, 2026</span>
                    <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black border",
                        order.status === 'completed' 
                          ? "bg-primary/10 text-primary border-primary/20 shadow-glow" 
                          : "bg-surface text-muted-foreground border-border"
                      )}>{order.status}</span>
                    <span className="text-foreground">{formatPrice(order.amount)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-white text-background rounded-full text-[11px] font-black uppercase italic tracking-tighter hover:bg-accent transition-all shadow-glow group/btn overflow-hidden relative active:scale-95">
                  <Download className="w-4 h-4 group-hover/btn:-translate-y-1 group-hover/btn:translate-x-0.5 transition-transform" />
                  Acquire Logic
                </button>
                <Link to={`/listing/${order.listingId}`} className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-5 bg-surface-elevated border border-border rounded-full text-[11px] font-black text-foreground hover:bg-surface hover:border-primary/20 transition-all uppercase italic tracking-widest active:scale-95">
                  Registry
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ShoppingBagIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
  );
}

function TagIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
  );
}
