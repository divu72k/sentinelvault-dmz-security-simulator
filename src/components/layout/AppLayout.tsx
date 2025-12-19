import React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
type AppLayoutProps = {
  children: React.ReactNode;
};
export function AppLayout({ children }: AppLayoutProps): JSX.Element {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background dark overflow-hidden cyber-grid">
        <AppSidebar />
        <SidebarInset className="flex flex-col bg-transparent relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <header className="flex h-16 items-center border-b border-border/50 px-6 justify-between bg-background/50 backdrop-blur-md z-10">
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <h2 className="text-sm font-mono tracking-tighter text-muted-foreground">
                <span className="text-foreground">CONTROL_PLANE</span> v1.0.42
              </h2>
            </div>
            <ThemeToggle className="relative top-0 right-0" />
          </header>
          <main className="flex-1 overflow-y-auto relative">
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
              <div className="w-full h-1 bg-primary/40 animate-scan" />
            </div>
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative z-10">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}