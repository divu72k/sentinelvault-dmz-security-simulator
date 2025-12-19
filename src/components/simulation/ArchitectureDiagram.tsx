import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Server, Database, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
interface NodeProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}
const Node = ({ icon, label, isActive, isCompleted }: NodeProps) => (
  <div className="flex flex-col items-center gap-3 relative z-10">
    <motion.div
      animate={{
        scale: isActive ? 1.1 : 1,
        borderColor: isActive ? "hsl(var(--primary))" : isCompleted ? "hsl(var(--primary) / 0.5)" : "hsl(var(--border))",
        backgroundColor: isActive ? "hsl(var(--primary) / 0.1)" : "transparent",
      }}
      className={cn(
        "h-16 w-16 rounded-2xl border-2 flex items-center justify-center transition-colors duration-500 bg-background",
        isActive && "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
        isCompleted && "border-primary/50"
      )}
    >
      {React.cloneElement(icon as React.ReactElement, {
        className: cn(
          "h-8 w-8 transition-colors duration-500",
          isActive ? "text-primary" : isCompleted ? "text-primary/70" : "text-muted-foreground/40"
        )
      })}
    </motion.div>
    <span className={cn(
      "text-[10px] font-mono uppercase tracking-widest font-bold transition-colors duration-500",
      isActive ? "text-primary" : isCompleted ? "text-primary/70" : "text-muted-foreground/40"
    )}>
      {label}
    </span>
  </div>
);
interface ArchitectureDiagramProps {
  currentStepIndex: number;
  isSimulating: boolean;
}
export function ArchitectureDiagram({ currentStepIndex, isSimulating }: ArchitectureDiagramProps) {
  const nodes = [
    { icon: <User />, label: "Client" },
    { icon: <Shield />, label: "Gateway" },
    { icon: <Server />, label: "Internal" },
    { icon: <Database />, label: "Vault" },
  ];
  return (
    <div className="flex items-center justify-between w-full max-w-4xl px-12 relative">
      {/* Background Connection Lines */}
      <div className="absolute top-8 left-0 w-full h-[2px] bg-border/20 z-0" />
      {/* Animated Flow Packet */}
      <AnimatePresence>
        {isSimulating && currentStepIndex >= 0 && currentStepIndex < 4 && (
          <motion.div
            key="packet"
            initial={{ left: "10%" }}
            animate={{ left: `${10 + (currentStepIndex * 26.6)}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
            className="absolute top-7 z-20 h-3 w-3 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]"
          >
            <motion.div 
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute inset-0 rounded-full bg-primary opacity-50"
            />
          </motion.div>
        )}
      </AnimatePresence>
      {nodes.map((node, i) => (
        <React.Fragment key={node.label}>
          <Node 
            icon={node.icon} 
            label={node.label} 
            isActive={currentStepIndex === i}
            isCompleted={currentStepIndex > i}
          />
          {i < nodes.length - 1 && (
            <div className="flex-1 flex justify-center text-muted-foreground/20">
              <ArrowRight className="h-4 w-4" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}