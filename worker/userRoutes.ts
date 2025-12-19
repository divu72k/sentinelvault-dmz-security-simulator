import { Hono } from "hono";
import { Env } from './core-utils';
import type { ApiResponse, AuditLog, SimulationStep, VaultKey, VaultStatus } from '@shared/types';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // Audit Logs
    app.get('/api/logs', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.getAuditLogs();
        return c.json({ success: true, data } satisfies ApiResponse<AuditLog[]>);
    });
    // Vault Endpoints
    app.get('/api/vault/keys', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.getVaultKeys();
        return c.json({ success: true, data } satisfies ApiResponse<VaultKey[]>);
    });
    app.get('/api/vault/status', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.getVaultStatus();
        return c.json({ success: true, data } satisfies ApiResponse<VaultStatus>);
    });
    app.post('/api/vault/rotate', async (c) => {
        const { id } = await c.req.json<{ id: string }>();
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.rotateKey(id);
        return c.json({ success: true, data } satisfies ApiResponse<VaultKey[]>);
    });
    app.post('/api/vault/lock', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.toggleVaultLock();
        return c.json({ success: true, data } satisfies ApiResponse<VaultStatus>);
    });
    // Simulation Trigger
    app.post('/api/simulation/trigger', async (c) => {
        try {
          const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
          const data = await stub.triggerSimulation();
          return c.json({ success: true, data } satisfies ApiResponse<SimulationStep[]>);
        } catch (e) {
          return c.json({ success: false, error: e instanceof Error ? e.message : "Simulation failed" }, 500);
        }
    });
}