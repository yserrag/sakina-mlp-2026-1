import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { supabase } from '../../../shared/api/supabase';
import { Plus, Loader2, Link, Image as ImageIcon, Tag, CheckCircle2 } from 'lucide-react';

export const AdminAddResource: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceRange: '$',
    imageUrl: '',
    affiliateLink: '',
    category: 'spiritual'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('resources')
        .insert([formData])
        .select()
        .single();

      if (error) throw error;
      
      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        priceRange: '$',
        imageUrl: '',
        affiliateLink: '',
        category: 'spiritual'
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to add resource", err);
      alert("Failed to add resource. See console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 shadow-2xl">
      <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
        <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
          <Plus className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Add Resource</h2>
          <p className="text-xs text-slate-400">Expand the library catalog</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="space-y-1">
           <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Title</label>
           <input 
             required
             type="text"
             value={formData.title}
             onChange={e => setFormData({...formData, title: e.target.value})}
             className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
             placeholder="e.g. The Clear Quran"
           />
        </div>

        {/* Category & Price */}
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
                <div className="relative">
                    <Tag className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 appearance-none"
                    >
                        <option value="spiritual" className="bg-slate-800">Spiritual</option>
                        <option value="travel" className="bg-slate-800">Travel</option>
                        <option value="wellness" className="bg-slate-800">Wellness</option>
                    </select>
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Price Range</label>
                <select 
                    value={formData.priceRange}
                    onChange={e => setFormData({...formData, priceRange: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 appearance-none"
                >
                    <option value="$" className="bg-slate-800">$ (Budget)</option>
                    <option value="$$" className="bg-slate-800">$$ (Standard)</option>
                    <option value="$$$" className="bg-slate-800">$$$ (Premium)</option>
                </select>
            </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
           <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</label>
           <textarea 
             required
             rows={3}
             value={formData.description}
             onChange={e => setFormData({...formData, description: e.target.value})}
             className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors resize-none"
             placeholder="Short summary of the product..."
           />
        </div>

        {/* Links */}
        <div className="space-y-4 pt-2">
            <div className="relative">
                <ImageIcon className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input 
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-teal-500 font-mono text-ellipsis"
                  placeholder="https://example.com/image.jpg"
                />
            </div>
            <div className="relative">
                <Link className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input 
                  type="url"
                  required
                  value={formData.affiliateLink}
                  onChange={e => setFormData({...formData, affiliateLink: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-teal-500 font-mono text-ellipsis"
                  placeholder="https://affiliate-link.com"
                />
            </div>
        </div>

        <div className="pt-4">
            <Button 
                type="submit" 
                disabled={loading}
                className={`w-full ${success ? 'bg-emerald-600' : 'bg-teal-600'} hover:bg-teal-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all`}
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : success ? <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Added Successfully</span> : 'Add Resource'}
            </Button>
        </div>
      </form>
    </Card>
  );
};
