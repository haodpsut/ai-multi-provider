
import React from 'react';
import { ApiIcon } from './icons/ActionIcons';

export const Header: React.FC = () => {
    return (
        <header className="bg-base-200/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center h-16">
                     <div className="flex items-center space-x-3">
                        <ApiIcon className="h-8 w-8 text-brand-primary"/>
                        <h1 className="text-2xl font-bold text-base-content tracking-tight">
                            AI Provider Comparator
                        </h1>
                     </div>
                </div>
            </div>
        </header>
    );
};
