import { useState } from 'react';
import { Package, ChevronDown, ChevronUp, Snowflake, AlertTriangle, XCircle, Zap } from 'lucide-react';
import type { SKU as SKUType, Batch, AllocationItem } from '@/types';
import { BatchQueue } from './BatchQueue';
import { getSkuFrozenStock, getSkuExpiredStock, getSkuApproachingStock, getSkuUrgentStock } from '@/utils/inventoryCalculator';
import { useInventoryStore } from '@/store/useInventoryStore';

interface SKUCardProps {
  sku: SKUType;
  batches: Batch[];
  previewAllocations?: AllocationItem[];
}

export function SKUCard({ sku, batches, previewAllocations = [] }: SKUCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { alerts } = useInventoryStore();

  const skuBatches = batches.filter(b => b.skuId === sku.id);
  const frozenStock = getSkuFrozenStock(sku.id, batches);
  const expiredStock = getSkuExpiredStock(sku.id, batches);
  const approachingStock = getSkuApproachingStock(sku.id, batches);
  const urgentStock = getSkuUrgentStock(sku.id, batches);

  const skuUnreadAlerts = alerts.filter(a => a.skuId === sku.id && !a.isRead).length;

  const hasUrgent = urgentStock > 0 || expiredStock > 0;
  const hasWarning = approachingStock > 0 || frozenStock > 0;

  const getCardStyle = () => {
    if (hasUrgent) return 'bg-gradient-to-br from-amber-900/10 to-transparent border-amber-800/30';
    if (hasWarning) return 'bg-gradient-to-br from-orange-900/10 to-transparent border-orange-800/30';
    return 'bg-slate-800/50 border-slate-700 hover:border-slate-600';
  };

  const getIconStyle = () => {
    if (hasUrgent) return 'bg-amber-500/20 border border-amber-500/30';
    if (hasWarning) return 'bg-orange-500/20 border border-orange-500/30';
    return 'bg-cyan-500/20 border border-cyan-500/30';
  };

  const getIconColor = () => {
    if (hasUrgent) return 'text-amber-400';
    if (hasWarning) return 'text-orange-400';
    return 'text-cyan-400';
  };

  return (
    <div className={`rounded-xl border transition-all duration-300 overflow-hidden ${getCardStyle()}`}>
      <div
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-3 rounded-xl ${getIconStyle()}`}>
              <Package size={24} className={getIconColor()} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-slate-100">{sku.name}</h3>
                {hasUrgent && (
                  <Zap size={14} className="text-amber-400 animate-pulse" />
                )}
                {!hasUrgent && hasWarning && (
                  <AlertTriangle size={14} className="text-orange-400" />
                )}
                {skuUnreadAlerts > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold bg-red-500 text-white">
                    {skuUnreadAlerts}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-mono">{sku.skuCode}</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-slate-700/50 text-slate-400">
                {sku.category}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="font-mono text-2xl font-bold text-slate-100 tabular-nums">
              {sku.totalStock}
              <span className="text-sm text-slate-500 ml-1">件</span>
            </div>
            <div className="flex items-center justify-end gap-3 mt-1 text-xs">
              {urgentStock > 0 && (
                <span className="flex items-center gap-1 text-amber-400">
                  <Zap size={12} />
                  紧急 {urgentStock}
                </span>
              )}
              {approachingStock > 0 && (
                <span className="flex items-center gap-1 text-orange-400">
                  <AlertTriangle size={12} />
                  临期 {approachingStock}
                </span>
              )}
              {frozenStock > 0 && (
                <span className="flex items-center gap-1 text-cyan-400">
                  <Snowflake size={12} />
                  冻结 {frozenStock}
                </span>
              )}
              {expiredStock > 0 && (
                <span className="flex items-center gap-1 text-red-400">
                  <XCircle size={12} />
                  过期 {expiredStock}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>共 {skuBatches.length} 个批次</span>
            <span className="text-slate-600">|</span>
            <span>可用 {sku.totalStock} 件</span>
          </div>
          <button className="p-1 text-slate-400 hover:text-slate-200 transition-colors">
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-slate-700/50 pt-4">
          <BatchQueue batches={skuBatches} previewAllocations={previewAllocations} />
        </div>
      )}
    </div>
  );
}
