import { Currency } from '../types';

export function formatCurrency(amount: number, currency: Currency = 'RUB'): string {
  const rate = currency === 'RUB' ? 1 : currency === 'KZT' ? 5.2 : currency === 'BYN' ? 0.035 : 0.011;
  const symbol = currency === 'RUB' ? '₽' : currency === 'KZT' ? '₸' : currency === 'BYN' ? 'Br' : '$';
  
  const converted = Math.round(amount * rate);
  return `${converted.toLocaleString('ru-RU')} ${symbol}`;
}

export function formatNumber(num: number): string {
  return num.toLocaleString('ru-RU');
}

export function getSurvivalColor(score: number): string {
  if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (score >= 70) return 'text-blue-700 bg-blue-50 border-blue-200';
  if (score >= 50) return 'text-amber-700 bg-amber-50 border-amber-200';
  return 'text-rose-700 bg-rose-50 border-rose-200';
}

export function getSurvivalProgressColor(score: number): string {
  if (score >= 85) return 'from-emerald-500 to-teal-500';
  if (score >= 70) return 'from-blue-500 to-cyan-500';
  if (score >= 50) return 'from-amber-500 to-orange-400';
  return 'from-rose-500 to-red-500';
}
