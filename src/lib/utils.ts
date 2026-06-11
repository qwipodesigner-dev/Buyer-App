import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * shadcn-style class composer.
 * Use anywhere you want to compose Tailwind classes conditionally.
 *
 *   <button className={cn('rounded-md px-4', isPrimary && 'bg-primary text-primary-foreground')} />
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
