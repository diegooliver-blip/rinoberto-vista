import { createServerFn } from "@tanstack/react-start";
import {
  getWorkflowsFromN8n,
  getKpisFromN8n,
  getN8nStats,
  parseRhinobertoExecutions,
} from "./n8n-api";
import {
  getKpis as getMockKpis,
  getTrend,
  getWorkflows as getMockWorkflows,
  getConversations as getMockConversations,
  getSourceMix,
  getFunnel,
  getLeads as getMockLeads,
  getAiMetrics,
  getNotifications,
  getKnowledge,
  getReports,
  type Conversation,
  type Lead,
} from "./mock-data";
import {
  getConversationsDb,
  getConversationStats,
  getLeadsDb,
  insertConversation,
  upsertLead,
  resetDb,
} from "./db";

// ============================================================
// MAPEO DB -> FORMATO FRONTEND
// ============================================================
function mapDbToConversation(db: any): Conversation {
  const name = db.contacto || "Cliente";
  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  return {
    id: db.id,
    contacto: name,
    iniciales: initials,
    telefono: db.telefono,
    canal: db.canal || "WhatsApp",
    estado: db.estado || "Nuevo Lead",
    ultimoMensaje: db.mensaje || "",
    sentimiento: db.sentimiento || "neutral",
    sentimientoScore: db.sentimiento === "positivo" ? 0.85 : db.sentimiento === "negativo" ? 0.25 : 0.5,
    hora: db.timestamp ? new Date(db.timestamp).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }) : "--:--",
    fuente: db.fuente || "WhatsApp",
    region: db.region || "México",
  };
}

function mapDbToLead(db: any): Lead {
  return {
    id: db.id,
    nombre: db.nombre || "Lead",
    empresa: db.empresa || "SLA Cliente",
    email: db.email || "",
    telefono: db.telefono,
    score: db.score || 50,
    estado: db.estado || "Nuevo Lead",
    fuente: db.fuente || "WhatsApp",
    region: db.region || "México",
    probabilidad: db.probabilidad || 50,
    ultimaActividad: db.ultimaActividad || "hace 1m",
    valor: db.valor || 0,
  };
}

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
// CONVERSACIONES REALES (DB local + parseo n8n)
// ============================================================
export const fetchConversations = createServerFn({ method: "GET" }).handler(
  async ({ data }: { data?: { limit?: number; useReal?: boolean } }) => {
    const limit = data?.limit ?? 100;

    // Intentar obtener datos reales parseando ejecuciones de n8n
    if (data?.useReal !== false) {
      try {
        const parsed = await parseRhinobertoExecutions(20);
        for (const p of parsed) {
          if (p.telefono && p.mensaje) {
            insertConversation({
              id: `conv_${p.executionId}`,
              telefono: p.telefono,
              contacto: p.contacto || "Cliente",
              mensaje: p.mensaje,
              respuesta: p.respuesta,
              intencion: p.intencion || "general",
              urgencia: p.urgencia || "normal",
              timestamp: p.timestamp,
              canal: (p.canal as any) || "WhatsApp",
              estado: "Nuevo Lead",
              sentimiento: "neutral",
              executionId: p.executionId,
              workflowId: p.workflowId,
            });
          }
        }
        const dbConvos = getConversationsDb(limit);
        if (dbConvos.length > 0) return dbConvos.map(mapDbToConversation);
      } catch {
        // Fallback a mock
      }
    }

    return getMockConversations(limit);
  }
);

export const fetchConversationStats = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const stats = getConversationStats();
    if (stats.total > 0) return stats;
  } catch {
    // ignore
  }
  return {
    total: 0,
    hoy: 0,
    porCanal: { WhatsApp: 0, Instagram: 0, Webchat: 0 },
    porUrgencia: { critical: 0, high: 0, normal: 0 },
  };
});

// ============================================================
// LEADS REALES (DB local)
// ============================================================
export const fetchLeads = createServerFn({ method: "GET" }).handler(
  async ({ data }: { data?: { limit?: number } }) => {
    const limit = data?.limit ?? 100;
    const dbLeads = getLeadsDb(limit);
    if (dbLeads.length > 0) return dbLeads.map(mapDbToLead);
    return getMockLeads().slice(0, limit);
  }
);

// ============================================================
// MOCK DATA (hasta conectar con BD real)
// ============================================================
export const fetchTrend = createServerFn({ method: "GET" }).handler(async () => getTrend(7));
export const fetchSourceMix = createServerFn({ method: "GET" }).handler(async () => getSourceMix());
export const fetchFunnel = createServerFn({ method: "GET" }).handler(async () => getFunnel());
export const fetchAiMetrics = createServerFn({ method: "GET" }).handler(async () => getAiMetrics());
export const fetchNotifications = createServerFn({ method: "GET" }).handler(async () => getNotifications());
export const fetchKnowledge = createServerFn({ method: "GET" }).handler(async () => getKnowledge());
export const fetchReports = createServerFn({ method: "GET" }).handler(async () => getReports());

// ============================================================
// ADMIN / DEBUG
// ============================================================
export const resetDatabase = createServerFn({ method: "POST" }).handler(async () => {
  resetDb();
  return { ok: true };
});
