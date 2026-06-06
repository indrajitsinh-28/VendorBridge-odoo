import React from "react";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] px-4 animate-in fade-in duration-300">
      <div className="w-16 h-16 rounded-2xl bg-primary/8 dark:bg-primary/15 flex items-center justify-center mb-5">
        <Construction className="w-7 h-7 text-primary/50" />
      </div>
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
      <p className="text-sm text-muted mt-2 text-center max-w-xs">
        {description ?? "This section is under construction. Check back soon."}
      </p>
    </div>
  );
}
