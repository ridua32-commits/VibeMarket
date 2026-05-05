import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../../lib/firebase';
import { Order } from '../../types';
import { DollarSign, Package, Calendar, Clock, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';

export default function ManageOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const path = 'orders';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(items);
    } catch (error) {
      handleFirestoreError(auth, error, OperationType.GET, path);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => order.status === 'completed' ? sum + order.amount : sum, 0);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4 border-b border-border">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-[11px] font-black text-accent uppercase tracking-[0.4em] mb-2 italic">
            <div className="w-8 h-px bg-accent/30" />
            Ledger Broadcast
          </div>
          <h1 className="text-5xl font-black text-foreground font-display tracking-[-0.05em] leading-[0.85] uppercase italic">
            Network <span className="text-glow-gradient">Volume</span>
          </h1>
          <p className="text-muted-foreground text-sm font-bold italic border-l-2 border-primary/20 pl-6 mt-4">Real-time ledger of all protocol acquisition events across the nebula.</p>
        </div>
        <div className="flex items-center gap-6 bg-surface border border-border rounded-[2.5rem] p-6 shadow-elegant hover:border-primary/20 transition-all group">
           <div className="w-16 h-16 rounded-[1.5rem] bg-background border border-border flex items-center justify-center text-primary shadow-glow group-hover:scale-110 transition-transform">
              <DollarSign className="w-8 h-8" />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1 italic">Aggregate Flux</p>
              <p className="text-4xl font-black font-display text-glow-gradient tracking-tighter leading-none italic uppercase">${totalRevenue.toLocaleString()}</p>
           </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-[3.5rem] overflow-hidden shadow-elegant">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-elevated/50 border-b border-border">
                <th className="px-6 py-5 sm:px-10 sm:py-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] italic">Transmission hash</th>
                <th className="px-6 py-5 sm:px-10 sm:py-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] italic">Originator ID</th>
                <th className="px-6 py-5 sm:px-10 sm:py-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] italic">Flux Amount</th>
                <th className="px-6 py-5 sm:px-10 sm:py-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] italic">Sync Status</th>
                <th className="px-6 py-5 sm:px-10 sm:py-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] italic">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-shimmer">
                    <td className="px-6 py-5 sm:px-10 sm:py-8"><div className="h-6 w-32 bg-surface-elevated rounded-lg" /></td>
                    <td className="px-6 py-5 sm:px-10 sm:py-8"><div className="h-6 w-48 bg-surface-elevated rounded-lg" /></td>
                    <td className="px-6 py-5 sm:px-10 sm:py-8"><div className="h-6 w-16 bg-surface-elevated rounded-lg" /></td>
                    <td className="px-6 py-5 sm:px-10 sm:py-8"><div className="h-6 w-24 bg-surface-elevated rounded-full" /></td>
                    <td className="px-6 py-5 sm:px-10 sm:py-8"><div className="h-6 w-24 bg-surface-elevated rounded-lg" /></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 sm:px-10 sm:py-24 text-center text-muted-foreground/30 font-black uppercase tracking-widest italic">Ledger Null: No transactions recorded.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <motion.tr 
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-primary/5 transition-all group"
                  >
                    <td className="px-6 py-5 sm:px-10 sm:py-8">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                          <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <span className="font-black text-foreground text-[10px] sm:text-xs tracking-widest uppercase italic group-hover:text-glow transition-all whitespace-nowrap">#{order.id.substring(0, 8)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 sm:px-10 sm:py-8">
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest truncate max-w-[100px] sm:max-w-[150px] italic opacity-60">{order.buyerId}</p>
                    </td>
                    <td className="px-6 py-5 sm:px-10 sm:py-8">
                      <span className="font-black text-foreground text-sm sm:text-base tracking-tighter italic whitespace-nowrap">${order.amount.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-5 sm:px-10 sm:py-8">
                      <div className={`inline-flex items-center gap-3 px-3 sm:px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border italic whitespace-nowrap
                        ${order.status === 'completed' ? 'bg-primary/10 text-primary border-primary/20 shadow-glow' : 
                          order.status === 'failed' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                          'bg-surface-elevated text-muted-foreground border-border'}`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${order.status === 'completed' ? 'bg-primary' : order.status === 'failed' ? 'bg-destructive' : 'bg-muted-foreground'}`} />
                        {order.status}
                      </div>
                    </td>
                    <td className="px-6 py-5 sm:px-10 sm:py-8">
                      <div className="flex items-center gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest italic opacity-60 whitespace-nowrap">
                        <Calendar className="w-4 h-4 text-primary/40" />
                        {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'N/A'}
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
