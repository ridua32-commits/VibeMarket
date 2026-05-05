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
    <div className="max-w-2xl space-y-12">
      <div>
        <div className="flex items-center gap-3 text-[11px] font-black text-accent uppercase tracking-[0.4em] mb-3 italic">
          <div className="w-8 h-px bg-accent/30" />
          Node Configuration
        </div>
        <h1 className="text-5xl font-black text-foreground font-display tracking-[-0.05em] leading-[0.85] uppercase italic">
          Account <span className="text-glow-gradient">Protocols</span>
        </h1>
        <p className="text-muted-foreground text-sm font-bold italic border-l-2 border-primary/20 pl-6 mt-6">
          Optimize your identify parameters and engineer your session credentials.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-[3rem] overflow-hidden shadow-elegant">
        <div className="p-10 border-b border-border flex items-center gap-8 bg-surface-elevated/30">
          <div className="relative group">
            <div className="w-28 h-28 bg-background border-4 border-surface-elevated rounded-[2rem] flex items-center justify-center overflow-hidden shadow-glow transition-transform group-hover:scale-105">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-muted-foreground/30" />
              )}
            </div>
            <button className="absolute -bottom-2 -right-2 p-3 bg-primary text-white rounded-2xl shadow-glow hover:bg-accent transition-all active:scale-90 border border-white/20">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h3 className="text-3xl font-black text-foreground italic uppercase tracking-tighter leading-none mb-2">{profile?.displayName}</h3>
            <p className="text-muted-foreground text-xs font-bold italic opacity-60 mb-4">{profile?.email}</p>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[9px] font-black uppercase tracking-[0.2em] italic shadow-glow">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              {profile?.role} Authorization
            </span>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="p-10 md:p-12 space-y-8">
          {success && (
            <div className="p-5 bg-primary/10 text-primary text-[11px] font-black uppercase tracking-widest rounded-2xl border border-primary/20 italic text-center animate-pulse">
              System Sync Complete: Identity Repropagated.
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4 italic">Public Identify Handle</label>
            <input 
              type="text" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-6 py-5 bg-background border border-border rounded-3xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-foreground text-sm font-bold italic"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4 italic">Direct Comms (WhatsApp)</label>
            <input 
              type="tel" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              className="w-full px-6 py-5 bg-background border border-border rounded-3xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-foreground text-sm font-bold italic"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4 italic">Core Node Bio</label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell us about your engineering philosophy..."
              className="w-full px-6 py-5 bg-background border border-border rounded-3xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none text-foreground text-sm font-bold italic"
            />
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="px-12 py-5 bg-white text-background rounded-full font-black text-xs uppercase tracking-tighter hover:bg-accent transition-all shadow-glow hover:shadow-cyan-glow disabled:opacity-50 italic active:scale-95"
            >
              {loading ? 'Propagating...' : 'Commit Changes'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-surface border border-border rounded-[3rem] p-10 md:p-12 space-y-10 shadow-elegant relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
        <h2 className="text-2xl font-black flex items-center gap-4 text-foreground uppercase italic tracking-tighter">
          <Shield className="w-6 h-6 text-accent shadow-cyan-glow" />
          Shield & Treasury
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-6 bg-background border border-border rounded-[2.5rem] group hover:border-primary/20 transition-all">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-tight text-foreground italic leading-none mb-1">Treasury Link</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic opacity-60">Payout architecture status</p>
              </div>
            </div>
            <button className="text-xs font-black text-primary hover:text-accent uppercase tracking-widest italic transition-colors">Connect Stripe</button>
          </div>
          
          <div className="flex items-center justify-between p-6 bg-background border border-border rounded-[2.5rem] group hover:border-primary/20 transition-all">
            <div className="flex items-center gap-5">
               <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-tight text-foreground italic leading-none mb-1">Signal Alerts</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic opacity-60">Direct telemetry for events</p>
              </div>
            </div>
            <div className="w-12 h-6 bg-primary/20 border border-primary/30 rounded-full relative group">
              <div className="absolute right-1 top-1 w-4 h-4 bg-primary rounded-full shadow-glow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
