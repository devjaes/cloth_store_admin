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

const spanishMonths = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio", 
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre"
]

export const toSpanishDate = (date: Date) => {
  const day = date.getDate();
  const month = spanishMonths[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month} de ${year}`;
}
