import React from 'react';

const CATEGORY_STYLES = {
  technical:  'bg-[#ede9fe] text-[#5b21b6] border border-[#c4b5fd]',
  cultural:   'bg-[#fef3c7] text-[#92400e] border border-[#fcd34d]',
  sports:     'bg-[#dcfce7] text-[#166534] border border-[#86efac]',
  workshop:   'bg-[#dbeafe] text-[#1e40af] border border-[#93c5fd]',
  seminar:    'bg-[#fce7f3] text-[#9d174d] border border-[#f9a8d4]',
  club:       'bg-[#fff7ed] text-[#9a3412] border border-[#fdba74]',
  other:      'bg-[#f1f5f9] text-[#475569] border border-[#cbd5e1]',
};

const STATUS_STYLES = {
  draft:      'bg-[#fefce8] text-[#854d0e] border border-[#fde047]',
  published:  'bg-[#f0fdf4] text-[#166534] border border-[#86efac]',
  closed:     'bg-[#fff1f2] text-[#9f1239] border border-[#fda4af]',
};

export function Badge({ category, status, className = '' }) {
  if (status) {
    const key = (status || '').toLowerCase();
    const style = STATUS_STYLES[key] || STATUS_STYLES.draft;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase ${style} ${className}`}>
        {status}
      </span>
    );
  }

  if (category) {
    const key = (category || '').toLowerCase();
    const style = CATEGORY_STYLES[key] || CATEGORY_STYLES.other;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${style} ${className}`}>
        {category}
      </span>
    );
  }

  return null;
}

export default Badge;
