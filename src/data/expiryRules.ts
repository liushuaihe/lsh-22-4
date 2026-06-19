export interface ExpiryRule {
  tier: 'approaching' | 'urgent' | 'expired';
  label: string;
  description: string;
  maxDaysRemaining: number;
  color: {
    text: string;
    bg: string;
    border: string;
    badge: string;
    badgeText: string;
    ring: string;
  };
}

export const expiryRules: ExpiryRule[] = [
  {
    tier: 'approaching',
    label: '临期',
    description: '剩余天数 ≤ 30 天，需关注',
    maxDaysRemaining: 30,
    color: {
      text: 'text-orange-400',
      bg: 'bg-orange-900/30',
      border: 'border-orange-800/50',
      badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      badgeText: 'border-orange-800',
      ring: 'ring-orange-500/30',
    },
  },
  {
    tier: 'urgent',
    label: '紧急',
    description: '剩余天数 ≤ 7 天，需立即处理',
    maxDaysRemaining: 7,
    color: {
      text: 'text-amber-400',
      bg: 'bg-amber-900/30',
      border: 'border-amber-800/50',
      badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      badgeText: 'border-amber-800',
      ring: 'ring-amber-500/30',
    },
  },
  {
    tier: 'expired',
    label: '过期',
    description: '已超过保质期，不可出库',
    maxDaysRemaining: -1,
    color: {
      text: 'text-red-400',
      bg: 'bg-red-900/30',
      border: 'border-red-800/50',
      badge: 'bg-red-500/20 text-red-400 border-red-500/30',
      badgeText: 'border-red-800',
      ring: 'ring-red-500/30',
    },
  },
];

export const APPROACHING_THRESHOLD = 30;
export const URGENT_THRESHOLD = 7;
