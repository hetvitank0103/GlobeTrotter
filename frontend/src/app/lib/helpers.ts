import type { Trip } from "../data/types";

export const D = "Playfair Display";
export const B = "Plus Jakarta Sans";
export const M = "DM Mono";

export function fmt(d: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function days(a: string, b: string) {
  if (!a || !b) return 0;
  return Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

export function tripTotal(t: Trip) {
  return t.stops.flatMap((s) => s.activities).reduce((s, a) => s + a.cost, 0);
}
