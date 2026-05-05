import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { User, Camera, Shield, Bell, CreditCard } from 'lucide-react';

export default function SettingsPage({ profile }: { profile: UserProfile | null }) {
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);
    setSuccess(false);

    try {
      await updateDoc(doc(db, 'users', profile.uid), {
        displayName,
        phoneNumber,
        bio,
      });
      setSuccess(true);
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-slate-500">Manage your profile and account preferences.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-900 shadow-md">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-slate-400" />
              )}
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-all opacity-0 group-hover:opacity-100">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h3 className="text-xl font-bold">{profile?.displayName}</h3>
            <p className="text-slate-500 text-sm">{profile?.email}</p>
            <span className="mt-2 inline-block px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded text-[10px] font-bold uppercase tracking-widest">{profile?.role} Account</span>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="p-8 space-y-6">
          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-sm rounded-lg border border-green-100 dark:border-green-900/50">
              Profile updated successfully!
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">Display Name</label>
            <input 
              type="text" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Phone Number (WhatsApp)</label>
            <input 
              type="tel" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Bio</label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-500" />
          Security & Payments
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-slate-400" />
              <div>
                <p className="font-semibold text-sm">Payout Method</p>
                <p className="text-xs text-slate-500">Not connected</p>
              </div>
            </div>
            <button className="text-sm font-bold text-indigo-600 hover:underline">Connect Stripe</button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-slate-400" />
              <div>
                <p className="font-semibold text-sm">Notifications</p>
                <p className="text-xs text-slate-500">Email alerts for sales</p>
              </div>
            </div>
            <div className="w-10 h-5 bg-indigo-600 rounded-full relative">
              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
