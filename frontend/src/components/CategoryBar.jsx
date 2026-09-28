import React from 'react';
import { Shield, Sparkles, HandMetal, Wind, Flame } from 'lucide-react';

const categories = [
  { name: 'All Products', icon: Sparkles },
  { name: 'Helmets', icon: Shield },
  { name: 'Jackets', icon: Wind },
  { name: 'Gloves', icon: HandMetal },
  { name: 'Boots', icon: Flame },
];

export default function CategoryBar({ activeCategory, onSelectCategory }) {
  return (
    <div className="bg-[#14171E] border-b border-gray-800 py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-4 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-bikerNeon text-white shadow-lg shadow-orange-500/30'
                  : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}