import { ArrowRight, Clock, Package } from 'lucide-react';
import type { Batch, AllocationItem } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { BatchProgress } from '@/components/common/BatchProgress';
import { formatDate, calculateDaysRemaining } from '@/utils/inventoryCalculator';

interface BatchQueueProps {
  batches: Batch[];
  previewAllocations?: AllocationItem[];
}

function getTierStyle(batch: Batch) {
  switch (batch.status) {
    case 'expired':
      return {
        border: 'border-red-500/50',
        bg: 'bg-red-900/10',
        ring: 'ring-2 ring-red-500/20',
      };
    case 'urgent':
      return {
        border: 'border-amber-500/50',
        bg: 'bg-amber-900/10',
        ring: 'ring-2 ring-amber-500/20',
      };
    case 'approaching':
      return {
        border: 'border-orange-500/30',
        bg: 'bg-orange-900/5',
        ring: '',
      };
    default:
      return {
        border: 'border-slate-700',
        bg: 'bg-slate-800/50',
        ring: '',
      };
  }
}

function getExpiryDateColor(daysRemaining: number) {
  if (daysRemaining < 0) return 'text-red-400';
  if (daysRemaining <= 7) return 'text-amber-400';
  if (daysRemaining <= 30) return 'text-orange-400';
  return 'text-slate-300';
}

export function BatchQueue({ batches, previewAllocations = [] }: BatchQueueProps) {
  const sortedBatches = [...batches]
    .filter(b => b.status !== 'expired')
    .sort((a, b) => new Date(a.productionDate).getTime() - new Date(b.productionDate).getTime());

  const expiredBatches = batches.filter(b => b.status === 'expired');

  const isAllocated = (batchId: string) => {
    return previewAllocations.some(a => a.batchId === batchId);
  };

  const getAllocationQuantity = (batchId: string) => {
    return previewAllocations.find(a => a.batchId === batchId)?.quantity || 0;
  };

  if (sortedBatches.length === 0 && expiredBatches.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Package size={24} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">暂无可用批次</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
        <span className="flex items-center gap-1">
          <Clock size={12} />
          先进先出队列（最早生产在前）
        </span>
        <span>共 {sortedBatches.length} 个批次{expiredBatches.length > 0 ? ` · ${expiredBatches.length} 个已过期` : ''}</span>
      </div>

      <div className="relative">
        {sortedBatches.map((batch, index) => {
          const allocated = isAllocated(batch.id);
          const allocQty = getAllocationQuantity(batch.id);
          const daysRemaining = calculateDaysRemaining(batch.expiryDate);
          const tier = getTierStyle(batch);

          return (
            <div key={batch.id} className="flex items-stretch">
              {index < sortedBatches.length - 1 && (
                <div className="w-6 flex items-center justify-center">
                  <ArrowRight size={12} className="text-slate-600 -rotate-90 mb-2" />
                </div>
              )}
              {index === sortedBatches.length - 1 && <div className="w-6" />}

              <div
                className={`flex-1 p-3 rounded-lg border transition-all duration-300 mb-2 ${
                  allocated
                    ? 'bg-cyan-900/20 border-cyan-500/50 ring-2 ring-cyan-500/30 scale-[1.02]'
                    : batch.isFrozen
                      ? 'bg-slate-800/30 border-slate-700/50 opacity-60'
                      : `${tier.bg} ${tier.border} ${tier.ring}`
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded ${
                      index === 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      allocated ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                      batch.status === 'urgent' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      batch.status === 'approaching' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      'bg-slate-700 text-slate-400'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="font-mono text-sm text-slate-200">{batch.batchNo}</span>
                    <StatusBadge status={batch.status} isFrozen={batch.isFrozen} />
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-lg font-bold text-slate-100">
                      {allocated && (
                        <span className="text-cyan-400 mr-2">-{allocQty}</span>
                      )}
                      {batch.availableQuantity}
                      <span className="text-xs text-slate-500 ml-1">件</span>
                    </div>
                    {allocated && (
                      <div className="text-xs text-cyan-400 font-mono">
                        出库后: {batch.availableQuantity - allocQty} 件
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-2">
                  <div>
                    <span className="text-slate-500">生产:</span>{' '}
                    <span className="text-slate-300 font-mono">{formatDate(batch.productionDate)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">过期:</span>{' '}
                    <span className={`font-mono ${getExpiryDateColor(daysRemaining)}`}>
                      {formatDate(batch.expiryDate)}
                    </span>
                  </div>
                </div>

                <BatchProgress
                  productionDate={batch.productionDate}
                  expiryDate={batch.expiryDate}
                  showLabel={false}
                />
              </div>
            </div>
          );
        })}
      </div>

      {expiredBatches.length > 0 && (
        <div className="mt-3 pt-3 border-t border-red-800/30">
          <div className="text-xs text-red-400 mb-2 flex items-center gap-1">
            <Package size={12} />
            已过期批次（不可出库）
          </div>
          <div className="space-y-2">
            {expiredBatches.map((batch) => (
              <div
                key={batch.id}
                className="p-3 rounded-lg border bg-red-900/10 border-red-500/30 opacity-60"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-red-300">{batch.batchNo}</span>
                    <StatusBadge status={batch.status} isFrozen={batch.isFrozen} />
                  </div>
                  <span className="font-mono text-sm text-red-300">{batch.availableQuantity} 件</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
