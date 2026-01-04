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
  ChevronDown
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

function SidebarItem({ icon: Icon, label, href, active }: SidebarItemProps) {
  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
        active 
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      <Icon className={cn("w-5 h-5", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
      <span>{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const [location] = useLocation();
  const [isUserMgmtOpen, setIsUserMgmtOpen] = useState(true);
  const [isEstMgmtOpen, setIsEstMgmtOpen] = useState(true);

  return (
    <aside className="w-64 border-r border-border/40 h-screen bg-card flex flex-col fixed left-0 top-0 overflow-y-auto z-50">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-bold text-lg">W</span>
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-foreground">WaterHub</span>
        </div>

        <nav className="space-y-1.5">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            href="/" 
            active={location === "/"} 
          />

          <Collapsible open={isUserMgmtOpen} onOpenChange={setIsUserMgmtOpen} className="space-y-1">
            <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 group">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 group-hover:text-primary" />
                <span>User Management</span>
              </div>
              <ChevronDown className={cn("w-4 h-4 transition-transform", isUserMgmtOpen && "transform rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 space-y-1 pt-1">
              <SidebarItem 
                icon={Users} 
                label="Admins" 
                href="/admins" 
                active={location === "/admins"} 
              />
              <SidebarItem 
                icon={Users} 
                label="Clients" 
                href="/clients" 
                active={location === "/clients"} 
              />
            </CollapsibleContent>
          </Collapsible>

          <SidebarItem 
            icon={MapPin} 
            label="Site Management" 
            href="/sites" 
            active={location === "/sites"} 
          />
          
          <SidebarItem 
            icon={Gauge} 
            label="Meter Management" 
            href="/meters" 
            active={location === "/meters"} 
          />
          
          <SidebarItem 
            icon={Settings2} 
            label="Operation Modes" 
            href="/operation-modes" 
            active={location === "/operation-modes"} 
          />

          <Collapsible open={isEstMgmtOpen} onOpenChange={setIsEstMgmtOpen} className="space-y-1">
            <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 group">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 group-hover:text-primary" />
                <span>Establishments</span>
              </div>
              <ChevronDown className={cn("w-4 h-4 transition-transform", isEstMgmtOpen && "transform rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 space-y-1 pt-1">
              <SidebarItem 
                icon={Building2} 
                label="Types" 
                href="/establishment-types" 
                active={location === "/establishment-types"} 
              />
              <SidebarItem 
                icon={Building2} 
                label="Establishments" 
                href="/establishments" 
                active={location === "/establishments"} 
              />
            </CollapsibleContent>
          </Collapsible>

          <div className="pt-4 mt-4 border-t border-border/50">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Finance</p>
            <SidebarItem 
              icon={Wallet} 
              label="Billing Profiles" 
              href="/billing-profiles" 
              active={location === "/billing-profiles"} 
            />
          </div>

          <div className="pt-4 mt-2 border-t border-border/50">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Settings</p>
            <SidebarItem 
              icon={Key} 
              label="Mpesa Keys" 
              href="/mpesa-keys" 
              active={location === "/mpesa-keys"} 
            />
          </div>
        </nav>
      </div>
    </aside>
  );
}
