/* eslint-disable prettier/prettier */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function cleanFirstBulletPoint(arr: string[]): string[] {
  if (arr.length === 0) return arr; // Return empty array if no elements

  // Remove "- " only from the first element
  arr[0] = arr[0].replace(/^- /, "");

  return arr;
}
