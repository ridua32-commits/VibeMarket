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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display italic">Listings Inventory</h2>
          <p className="text-slate-500 text-sm">Moderate and monitor all marketplace assets.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm w-full md:w-64"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asset</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-12 w-64 bg-slate-50 rounded-lg" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-50 rounded-full" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-16 bg-slate-50 rounded-md" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-24 bg-slate-50 rounded-full" /></td>
                    <td className="px-6 py-4"><div className="h-8 w-24 bg-slate-50 rounded-full ml-auto" /></td>
                  </tr>
                ))
              ) : filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">No listings found.</td>
                </tr>
              ) : (
                filteredListings.map((l) => (
                  <motion.tr 
                    key={l.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                          {l.screenshots?.[0] ? (
                            <img src={l.screenshots[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Tag className="w-4 h-4 text-slate-300 m-auto" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm leading-none mb-1 line-clamp-1">{l.title}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {l.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">
                        {l.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                      ${l.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={l.status}
                        onChange={(e) => updateStatus(l.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border outline-none
                          ${l.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 
                            l.status === 'suspended' ? 'bg-red-50 text-red-700 border-red-100' : 
                            'bg-slate-50 text-slate-600 border-slate-200'}`}
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="sold">Sold</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/listing/${l.id}`} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="View Listing">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => deleteListing(l.id)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Delete Listing"
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
