export type UserRole = 'buyer' | 'seller' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phoneNumber?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: any;
}

export interface Listing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  techStack: string[];
  features: string[];
  fileUrl?: string;
  demoLink?: string;
  screenshots: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  status: 'draft' | 'pending' | 'active' | 'suspended';
  createdAt: any;
  updatedAt: any;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  listingId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: any;
}

export interface Review {
  id: string;
  listingId: string;
  buyerId: string;
  rating: number;
  comment: string;
  createdAt: any;
}
