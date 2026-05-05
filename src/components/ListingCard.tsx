import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Listing } from '../types';
import { formatPrice } from '../lib/utils';

interface ListingCardProps {
  listing: Listing;
  index: number;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-white rounded-[2rem] border border-slate-200 p-3 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all group flex flex-col h-full"
    >
      <Link to={`/listing/${listing.id}`}>
        <div className="aspect-[16/10] bg-slate-50 rounded-[1.5rem] mb-6 relative overflow-hidden">
          <img 
            src={listing.screenshots && listing.screenshots[0] ? listing.screenshots[0] : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'} 
            alt={listing.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            {listing.category === 'Landing Page' || listing.category === 'SaaS' ? (
              <div className="bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-xl border border-white/10">
                Premium Template
              </div>
            ) : null}
          </div>
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-slate-900 shadow-xl border border-slate-100">
             {listing.techStack && listing.techStack[0] ? listing.techStack[0] : 'React'}
          </div>
        </div>
      </Link>

      <div className="px-3 space-y-4 flex-1 pb-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <Link to={`/listing/${listing.id}`}>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 font-display tracking-tight leading-tight">{listing.title}</h3>
            </Link>
            {listing.demoLink && (
              <a 
                href={listing.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-slate-100 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white hover:border-indigo-100 transition-all shadow-sm"
                title="Live Preview"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          <div className="flex items-center gap-2">
             <div className="flex -space-x-1">
               {[1,2].map(i => (
                 <div key={i} className="w-4 h-4 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + index}`} alt="User" />
                 </div>
               ))}
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{listing.reviewCount || 0}+ Builders</p>
          </div>
        </div>
        
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
          {listing.description}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {listing.features?.slice(0, 2).map((feat, i) => (
            <span key={i} className="px-2.5 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
              {feat}
            </span>
          ))}
        </div>
      </div>
      
      <div className="px-3 flex items-center justify-between mt-auto pt-4 pb-2 border-t border-slate-50">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Starting at</span>
          <span className="text-xl font-bold text-slate-900 tracking-tight">{formatPrice(listing.price)}</span>
        </div>
        <Link to={`/listing/${listing.id}`} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-600 hover:bg-slate-900 hover:text-white transition-all">
          View Detail
        </Link>
      </div>
    </motion.div>
  );
};
