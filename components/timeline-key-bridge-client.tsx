"use client";
import { useSearchParams } from "next/navigation";

export function useTimeline(defaultKey = "0323-0402") {
  const sp = useSearchParams();
  return sp.get("timeline") || defaultKey;
}
