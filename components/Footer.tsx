import React from 'react';
import { Icons } from './Icons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-space-900 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
          <p>&copy; {new Date().getFullYear()} The TerraSense Team, CASM.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
