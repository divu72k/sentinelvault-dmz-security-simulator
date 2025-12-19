import { Hono } from "hono";
import { Env } from './core-utils';
import type { DemoItem, ApiResponse, AuditLog, SimulationStep } from '@shared/types';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    app.get('/api/test', (c) => c.json({ success: true, data: { name: 'SentinelVault API' }}));
    // Audit Logs
    app.get('/api/logs', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.getAuditLogs();
        return c.json({ success: true, data } satisfies ApiResponse<AuditLog[]>);
    });
    // Simulation Trigger
    app.post('/api/simulation/trigger', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.triggerSimulation();
        return c.json({ success: true, data } satisfies ApiResponse<SimulationStep[]>);
    });
    // Existing Demo Endpoints
    app.get('/api/demo', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.getDemoItems();
        return c.json({ success: true, data } satisfies ApiResponse<DemoItem[]>);
    });
    app.get('/api/counter', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.getCounterValue();
        return c.json({ success: true, data } satisfies ApiResponse<number>);
    });
}