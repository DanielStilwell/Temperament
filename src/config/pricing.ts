// 集中管理所有定价信息
// 修改定价时只需改这一个文件

export type BillingPeriod = 'monthly' | '6months' | 'yearly';

export interface PriceOption {
  period: BillingPeriod;
  label: string;        // 显示用：Monthly / 6 Months / 1 Year
  price: number;        // 数字金额
  display: string;      // 显示用：$5 / $17 / $27
  perMonth?: string;    // 每月等效价格（用于展示性价比）
  creemProductId: string; // Creem 产品 ID
}

export interface TierPricing {
  monthly: PriceOption;
  '6months': PriceOption;
  yearly: PriceOption;
}

// Pro 版定价：$5/月，$17/6个月，$27/年
export const PRO_PRICING: TierPricing = {
  monthly:  { period: 'monthly',  label: 'Monthly',  price: 5,  display: '$5',  perMonth: '$5.00/mo',  creemProductId: 'prod_4wux8cBUBXAjnXXx30D1vu' },
  '6months': { period: '6months', label: '6 Months', price: 17, display: '$17', perMonth: '$2.83/mo',  creemProductId: 'prod_2x6OtXrjoZcEgxWBmBrK1K' },
  yearly:   { period: 'yearly',  label: '1 Year',   price: 27, display: '$27', perMonth: '$2.25/mo',  creemProductId: 'prod_3H2ljnUdqrNGie5sepG1JL' },
};

// Max 版定价：$12/月，$43/6个月，$79/年
export const MAX_PRICING: TierPricing = {
  monthly:  { period: 'monthly',  label: 'Monthly',  price: 12, display: '$12', perMonth: '$12.00/mo', creemProductId: 'prod_37mkAow7FycDYG5GKEH1z9' },
  '6months': { period: '6months', label: '6 Months', price: 43, display: '$43', perMonth: '$7.17/mo',  creemProductId: 'prod_3048yMiQNZbsl3HYBpehNZ' },
  yearly:   { period: 'yearly',  label: '1 Year',   price: 79, display: '$79', perMonth: '$6.58/mo',  creemProductId: 'prod_5UMdzJgeOuhnOLlTjR06YZ' },
};

export const TIER_PRICING = {
  pro: PRO_PRICING,
  max: MAX_PRICING,
} as const;

// 升级差价计算（Pro → Max，按相同周期补差价）
export function calculateUpgradePrice(fromTier: string, toTier: string, period: BillingPeriod): number {
  if (fromTier === 'pro' && toTier === 'max') {
    return TIER_PRICING.max[period].price - TIER_PRICING.pro[period].price;
  }
  return TIER_PRICING[toTier as keyof typeof TIER_PRICING]?.[period].price ?? 0;
}

// 按周期计算订阅时长（毫秒）
export function getPeriodDuration(period: BillingPeriod): number {
  switch (period) {
    case 'monthly':  return 30 * 24 * 60 * 60 * 1000;       // 30 天
    case '6months':  return 180 * 24 * 60 * 60 * 1000;      // 180 天
    case 'yearly':   return 365 * 24 * 60 * 60 * 1000;      // 365 天
  }
}

// 周期显示标签
export const PERIOD_LABELS: Record<BillingPeriod, string> = {
  monthly: 'Monthly',
  '6months': '6 Months',
  yearly: '1 Year',
};

