import { ArrowDownCircle, ArrowUpCircle, Snowflake, CircleDot, CheckCircle2, XCircle } from 'lucide-react';
import type { OperationLog } from '@/types';
import { formatDate } from '@/utils/inventoryCalculator';
import { useInventoryStore } from '@/store/useInventoryStore';

const typeConfig = {
  inbound: { icon: ArrowDownCircle, color: 'text-emerald-400', bg: 'bg-emerald-900/20', label: '入库' },
  outbound: { icon: ArrowUpCircle, color: 'text-cyan-400', bg: 'bg-cyan-900/20', label: '出库' },
  freeze: { icon: Snowflake, color: 'text-slate-400', bg: 'bg-slate-800/50', label: '冻结' },
  unfreeze: { icon: CircleDot, color: 'text-amber-400', bg: 'bg-amber-900/20', label: '解冻' }
};

export function OperationLogList() {
  const { operationLogs, skus } = useInventoryStore();

  const getSkuName = (skuId: string) => {
    return skus.find(s => s.id === skuId)?.name || skuId;
  };

  if (operationLogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
        <CircleDot size={32} className="mb-2 opacity-50" />
        <p className="text-sm">暂无操作记录</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
      {operationLogs.slice(0, 50).map((log: OperationLog) => {
        const config = typeConfig[log.type];
        const Icon = config.icon;
        
        return (
          <div
            key={log.id}
            className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-300 ${
              log.status === 'success'
                ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                : 'bg-red-900/20 border-red-900/50 hover:border-red-800'
            }`}
          >
            <div className={`p-2 rounded ${config.bg} mt-0.5`}>
              <Icon size={16} className={config.color} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${config.bg} ${config.color}`}>
                    {config.label}
                  </span>
                  <span className="text-sm font-medium text-slate-200 truncate">
                    {getSkuName(log.skuId)}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    x{log.quantity}
                  </span>
                </div>
                {log.status === 'success' ? (
                  <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                ) : (
                  <XCircle size={14} className="text-red-400 flex-shrink-0" />
                )}
              </div>
              
              <p className={`text-sm ${log.status === 'success' ? 'text-slate-400' : 'text-red-400'}`}>
                {log.message}
              </p>
              
              <p className="text-xs text-slate-500 mt-1 font-mono">
                {formatDate(log.createdAt)} {new Date(log.createdAt).toLocaleTimeString('zh-CN')}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
