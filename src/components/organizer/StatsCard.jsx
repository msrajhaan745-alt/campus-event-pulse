import React from 'react';

export function StatsCard({ title, value, icon: Icon, color = 'blue', description }) {
  const colorMap = {
    blue: { bg: 'bg-[#eef2ff]', text: 'text-[#4f46e5]', border: 'border-[#c7d2fe]' },
    indigo: { bg: 'bg-[#eef2ff]', text: 'text-[#4f46e5]', border: 'border-[#c7d2fe]' },
    amber: { bg: 'bg-[#fffbeb]', text: 'text-[#d97706]', border: 'border-[#fde68a]' },
    emerald: { bg: 'bg-[#ecfdf5]', text: 'text-[#059669]', border: 'border-[#a7f3d0]' },
    rose: { bg: 'bg-[#fff1f2]', text: 'text-[#e11d48]', border: 'border-[#fecdd3]' },
    purple: { bg: 'bg-[#faf5ff]', text: 'text-[#9333ea]', border: 'border-[#e9d5ff]' },
  };

  const currentTheme = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-2xl border border-[#e4e7ef] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_-2px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[#6b7280]">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl border ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border}`}>
          <Icon className="w-4 h-4" strokeWidth={2} />
        </div>
      </div>
      <div className="text-2xl sm:text-3xl font-extrabold text-[#0f1117] tracking-tight">
        {value}
      </div>
      {description && (
        <p className="text-xs text-[#9ca3af] mt-1 font-medium">{description}</p>
      )}
    </div>
  );
}

export default StatsCard;
