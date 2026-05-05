import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../App';
import { Order, Listing } from '../../types';
import { formatPrice } from '../../lib/utils';
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1 text-slate-900 font-display italic">My Purchases</h1>
        <p className="text-slate-500 text-sm font-medium">Access and download your verified vibed-coded assets.</p>
      </div>

      {success && (
        <div className="flex items-center gap-3 p-4 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100 mb-6 shadow-sm shadow-indigo-50">
          <CheckCircle2 className="w-5 h-5 text-indigo-600" />
          <span className="font-bold text-xs uppercase tracking-tight">Purchase successful! Your asset is now available below.</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1,2].map(i => <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-2xl" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-white border border-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300 shadow-sm">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900 font-display">No purchases yet</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">Explore the marketplace and find your next vibe-coded app.</p>
          </div>
          <Link to="/marketplace" className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition-all group">
              <div className="flex items-center gap-4 w-full">
                <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                  {order.listing?.screenshots?.[0] ? (
                    <img src={order.listing.screenshots[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <Tag className="w-6 h-6 text-slate-300" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 font-display italic leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{order.listing?.title || 'Unknown Asset'}</h3>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> May 4, 2026</span>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md">{order.status}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
                <Link to={`/listing/${order.listingId}`} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                  Details
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
