// Minimal Tabs primitive for the segmented-control pattern.
// (Light, no Radix dep — sufficient for the shapes the app uses.)
import * as React from 'react';
import { cn } from '../../lib/utils';

interface TabsContext {
  value: string;
  setValue: (v: string) => void;
}
const Ctx = React.createContext<TabsContext | null>(null);

export function Tabs({
  defaultValue,
  value: controlled,
  onValueChange,
  children,
  className,
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [internal, setInternal] = React.useState(defaultValue ?? '');
  const value = controlled ?? internal;
  const setValue = (v: string) => {
    if (controlled === undefined) setInternal(v);
    onValueChange?.(v);
  };
  return (
    <Ctx.Provider value={{ value, setValue }}>
      <div className={cn('flex flex-col', className)}>{children}</div>
    </Ctx.Provider>
  );
}

export function TabsList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('flex gap-2', className)}>{children}</div>;
}

export function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(Ctx);
  if (!ctx) return null;
  const active = ctx.value === value;
  return (
    <button
      onClick={() => ctx.setValue(value)}
      data-state={active ? 'active' : 'inactive'}
      className={cn(
        'inline-flex items-center gap-2 rounded-xl border-[1.5px] px-3 py-2.5 text-xs font-medium transition-colors',
        active
          ? 'bg-primary border-primary text-primary-foreground'
          : 'bg-background border-[var(--color-border-token)] text-primary',
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(Ctx);
  if (!ctx || ctx.value !== value) return null;
  return <div className={className}>{children}</div>;
}
