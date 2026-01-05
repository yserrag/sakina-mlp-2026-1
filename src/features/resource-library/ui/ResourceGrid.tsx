import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '../../../shared/api/supabase'; 
import { useAuth } from '../../../features/auth/model/useAuth';

interface Resource {
  id: string;
  title: string;
  description: string;
}

// Added default value [] to resources to prevent the "undefined" crash
export const ResourceGrid = ({ resources = [] }: { resources?: Resource[] }) => {
  const { user } = useAuth(); 
  const [favorites, setFavorites] = useState<string[]>([]); 
  
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', user.id)
        .single();
      
      if (data?.preferences?.saved_items) {
        setFavorites(data.preferences.saved_items);
      }
    };
    loadFavorites();
  }, [user]);

  const toggleFavorite = async (resourceId: string) => {
    if (!user) return;
    const isFav = favorites.includes(resourceId);
    const newFavorites = isFav 
      ? favorites.filter(id => id !== resourceId) 
      : [...favorites, resourceId];

    setFavorites(newFavorites);
    await supabase.from('profiles').update({ 
      preferences: { saved_items: newFavorites },
      updated_at: new Date().toISOString() 
    }).eq('id', user.id);
  };

  // Guard: If resources is empty, show a fallback message
  if (!resources || resources.length === 0) {
    return <div className="text-slate-500 py-10 text-center">No resources available.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 mt-6">
      {resources.map((item) => (
        <div key={item.id} className="p-4 bg-slate-900/50 rounded-2xl border border-white/5 relative">
          <button 
            onClick={() => toggleFavorite(item.id)}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80"
          >
            <Heart className={`w-5 h-5 ${favorites.includes(item.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
          </button>
          <h3 className="text-white font-bold mb-1">{item.title}</h3>
          <p className="text-slate-400 text-sm">{item.description}</p>
        </div>
      ))}
    </div>
  );
};