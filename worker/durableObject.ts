import { DurableObject } from "cloudflare:workers";
import type { DemoItem, AuditLog, SimulationStep, VaultKey, VaultStatus } from '@shared/types';
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
    // Vault & Key Management
    async getVaultKeys(): Promise<VaultKey[]> {
      let keys = await this.ctx.storage.get<VaultKey[]>("vault_keys");
      if (!keys) {
        keys = [
          {
            id: crypto.randomUUID(),
            alias: "svc-payments-primary",
            version: 1,
            algorithm: "AES-256-GCM",
            createdAt: new Date().toISOString(),
            lastUsed: new Date().toISOString(),
            status: "Active",
            fingerprint: "SHA256:7b:e4:92..."
          },
          {
            id: crypto.randomUUID(),
            alias: "svc-auth-identity",
            version: 1,
            algorithm: "RSA-4096",
            createdAt: new Date().toISOString(),
            lastUsed: new Date().toISOString(),
            status: "Active",
            fingerprint: "SHA256:1a:c2:d3..."
          }
        ];
        await this.ctx.storage.put("vault_keys", keys);
      }
      return keys;
    }
    async rotateKey(id: string): Promise<VaultKey[]> {
      const keys = await this.getVaultKeys();
      const updatedKeys = keys.map(k => {
        if (k.id === id) {
          return {
            ...k,
            version: k.version + 1,
            lastUsed: new Date().toISOString(),
            status: 'Rotated' as const
          };
        }
        return k;
      });
      await this.ctx.storage.put("vault_keys", updatedKeys);
      await this.logAuditEvent({
        action: "KEY_ROTATION",
        identity: "admin-system",
        result: "SUCCESS",
        details: `Key ${id} bumped to version`
      });
      return updatedKeys;
    }
    async getVaultStatus(): Promise<VaultStatus> {
      const status = await this.ctx.storage.get<VaultStatus>("vault_status");
      if (status) return status;
      const defaultStatus: VaultStatus = {
        isLocked: false,
        lastMaintenance: new Date().toISOString(),
        totalKeys: 2,
        activeRotations: 0
      };
      await this.ctx.storage.put("vault_status", defaultStatus);
      return defaultStatus;
    }
    async toggleVaultLock(): Promise<VaultStatus> {
      const status = await this.getVaultStatus();
      const updated = { ...status, isLocked: !status.isLocked };
      await this.ctx.storage.put("vault_status", updated);
      await this.logAuditEvent({
        action: updated.isLocked ? "VAULT_SEALED" : "VAULT_UNSEALED",
        identity: "admin-root",
        result: "SUCCESS",
        details: updated.isLocked ? "Global security override triggered" : "Normal operations resumed"
      });
      return updated;
    }
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
      const updatedLogs = [newLog, ...logs].slice(0, 50); 
      await this.ctx.storage.put("audit_logs", updatedLogs);
      return updatedLogs;
    }
    async triggerSimulation(): Promise<SimulationStep[]> {
      const status = await this.getVaultStatus();
      if (status.isLocked) {
        throw new Error("Vault is sealed. All cryptographic operations suspended.");
      }
      const steps: SimulationStep[] = [
        { id: "1", nodeName: "Client mTLS", status: "success", message: "Client certificate verified via SPIFFE SVID", timestamp: new Date().toISOString() },
        { id: "2", nodeName: "DMZ Gateway", status: "success", message: "WAF inspection passed. Request routed to internal network.", timestamp: new Date().toISOString() },
        { id: "3", nodeName: "Internal Service", status: "success", message: "Decrypted payload using session key. Requesting Vault access.", timestamp: new Date().toISOString() },
        { id: "4", nodeName: "Sentinel Vault", status: "success", message: "HSM Key retrieved for identity: svc-payments", timestamp: new Date().toISOString() },
      ];
      await this.logAuditEvent({
        action: "SECURE_TRANSACTION_SIM",
        identity: "ext-client-0xAF",
        result: "SUCCESS",
        details: "Full DMZ traversal completed across 4 layers"
      });
      return steps;
    }
}