import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  MapPin,
  Gauge,
  Settings2,
  Building2,
  Wallet,
  Key,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  isCollapsed?: boolean;
}

function SidebarItem({ icon: Icon, label, href, active, isCollapsed }: SidebarItemProps) {
  const content = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
        active
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        isCollapsed && "justify-center px-2"
      )}
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}

export function Sidebar() {
  const [location] = useLocation();
  const [isUserMgmtOpen, setIsUserMgmtOpen] = useState(true);
  const [isEstMgmtOpen, setIsEstMgmtOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', isCollapsed.toString());
    // Dispatch event for pages to adjust layout
    window.dispatchEvent(new CustomEvent('sidebar-toggle', { detail: { isCollapsed } }));
  }, [isCollapsed]);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col transition-all duration-300 z-40",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header with Toggle */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-black text-lg">W</span>
            </div>
            <span className="font-black text-xl tracking-tight">WaterHub</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn("h-8 w-8 flex-shrink-0", isCollapsed && "mx-auto")}
        >
          {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/" active={location === "/"} isCollapsed={isCollapsed} />

        {/* User Management */}
        {!isCollapsed ? (
          <Collapsible open={isUserMgmtOpen} onOpenChange={setIsUserMgmtOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
              <span>User Management</span>
              <ChevronDown className={cn("w-3 h-3 transition-transform", isUserMgmtOpen && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-1">
              <SidebarItem icon={Users} label="Admins" href="/admins" active={location === "/admins"} />
              <SidebarItem icon={Users} label="Clients" href="/clients" active={location === "/clients"} />
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <>
            <SidebarItem icon={Users} label="Admins" href="/admins" active={location === "/admins"} isCollapsed={isCollapsed} />
            <SidebarItem icon={Users} label="Clients" href="/clients" active={location === "/clients"} isCollapsed={isCollapsed} />
          </>
        )}

        {/* Site Management */}
        <SidebarItem icon={MapPin} label="Sites" href="/sites" active={location === "/sites"} isCollapsed={isCollapsed} />

        {/* Meter Management */}
        <SidebarItem icon={Gauge} label="Meters" href="/meters" active={location === "/meters"} isCollapsed={isCollapsed} />
        <SidebarItem icon={Settings2} label="Operation Modes" href="/operation-modes" active={location === "/operation-modes"} isCollapsed={isCollapsed} />

        {/* Establishments */}
        {!isCollapsed ? (
          <Collapsible open={isEstMgmtOpen} onOpenChange={setIsEstMgmtOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
              <span>Establishments</span>
              <ChevronDown className={cn("w-3 h-3 transition-transform", isEstMgmtOpen && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-1">
              <SidebarItem icon={Building2} label="Types" href="/establishment-types" active={location === "/establishment-types"} />
              <SidebarItem icon={Building2} label="Establishments" href="/establishments" active={location === "/establishments"} />
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <>
            <SidebarItem icon={Building2} label="Types" href="/establishment-types" active={location === "/establishment-types"} isCollapsed={isCollapsed} />
            <SidebarItem icon={Building2} label="Establishments" href="/establishments" active={location === "/establishments"} isCollapsed={isCollapsed} />
          </>
        )}

        {/* Finance */}
        {!isCollapsed && (
          <div className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">Finance</div>
        )}
        <SidebarItem icon={Wallet} label="Billing Profiles" href="/billing-profiles" active={location === "/billing-profiles"} isCollapsed={isCollapsed} />
        <SidebarItem icon={Key} label="Mpesa Keys" href="/mpesa-keys" active={location === "/mpesa-keys"} isCollapsed={isCollapsed} />
      </nav>
    </aside>
  );
}
