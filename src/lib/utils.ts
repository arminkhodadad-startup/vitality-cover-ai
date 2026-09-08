import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmt(v: number) {
  return Number(v).toLocaleString("en-US");
}

export function round(v: number) {
  return Math.round(v);
}
