import { DurableObject } from "cloudflare:workers";
import type { DemoItem, AuditLog, SimulationStep } from '@shared/types';
import { MOCK_ITEMS } from '@shared/mock-data';
export class GlobalDurableObject extends DurableObject {
    async getCounterValue(): Promise<number> {
      const value = (await this.ctx.storage.get("counter_value")) || 0;
      return value as number;
    }
    async increment(amount = 1): Promise<number> {
      let value: number = (await this.ctx.storage.get("counter_value")) || 0;
      value += amount;
      await this.ctx.storage.put("counter_value", value);
      return value;
    }
    async getDemoItems(): Promise<DemoItem[]> {
      const items = await this.ctx.storage.get("demo_items");
      if (items) return items as DemoItem[];
      await this.ctx.storage.put("demo_items", MOCK_ITEMS);
      return MOCK_ITEMS;
    }
    async addDemoItem(item: DemoItem): Promise<DemoItem[]> {
      const items = await this.getDemoItems();
      const updatedItems = [...items, item];
      await this.ctx.storage.put("demo_items", updatedItems);
      return updatedItems;
    }
    async updateDemoItem(id: string, updates: Partial<Omit<DemoItem, 'id'>>): Promise<DemoItem[]> {
      const items = await this.getDemoItems();
      const updatedItems = items.map(item => item.id === id ? { ...item, ...updates } : item);
      await this.ctx.storage.put("demo_items", updatedItems);
      return updatedItems;
    }
    async deleteDemoItem(id: string): Promise<DemoItem[]> {
      const items = await this.getDemoItems();
      const updatedItems = items.filter(item => item.id !== id);
      await this.ctx.storage.put("demo_items", updatedItems);
      return updatedItems;
    }
    // New Audit Log & Simulation Methods
    async getAuditLogs(): Promise<AuditLog[]> {
      return (await this.ctx.storage.get<AuditLog[]>("audit_logs")) || [];
    }
    async logAuditEvent(event: Omit<AuditLog, "id" | "timestamp">): Promise<AuditLog[]> {
      const logs = await this.getAuditLogs();
      const newLog: AuditLog = {
        ...event,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      };
      const updatedLogs = [newLog, ...logs].slice(0, 50); // Keep last 50
      await this.ctx.storage.put("audit_logs", updatedLogs);
      return updatedLogs;
    }
    async triggerSimulation(): Promise<SimulationStep[]> {
      const steps: SimulationStep[] = [
        { id: "1", nodeName: "Client mTLS", status: "success", message: "Client certificate verified via SPIFFE SVID", timestamp: new Date().toISOString() },
        { id: "2", nodeName: "DMZ Gateway", status: "success", message: "WAF inspection passed. Request routed to internal network.", timestamp: new Date().toISOString() },
        { id: "3", nodeName: "Internal Service", status: "success", message: "Decrypted payload using session key. Requesting Vault access.", timestamp: new Date().toISOString() },
        { id: "4", nodeName: "Sentinel Vault", status: "success", message: "HSM Key retrieved for identity: svc-payments", timestamp: new Date().toISOString() },
      ];
      // Log the simulation as a single high-level event
      await this.logAuditEvent({
        action: "SECURE_TRANSACTION_SIM",
        identity: "ext-client-0xAF",
        result: "SUCCESS",
        details: "Full DMZ traversal completed across 4 layers"
      });
      return steps;
    }
}