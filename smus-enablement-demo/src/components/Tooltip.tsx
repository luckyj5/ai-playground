import { type ReactNode, useState } from 'react';

type Props = {
  label: ReactNode;
  children: ReactNode;
};

export function Tooltip({ label, children }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span className="pointer-events-none absolute left-1/2 top-full z-40 mt-2 w-64 -translate-x-1/2 rounded-md border border-white/10 bg-aws-slate/95 px-3 py-2 text-xs text-slate-200 shadow-xl animate-fade-in">
          {label}
        </span>
      )}
    </span>
  );
}
