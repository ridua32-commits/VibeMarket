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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold font-display italic">Transaction History</h2>
          <p className="text-slate-500 text-sm">Real-time ledger of all platform volume.</p>
        </div>
        <div className="flex items-center gap-4 bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-100">
           <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
           </div>
           <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Total Volume</p>
              <p className="text-2xl font-bold font-display">${totalRevenue.toLocaleString()}</p>
           </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-6 w-32 bg-slate-50 rounded-lg" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-48 bg-slate-50 rounded-lg" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-16 bg-slate-50 rounded-lg" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-24 bg-slate-50 rounded-full" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-24 bg-slate-50 rounded-lg" /></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">No transactions found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <motion.tr 
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Package className="w-4 h-4 text-slate-400" />
                        </div>
                        <span className="font-bold text-slate-900 text-xs tracking-widest uppercase">#{order.id.substring(0, 6)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-500 font-medium truncate max-w-[150px]">{order.buyerId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 text-sm">${order.amount.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${order.status === 'completed' ? 'bg-green-50 text-green-700' : 
                          order.status === 'failed' ? 'bg-red-50 text-red-700' : 
                          'bg-amber-50 text-amber-700'}`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'completed' ? 'bg-green-500' : order.status === 'failed' ? 'bg-red-500' : 'bg-amber-500'}`} />
                        {order.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5" />
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
