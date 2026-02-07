import type { ReactNode } from "react";

type MetricCardProps = {
  title: ReactNode;
  value: ReactNode;
  description: ReactNode;
};

export const MetricCard = ({ title, value, description }: MetricCardProps) => {
  return (
    <div className="rounded-xl bg-muted/50 border p-5! flex flex-col justify-between gap-4 w-full">
      <div className="flex flex-col gap-1">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="text-3xl font-bold">{value}</div>
      </div>
      <div className="text-sm text-muted-foreground">{description}</div>
    </div>
  );
};
