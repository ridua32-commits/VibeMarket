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
      style={{ transitionDuration: '300ms' }}
      className="bg-card-gradient rounded-3xl border border-border p-3 shadow-elegant hover:shadow-glow hover:-translate-y-1 hover:border-primary/40 transition-all group flex flex-col h-full"
    >
      <Link to={`/listing/${listing.id}`}>
        <div className="aspect-[16/10] bg-surface rounded-[1.5rem] mb-6 relative overflow-hidden ring-1 ring-white/5">
          <img 
            src={listing.screenshots && listing.screenshots[0] ? listing.screenshots[0] : 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'} 
            alt={listing.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-4 left-4 flex gap-2">
            {listing.category === 'Landing Page' || listing.category === 'SaaS' ? (
              <div className="bg-primary/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-xl border border-white/10 italic">
                Premium Asset
              </div>
            ) : null}
          </div>
          <div className="absolute bottom-4 right-4 bg-surface-elevated/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider text-accent shadow-xl border border-border-strong group-hover:bg-accent group-hover:text-background transition-all">
             {listing.techStack && listing.techStack[0] ? listing.techStack[0] : 'React'}
          </div>
        </div>
      </Link>

      <div className="px-3 space-y-4 flex-1 pb-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <Link to={`/listing/${listing.id}`}>
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 tracking-tight">{listing.title}</h3>
            </Link>
            {listing.demoLink && (
              <a 
                href={listing.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-border bg-surface text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm"
                title="Live Preview"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          <div className="flex items-center gap-2">
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{listing.reviewCount || 0}+ Builders active</p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {listing.description}
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {listing.features?.slice(0, 2).map((feat, i) => (
            <span key={i} className="px-2.5 py-0.5 bg-surface-elevated border border-border rounded-full text-[9px] font-bold text-muted-foreground uppercase tracking-wide">
              {feat}
            </span>
          ))}
        </div>
      </div>
      
      <div className="px-3 flex items-center justify-between mt-auto pt-5 pb-2 border-t border-border">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Price</span>
          <span className="text-xl font-bold text-foreground tracking-tight leading-none">{formatPrice(listing.price)}</span>
        </div>
        <Link to={`/listing/${listing.id}`} className="px-5 py-2 bg-surface border border-border rounded-full text-[10px] font-bold text-foreground hover:bg-primary hover:text-white transition-all active:scale-[0.98] uppercase tracking-wider">
          View Detail
        </Link>
      </div>
    </motion.div>
  );
};
