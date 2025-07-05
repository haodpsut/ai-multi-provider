
import React from 'react';

export const LoadingSpinner: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
    <div
        className={`animate-spinner rounded-full border-4 border-t-brand-primary border-base-300 ${className}`}
        role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
);
