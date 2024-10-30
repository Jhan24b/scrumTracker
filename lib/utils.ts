import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Función para manejar clases CSS usando clsx y tailwind-merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
