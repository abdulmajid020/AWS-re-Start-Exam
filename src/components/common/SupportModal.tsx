import React from 'react';
import { X, Coffee, Heart, Share2, Check, ExternalLink } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleShare = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">Support This Project</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Help keep this AWS prep platform free & open-source</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          If this app helped you prepare for your AWS re/Start Knowledge Checks or Cloud Practitioner exam, consider buying a coffee or sharing it with your cohort!
        </p>

        {/* Sponsor Options */}
        <div className="space-y-2.5">
          {/* Buy Me a Coffee */}
          <a
            href="https://buymeacoffee.com/projectelon"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl bg-[#FFDD00]/15 hover:bg-[#FFDD00]/25 border border-[#FFDD00]/60 dark:border-[#FFDD00]/40 text-slate-900 dark:text-white text-xs font-semibold transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <Coffee className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>Buy Me a Coffee</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </a>

          {/* GitHub Sponsors */}
          <a
            href="https://github.com/sponsors/abdulmajid020"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 fill-current text-slate-800 dark:text-slate-200" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub Sponsors</span>
            </div>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20 group-hover:scale-110 transition-transform" />
          </a>

          {/* Share with peers */}
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all"
          >
            <div className="flex items-center gap-2.5">
              <Share2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>Share App with Classmates</span>
            </div>
            {copied ? (
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Copied!
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 font-mono">Copy Link</span>
            )}
          </button>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Thank you for supporting community-driven AWS learning! 🚀
          </p>
        </div>
      </div>
    </div>
  );
};
