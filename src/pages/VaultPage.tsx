import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShieldAlert, Key, RotateCw, Lock, Unlock, Fingerprint, Activity } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiResponse, VaultKey, VaultStatus, AuditLog } from '@shared/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
export default function VaultPage() {
  const queryClient = useQueryClient();
  const { data: keysResponse, isLoading: keysLoading } = useQuery<ApiResponse<VaultKey[]>>({
    queryKey: ['vault-keys'],
    queryFn: () => fetch('/api/vault/keys').then(res => res.json()),
  });
  const { data: statusResponse } = useQuery<ApiResponse<VaultStatus>>({
    queryKey: ['vault-status'],
    queryFn: () => fetch('/api/vault/status').then(res => res.json()),
    refetchInterval: 3000,
  });
  const { data: logsResponse } = useQuery<ApiResponse<AuditLog[]>>({
    queryKey: ['audit-logs'],
    queryFn: () => fetch('/api/logs').then(res => res.json()),
  });
  const rotateMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch('/api/vault/rotate', {
        method: 'POST',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault-keys'] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
      toast.success("Cryptographic key rotation initiated");
    }
  });
  const lockMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/vault/lock', { method: 'POST' });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault-status'] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
      toast.warning("Vault security state modified");
    }
  });
  const keys = keysResponse?.data ?? [];
  const status = statusResponse?.data;
  const vaultLogs = (logsResponse?.data ?? []).filter(l => l.action.includes('VAULT') || l.action.includes('KEY'));
  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Vault <span className="text-primary">Manager</span>
          </h1>
          <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
            HSM Control Plane & Key Lifecycle
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className={cn(
            "border-2 transition-all duration-500",
            status?.isLocked ? "border-destructive/50 bg-destructive/5" : "border-emerald-500/30 bg-emerald-500/5"
          )}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center justify-between">
                <span>Security State</span>
                {status?.isLocked ? <Lock className="h-4 w-4 text-destructive" /> : <Unlock className="h-4 w-4 text-emerald-500" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={cn(
                "text-2xl font-black font-mono tracking-tighter",
                status?.isLocked ? "text-destructive" : "text-emerald-500"
              )}>
                {status?.isLocked ? "SEALED" : "OPERATIONAL"}
              </div>
              <Button 
                variant={status?.isLocked ? "default" : "destructive"} 
                className="w-full font-bold uppercase text-[10px]"
                onClick={() => lockMutation.mutate()}
                disabled={lockMutation.isPending}
              >
                {status?.isLocked ? "Unseal Vault" : "Emergency Seal"}
              </Button>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-secondary/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-primary" /> Key Integrity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100%</div>
              <p className="text-[10px] text-muted-foreground font-mono mt-1 uppercase">All keys verified via HSM heart-beat</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-secondary/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" /> Last Audit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-mono truncate">
                {vaultLogs[0]?.timestamp ? new Date(vaultLogs[0].timestamp).toLocaleTimeString() : 'N/A'}
              </div>
              <p className="text-[10px] text-muted-foreground font-mono mt-1 uppercase">
                {vaultLogs[0]?.action || 'No recent activity'}
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="border-border/50 bg-secondary/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Key Registry</CardTitle>
            <CardDescription>Managed cryptographic identities and rotation status</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider">Alias / ID</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider">Version</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider">Algorithm</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keysLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground animate-pulse">Loading secure keys...</TableCell></TableRow>
                ) : keys.map((key) => (
                  <TableRow key={key.id} className="border-border/30 hover:bg-primary/5">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">{key.alias}</span>
                        <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[200px]">{key.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-[10px]">v{key.version}</Badge>
                    </TableCell>
                    <TableCell className="text-[10px] font-mono text-muted-foreground">{key.algorithm}</TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "text-[9px] font-bold",
                        key.status === 'Active' ? "bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30" : "bg-primary/20 text-primary hover:bg-primary/30"
                      )}>
                        {key.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 px-2 text-[10px] font-bold uppercase hover:text-primary"
                        onClick={() => rotateMutation.mutate(key.id)}
                        disabled={rotateMutation.isPending || status?.isLocked}
                      >
                        <RotateCw className={cn("h-3 w-3 mr-2", rotateMutation.isPending && "animate-spin")} />
                        Rotate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border/50 bg-secondary/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-widest">Vault Security Policy</CardTitle>
            </CardHeader>
            <CardContent className="text-[11px] text-muted-foreground leading-relaxed space-y-4">
              <div className="flex items-start gap-3">
                <ShieldAlert className="h-4 w-4 text-primary shrink-0" />
                <p>Keys are stored in an <span className="text-foreground">FIPS 140-2 Level 3</span> compliant simulated HSM module. Direct extraction is physically impossible.</p>
              </div>
              <div className="flex items-start gap-3">
                <Key className="h-4 w-4 text-primary shrink-0" />
                <p>Automated rotation occurs every 90 days or upon manual override. All versions are maintained for 24 hours to support late-arrival decryption.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-secondary/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-widest">Recent Activity Log</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[150px] overflow-y-auto pr-2">
              {vaultLogs.length === 0 ? (
                <p className="text-[10px] italic text-muted-foreground">No administrative actions logged.</p>
              ) : vaultLogs.map((log) => (
                <div key={log.id} className="flex justify-between items-center border-b border-border/20 pb-2 last:border-0">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-primary">{log.action}</span>
                    <span className="text-[9px] text-muted-foreground font-mono">{log.identity}</span>
                  </div>
                  <span className="text-[9px] font-mono text-muted-foreground">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}