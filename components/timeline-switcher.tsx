"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type TimelineOption = {
  key: string;
  label: string;
};

export function TimelineSwitcher({
  options,
  defaultValue,
}: {
  options: TimelineOption[];
  defaultValue: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = searchParams.get("timeline") || defaultValue;

  const onChange = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("timeline", next);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[#64748d]">时间线</span>
      <select
        className="rounded-md border border-[#dbe7f3] bg-white px-3 py-1.5 text-sm text-[#0f172a]"
        value={current}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.key} value={opt.key}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
