import { Link } from 'react-router-dom';
import { Droplets, Book } from 'lucide-react';

// Wrap your existing button structure:
<Link to="/revert/wudu" className="w-full flex items-center p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition">
  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mr-4">
    <Droplets className="w-5 h-5 text-blue-400" />
  </div>
  <div className="flex-1 text-left">
    <h4 className="text-white font-bold">Wudu Guide</h4>
    <p className="text-[10px] text-slate-500">Purification</p>
  </div>
</Link>