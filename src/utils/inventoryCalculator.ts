import type { Batch, ExpiryTier } from '@/types';
import { APPROACHING_THRESHOLD, URGENT_THRESHOLD } from '@/data/expiryRules';

export function calculateDaysRemaining(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function calculateExpiryStatus(expiryDate: string): ExpiryTier {
  const daysRemaining = calculateDaysRemaining(expiryDate);
  if (daysRemaining < 0) return 'expired';
  if (daysRemaining <= URGENT_THRESHOLD) return 'urgent';
  if (daysRemaining <= APPROACHING_THRESHOLD) return 'approaching';
  return 'normal';
}

export function calculateExpiryPercentage(productionDate: string, expiryDate: string): number {
  const production = new Date(productionDate).getTime();
  const expiry = new Date(expiryDate).getTime();
  const today = Date.now();
  
  if (today >= expiry) return 100;
  if (today <= production) return 0;
  
  const totalShelfLife = expiry - production;
  const elapsed = today - production;
  return Math.round((elapsed / totalShelfLife) * 100);
}

export function getSkuTotalStock(skuId: string, batches: Batch[]): number {
  return batches
    .filter(b => b.skuId === skuId && !b.isFrozen && b.status !== 'expired')
    .reduce((sum, b) => sum + b.availableQuantity, 0);
}

export function getSkuFrozenStock(skuId: string, batches: Batch[]): number {
  return batches
    .filter(b => b.skuId === skuId && b.isFrozen)
    .reduce((sum, b) => sum + b.availableQuantity, 0);
}

export function getSkuExpiredStock(skuId: string, batches: Batch[]): number {
  return batches
    .filter(b => b.skuId === skuId && b.status === 'expired')
    .reduce((sum, b) => sum + b.availableQuantity, 0);
}

export function getSkuApproachingStock(skuId: string, batches: Batch[]): number {
  return batches
    .filter(b => b.skuId === skuId && b.status === 'approaching' && !b.isFrozen)
    .reduce((sum, b) => sum + b.availableQuantity, 0);
}

export function getSkuUrgentStock(skuId: string, batches: Batch[]): number {
  return batches
    .filter(b => b.skuId === skuId && b.status === 'urgent' && !b.isFrozen)
    .reduce((sum, b) => sum + b.availableQuantity, 0);
}

export function getSkuWarningStock(skuId: string, batches: Batch[]): number {
  return getSkuApproachingStock(skuId, batches) + getSkuUrgentStock(skuId, batches);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateBatchNo(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `B${dateStr}${random}`;
}
