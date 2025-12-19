import React from "react";
import { LayoutDashboard, ShieldCheck, Network, Database, Lock } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
const menuItems = [
  { title: "Command Center", icon: LayoutDashboard, path: "/" },
  { title: "Encryption Sandbox", icon: Lock, path: "/encryption" },
  { title: "Architecture Sim", icon: Network, path: "/simulation", disabled: true },
  { title: "Vault Manager", icon: Database, path: "/vault", disabled: true },
];
export function AppSidebar(): JSX.Element {
  const location = useLocation();
  return (
    <Sidebar className="border-r border-border/50 bg-background/95 backdrop-blur-xl">
      <SidebarHeader className="border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 ring-1 ring-primary/40">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground">SENTINEL VAULT</span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">DMZ SECURED</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
            Navigation
          </SidebarGroupLabel>
          <SidebarMenu className="px-2">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.path}
                  disabled={item.disabled}
                  className={cn(
                    "transition-all duration-200",
                    item.disabled && "opacity-50 cursor-not-allowed pointer-events-none"
                  )}
                >
                  <Link to={item.path} className="flex items-center gap-3">
                    <item.icon className={cn("h-4 w-4", location.pathname === item.path ? "text-primary" : "text-muted-foreground")} />
                    <span className="font-medium">{item.title}</span>
                    {item.disabled && (
                      <span className="ml-auto text-[8px] bg-muted px-1.5 py-0.5 rounded uppercase font-bold text-muted-foreground">Coming</span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/50 p-4">
        <div className="flex flex-col gap-1 rounded-lg bg-secondary/50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">System Status</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-xs font-mono text-emerald-500">OPERATIONAL</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}