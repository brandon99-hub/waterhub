import { Button } from "@/components/ui/button";
import { Plus, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  breadcrumbs?: string[];
}

export function PageHeader({ title, description, actionLabel, onAction, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-6 border-b border-border/40">
      <div className="space-y-1">
        {breadcrumbs && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/60 uppercase tracking-widest mb-2">
            <span>WaterHub</span>
            {breadcrumbs.map((crumb, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3" />
                <span className={i === breadcrumbs.length - 1 ? "text-primary/70 font-bold" : ""}>{crumb}</span>
              </div>
            ))}
          </div>
        )}
        <h1 className="text-4xl font-display font-black text-foreground tracking-tighter drop-shadow-sm">{title}</h1>
        {description && <p className="text-muted-foreground/80 mt-1.5 text-lg font-medium max-w-2xl leading-relaxed">{description}</p>}
      </div>

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="h-12 px-6 shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1 rounded-xl font-bold gap-2 text-base group"
        >
          <div className="bg-white/20 p-1 rounded-lg group-hover:bg-white/30 transition-colors">
            <Plus className="w-4 h-4 text-white" />
          </div>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
