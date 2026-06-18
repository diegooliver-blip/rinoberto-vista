// ============================================================
// DATA LAYER - Modo SPA (sin server functions)
// Fallback a mocks hasta conectar API proxy
// ============================================================

import {
  getKpis,
  getTrend,
  getWorkflows,
  getConversations,
  getSourceMix,
  getFunnel,
  getLeads,
  getAiMetrics,
  getNotifications,
  getKnowledge,
  getReports,
} from "./mock-data";

// ============================================================
// WORKFLOWS (MOCK - hasta conectar API)
// ============================================================
export async function fetchWorkflows() {
  return getWorkflows();
}

// ============================================================
// KPIs (MOCK)
// ============================================================
export async function fetchKpis() {
  return getKpis();
}

// ============================================================
// STATS (MOCK)
// ============================================================
export async function fetchN8nStats() {
  return {
    workflows: { total: 8, active: 6, inactive: 2 },
    executions: { total: 150, success: 145, failed: 5, successRate: 96.7 },
    performance: { avgExecutionTimeMs: 240, lastUpdated: new Date().toISOString() },
  };
}

// ============================================================
// CONVERSACIONES (MOCK)
// ============================================================
export async function fetchConversations() {
  return getConversations();
}

export async function fetchConversationStats() {
  return {
    total: 0,
    hoy: 0,
    porCanal: { WhatsApp: 0, Instagram: 0, Webchat: 0 },
    porUrgencia: { critical: 0, high: 0, normal: 0 },
  };
}

// ============================================================
// LEADS (MOCK)
// ============================================================
export async function fetchLeads() {
  return getLeads();
}

// ============================================================
// OTROS (MOCK)
// ============================================================
export async function fetchTrend() {
  return getTrend(7);
}

export async function fetchSourceMix() {
  return getSourceMix();
}

export async function fetchFunnel() {
  return getFunnel();
}

export async function fetchAiMetrics() {
  return getAiMetrics();
}

export async function fetchNotifications() {
  return getNotifications();
}

export async function fetchKnowledge() {
  return getKnowledge();
}

export async function fetchReports() {
  return getReports();
}

// ============================================================
// ADMIN / DEBUG
// ============================================================
export async function resetDatabase() {
  return { ok: true };
}
