import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../../lib/firebase';
import { UserProfile } from '../../types';
import { Search, Shield, User, Mail, Calendar, MoreVertical, Edit2, Ban } from 'lucide-react';
import { motion } from 'motion/react';

export default function ManageUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const path = 'users';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({ ...doc.data() } as UserProfile));
      setUsers(items);
    } catch (error) {
      handleFirestoreError(auth, error, OperationType.GET, path);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (uid: string, newRole: string) => {
    const path = `users/${uid}`;
    try {
      await updateDoc(doc(db, 'users', uid), { role: newRole });
      setUsers(users.map(u => u.uid === uid ? { ...u, role: newRole as any } : u));
    } catch (error) {
      handleFirestoreError(auth, error, OperationType.UPDATE, path);
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4 border-b border-border">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-[11px] font-black text-accent uppercase tracking-[0.4em] mb-2 italic">
            <div className="w-8 h-px bg-accent/30" />
            Registry Control
          </div>
          <h1 className="text-5xl font-black text-foreground font-display tracking-[-0.05em] leading-[0.85] uppercase italic">
            Node <span className="text-glow-gradient">Command</span>
          </h1>
          <p className="text-muted-foreground text-sm font-bold italic border-l-2 border-primary/20 pl-6 mt-4">Review and manage platform members and access hierarchies.</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-glow transition-colors" />
          <input
            type="text"
            placeholder="Search Registry..."
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
                <th className="px-6 py-5 sm:px-10 sm:py-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] italic">Identity</th>
                <th className="px-6 py-5 sm:px-10 sm:py-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] italic">Access Tier</th>
                <th className="px-6 py-5 sm:px-10 sm:py-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] italic">Activation</th>
                <th className="px-6 py-5 sm:px-10 sm:py-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] italic text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-shimmer">
                    <td className="px-6 py-5 sm:px-10 sm:py-8"><div className="h-10 w-48 bg-surface-elevated rounded-2xl" /></td>
                    <td className="px-6 py-5 sm:px-10 sm:py-8"><div className="h-6 w-16 bg-surface-elevated rounded-full" /></td>
                    <td className="px-6 py-5 sm:px-10 sm:py-8"><div className="h-4 w-24 bg-surface-elevated rounded-md" /></td>
                    <td className="px-6 py-5 sm:px-10 sm:py-8"><div className="h-8 w-8 bg-surface-elevated rounded-full ml-auto" /></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 sm:px-10 sm:py-24 text-center text-muted-foreground/30 font-black uppercase tracking-widest italic">Registry Void: No data matches.</td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <motion.tr 
                    key={u.uid}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-primary/5 transition-all group"
                  >
                    <td className="px-6 py-5 sm:px-10 sm:py-8">
                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-[1.25rem] bg-background border border-border flex items-center justify-center shrink-0 shadow-glow group-hover:scale-110 transition-transform">
                          {u.avatarUrl ? (
                            <img src={u.avatarUrl} alt="" className="w-full h-full rounded-[1.25rem] object-cover" />
                          ) : (
                            <User className="w-7 h-7 text-primary/30" />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-foreground text-base uppercase tracking-tighter italic leading-none mb-2 group-hover:text-glow-gradient transition-colors">{u.displayName || 'Anonymous Node'}</p>
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 sm:px-10 sm:py-8">
                      <select
                        value={u.role}
                        onChange={(e) => updateUserRole(u.uid, e.target.value)}
                        className={`px-3 sm:px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border outline-none cursor-pointer transition-all appearance-none text-center italic
                          ${u.role === 'admin' ? 'bg-primary/10 text-primary border-primary/20 shadow-glow' : 
                            u.role === 'seller' ? 'bg-accent/10 text-accent border-accent/20 shadow-cyan-glow' : 
                            'bg-surface-elevated text-muted-foreground border-border'}`}
                      >
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-5 sm:px-10 sm:py-8">
                      <div className="flex items-center gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest italic whitespace-nowrap">
                        <Calendar className="w-4 h-4 text-primary" />
                        {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-5 sm:px-10 sm:py-8 text-right">
                      <button className="p-2 sm:p-3 bg-surface-elevated border border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all shadow-sm active:scale-95">
                        <MoreVertical className="w-4 h-4" />
                      </button>
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
