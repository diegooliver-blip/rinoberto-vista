import { createServerFn } from "@tanstack/react-start";
import { getWorkflowsFromN8n, getKpisFromN8n, getN8nStats } from "./n8n-api";
import {
  getKpis as getMockKpis,
  getTrend,
  getWorkflows as getMockWorkflows,
  getConversations,
  getSourceMix,
  getFunnel,
  getLeads,
  getAiMetrics,
  getNotifications,
  getKnowledge,
  getReports,
  getConversationById,
} from "./mock-data";

// ============================================================
// WORKFLOWS (DESDE N8N)
// ============================================================
export const fetchWorkflows = createServerFn({ method: "GET" }).handler(async () => {
  const fromN8n = await getWorkflowsFromN8n();
  if (fromN8n.length > 0) return fromN8n;
  return getMockWorkflows();
});

// ============================================================
// KPIs (DESDE N8N + MOCK COMPLEMENTO)
// ============================================================
export const fetchKpis = createServerFn({ method: "GET" }).handler(async () => {
  const n8nKpis = await getKpisFromN8n();
  const mockKpis = getMockKpis();
  const n8nIds = new Set(n8nKpis.map((k) => k.id));
  return [...n8nKpis, ...mockKpis.filter((k) => !n8nIds.has(k.id))];
});

// ============================================================
// STATS N8N
// ============================================================
export const fetchN8nStats = createServerFn({ method: "GET" }).handler(async () => {
  return getN8nStats();
});

// ============================================================
// MOCK DATA (hasta conectar con BD real)
// ============================================================
export const fetchTrend = createServerFn({ method: "GET" }).handler(async () => getTrend(7));
export const fetchSourceMix = createServerFn({ method: "GET" }).handler(async () => getSourceMix());
export const fetchFunnel = createServerFn({ method: "GET" }).handler(async () => getFunnel());
export const fetchConversations = createServerFn({ method: "GET" }).handler(async () => getConversations());
export const fetchLeads = createServerFn({ method: "GET" }).handler(async () => getLeads());
export const fetchAiMetrics = createServerFn({ method: "GET" }).handler(async () => getAiMetrics());
export const fetchNotifications = createServerFn({ method: "GET" }).handler(async () => getNotifications());
export const fetchKnowledge = createServerFn({ method: "GET" }).handler(async () => getKnowledge());
export const fetchReports = createServerFn({ method: "GET" }).handler(async () => getReports());
