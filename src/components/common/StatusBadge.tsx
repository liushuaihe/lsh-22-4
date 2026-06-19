import { Snowflake, AlertTriangle, CheckCircle, XCircle, Zap } from 'lucide-react';
import type { ExpiryTier } from '@/types';

interface StatusBadgeProps {
  status: ExpiryTier;
  isFrozen?: boolean;
  showText?: boolean;
}

export function StatusBadge({ status, isFrozen = false, showText = true }: StatusBadgeProps) {
  if (isFrozen) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-slate-700 text-slate-300 border border-slate-600">
        <Snowflake size={12} className="text-cyan-400" />
        {showText && <span>已冻结</span>}
      </span>
    );
  }

  switch (status) {
    case 'normal':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-emerald-900/50 text-emerald-400 border border-emerald-800">
          <CheckCircle size={12} />
          {showText && <span>正常</span>}
        </span>
      );
    case 'approaching':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-orange-900/50 text-orange-400 border border-orange-800">
          <AlertTriangle size={12} />
          {showText && <span>临期</span>}
        </span>
      );
    case 'urgent':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-amber-900/50 text-amber-400 border border-amber-800 animate-pulse">
          <Zap size={12} />
          {showText && <span>紧急</span>}
        </span>
      );
    case 'expired':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-900/50 text-red-400 border border-red-800">
          <XCircle size={12} />
          {showText && <span>已过期</span>}
        </span>
      );
    default:
      return null;
  }
}
