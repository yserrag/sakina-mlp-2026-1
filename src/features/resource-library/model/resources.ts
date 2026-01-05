import { BookOpen, Plane, Coffee, Smartphone, Heart, Compass } from 'lucide-react';

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  priceRange: '$' | '$$' | '$$$';
  imageUrl: string;
  affiliateLink: string;
  badge?: string;
}

export interface ResourceCategory {
  id: string;
  title: string;
  description: string;
  icon: any;
  items: ResourceItem[];
}

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    id: 'spiritual',
    title: 'Spiritual Growth',
    description: 'Essential reading and tools for your connection with Allah.',
    icon: BookOpen,
    items: [
      {
        id: 'quran-clear',
        title: 'The Clear Quran',
        description: 'A thematic English translation by Dr. Mustafa Khattab. Easy to read and perfect for daily reflection.',
        priceRange: '$$',
        imageUrl: 'https://placehold.co/400x300/115e59/ffffff?text=The+Clear+Quran',
        affiliateLink: '#',
        badge: 'Best Seller'
      },
      {
        id: 'sealed-nectar',
        title: 'The Sealed Nectar',
        description: 'The award-winning biography of Prophet Muhammad (SAW). A must-have for every Muslim home.',
        priceRange: '$$',
        imageUrl: 'https://placehold.co/400x300/0f766e/ffffff?text=Sealed+Nectar',
        affiliateLink: '#'
      },
      {
        id: 'digital-tasbih',
        title: 'Smart Tasbih Ring',
        description: 'Track your Dhikr digitally with this OLED ring that syncs to your phone. Modern piety.',
        priceRange: '$$$',
        imageUrl: 'https://placehold.co/400x300/134e4a/ffffff?text=Smart+Ring',
        affiliateLink: '#'
      }
    ]
  },
  {
    id: 'travel',
    title: 'Halal Travel Gear',
    description: 'Stay clean and oriented wherever the dunya takes you.',
    icon: Plane,
    items: [
      {
        id: 'travel-bidet',
        title: 'Portable Electric Bidet',
        description: 'Ensure Istinja happen anywhere. Discreet, rechargeable, and powerful water pressure.',
        priceRange: '$$',
        imageUrl: 'https://placehold.co/400x300/0f172a/ffffff?text=Portable+Bidet',
        affiliateLink: '#',
        badge: 'Travel Essential'
      },
      {
        id: 'pocket-mat',
        title: 'Pocket Prayer Mat',
        description: 'Ultra-lightweight, waterproof prayer mat with weighted corners. Fits in your pocket.',
        priceRange: '$',
        imageUrl: 'https://placehold.co/400x300/1e293b/ffffff?text=Pocket+Mat',
        affiliateLink: '#'
      }
    ]
  },
  {
    id: 'wellness',
    title: 'Wellness & Sunnah',
    description: 'Nourish your body and mind with Prophetic medicine and modern comfort.',
    icon: Heart,
    items: [
      {
        id: 'black-seed',
        title: 'Organic Black Seed Oil',
        description: 'Cold-pressed Nigella Sativa. "A cure for every disease except death."',
        priceRange: '$$',
        imageUrl: 'https://placehold.co/400x300/334155/ffffff?text=Black+Seed+Oil',
        affiliateLink: '#'
      },
      {
        id: 'weighted-blanket',
        title: 'Calm Weighted Blanket',
        description: 'Reduce anxiety and improve sleep quality. Perfect for Qiyam nights preparation.',
        priceRange: '$$$',
        imageUrl: 'https://placehold.co/400x300/475569/ffffff?text=Weighted+Blanket',
        affiliateLink: '#'
      },
      {
        id: 'miswak-set',
        title: 'Premium Miswak Kit',
        description: 'Vacuum sealed, fresh Sewak sticks with a travel case. Revive the Sunnah.',
        priceRange: '$',
        imageUrl: 'https://placehold.co/400x300/64748b/ffffff?text=Miswak+Kit',
        affiliateLink: '#'
      }
    ]
  }
];