import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { UserService } from '@/services/UserService'; // [FACTS]: Hooking into persistence logic
import { supabase } from '@/shared/api/supabase';
import { Baby, Star, Trophy, Loader2 } from 'lucide-react';

export const KidsZone: React.FC = () => {
  const [points, setPoints] = useState(0);
  const [claiming, setClaiming] = useState(false);

  // [FACTS]: Sync local state with database on mount
  useEffect(() => {
    const fetchPoints = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data } = await supabase.from('profiles').select('xp_points').eq('id', user.id).single();
      if (data) setPoints(data.xp_points);
    };
    fetchPoints();
  }, []);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const newTotal = await UserService.updateXP(50); // [FACTS]: The actual DB call
      if (newTotal !== null) setPoints(newTotal);
    } catch (e) {
      console.error(e);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-indigo-600/20 p-6 rounded-[2.5rem] border border-indigo-500/20">
        <div className="flex items-center gap-4">
          <Baby className="w-6 h-6 text-white" />
          <h1 className="text-xl font-serif font-bold text-white">Kids Zone</h1>
        </div>
        <div className="bg-white/5 px-4 py-2 rounded-2xl flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-black text-white">{points}</span>
        </div>
      </div>

      <Card className="p-6 bg-gradient-to-br from-indigo-600 to-purple-700 border-none">
        <div className="flex flex-col items-center text-center gap-4">
          <Trophy className="w-12 h-12 text-yellow-300 drop-shadow-lg" />
          <h2 className="text-white font-bold text-lg">Daily Challenge!</h2>
          <Button 
            onClick={handleClaim} 
            disabled={claiming}
            className="w-full bg-white text-indigo-600 hover:bg-white/90 rounded-2xl font-black"
          >
            {claiming ? <Loader2 className="w-4 h-4 animate-spin" /> : 'CLAIM 50 STARS'}
          </Button>
        </div>
      </Card>
    </div>
  );
};