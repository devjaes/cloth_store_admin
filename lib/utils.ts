import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const getPublicId = (url: string) => {
  const split = url.split('/');
  const publicId = split[split.length - 1].split('.')[0];
  return publicId;
}