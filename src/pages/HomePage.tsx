import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Shield, Activity, Lock, AlertTriangle, Key } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import type { ApiResponse, AuditLog } from '@shared/types';
const mockChartData = [
  { time: '00:00', throughput: 120 },
  { time: '04:00', throughput: 300 },
  { time: '08:00', throughput: 850 },
  { time: '12:00', throughput: 940 },
  { time: '16:00', throughput: 1200 },
  { time: '20:00', throughput: 700 },
  { time: '23:59', throughput: 450 },
];
export function HomePage() {
  const { data: logsResponse, isLoading } = useQuery<ApiResponse<AuditLog[]>>({
    queryKey: ['audit-logs'],
    queryFn: () => fetch('/api/logs').then(res => res.json()),
    refetchInterval: 5000,
  });
  const logs = logsResponse?.data ?? [];
  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Command <span className="text-primary">Center</span>
          </h1>
          <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
            DMZ Security Infrastructure Dashboard
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/50 bg-secondary/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Threat Level</CardTitle>
              <Shield className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500 glow-text-emerald">LOW</div>
              <p className="text-[10px] text-muted-foreground font-mono mt-1">NO ACTIVE BREACHES DETECTED</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-secondary/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Nodes</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary glow-text-blue">14 / 14</div>
              <p className="text-[10px] text-muted-foreground font-mono mt-1">ALL SERVICES OPERATIONAL</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-secondary/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Keys Rotated</CardTitle>
              <Key className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-[10px] text-muted-foreground font-mono mt-1">LAST ROTATION: 2H AGO</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-secondary/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Blocked IP</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,024</div>
              <p className="text-[10px] text-muted-foreground font-mono mt-1">TOTAL MALICIOUS DROPS</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 border-border/50 bg-secondary/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Encryption Throughput</CardTitle>
              <CardDescription>Real-time data flow through internal security layer (TPS)</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData}>
                    <defs>
                      <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--secondary))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="throughput" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorThroughput)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3 border-border/50 bg-secondary/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Access Audit Log</CardTitle>
              <CardDescription>Recent mTLS Authentications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {isLoading ? (
                  <p className="text-xs text-muted-foreground animate-pulse">Fetching logs...</p>
                ) : logs.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No recent activity.</p>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between border-b border-border/30 pb-2 last:border-0">
                      <div className="flex flex-col">
                        <span className="text-xs font-mono font-bold tracking-tighter truncate max-w-[150px]">{log.identity}</span>
                        <span className={cn("text-[10px] font-bold uppercase", log.result === 'SUCCESS' ? "text-emerald-500" : "text-destructive")}>
                          {log.action}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}