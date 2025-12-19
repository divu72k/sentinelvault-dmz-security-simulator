import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ArchitectureDiagram } from '@/components/simulation/ArchitectureDiagram';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Terminal, ShieldCheck, RefreshCw } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiResponse, SimulationStep } from '@shared/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
export default function SimulationPage() {
  const queryClient = useQueryClient();
  const [activeSteps, setActiveSteps] = useState<SimulationStep[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/simulation/trigger', { method: 'POST' });
      const json = await res.json() as ApiResponse<SimulationStep[]>;
      if (!json.success) throw new Error(json.error);
      return json.data!;
    },
    onSuccess: async (steps) => {
      setIsSimulating(true);
      setActiveSteps([]);
      setCurrentStepIndex(-1);
      // Animation sequence
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setCurrentStepIndex(i);
        setActiveSteps(prev => [...prev, steps[i]]);
      }
      setIsSimulating(false);
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
      toast.success("Simulation sequence completed successfully");
    },
    onError: (err) => {
      toast.error(`Simulation failed: ${err.message}`);
      setIsSimulating(false);
    }
  });
  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Architecture <span className="text-primary">Simulator</span>
            </h1>
            <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
              Zero-Trust Request Lifecycle Visualization
            </p>
          </div>
          <Button 
            size="lg" 
            className="font-bold uppercase tracking-widest" 
            onClick={() => mutation.mutate()}
            disabled={isSimulating}
          >
            {isSimulating ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            Initiate Secure Transaction
          </Button>
        </div>
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <Card className="border-border/50 bg-secondary/10 backdrop-blur-sm h-[500px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none cyber-grid" />
              <ArchitectureDiagram currentStepIndex={currentStepIndex} isSimulating={isSimulating} />
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="border-border/50 bg-secondary/20 backdrop-blur-sm h-full flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="h-3 w-3" /> Real-time Console
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto font-mono text-[10px] space-y-3">
                {activeSteps.length === 0 && !isSimulating && (
                  <p className="text-muted-foreground italic">System idle. Awaiting trigger...</p>
                )}
                {activeSteps.map((step, idx) => (
                  <div key={step.id} className="animate-in slide-in-from-left-2 duration-300">
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <span className="opacity-50">[{idx + 1}]</span>
                      <span className="uppercase">{step.nodeName}</span>
                    </div>
                    <div className="text-muted-foreground ml-6 leading-relaxed">
                      {step.message}
                    </div>
                  </div>
                ))}
                {isSimulating && currentStepIndex < 3 && (
                  <div className="ml-6 text-primary animate-pulse">PROCESSING...</div>
                )}
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-emerald-500/5 border-emerald-500/20">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase">
                  <ShieldCheck className="h-4 w-4" /> Security Posture
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  The current flow demonstrates <span className="text-foreground">Identity-based Perimeter Defense</span>. 
                  Every node requires mutual TLS and SPIFFE SVID verification before processing payloads.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}