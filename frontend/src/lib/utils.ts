import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 🎨 Utility para combinar classes CSS com Tailwind
 * Combina clsx + tailwind-merge para resolver conflitos
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
} 