import React from 'react';

export function Card({ children, className = '', hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-[#111D42]
        border border-[#e2e8f0] dark:border-[#23356D]
        text-[#0f172a] dark:text-[#F8FAFC]
        rounded-card shadow-card overflow-hidden
        transition-all duration-300 ease-out
        ${hover || onClick
          ? 'cursor-pointer card-interactive hover:shadow-card-hover hover:-translate-y-1 hover:border-[#bae6fd] dark:hover:border-[#38bdf8]/40'
          : ''
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`p-6 border-b border-[#e2e8f0] dark:border-[#23356D] ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`p-6 bg-[#f8fafc] dark:bg-[#182654]/40 border-t border-[#e2e8f0] dark:border-[#23356D] ${className}`}>
      {children}
    </div>
  );
}
