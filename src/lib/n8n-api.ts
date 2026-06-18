// ============================================================
// N8N API CLIENT - Integracion con la instancia de n8n
// Workflow: RRRR7 | Instancia: SLA
// ============================================================

const N8N_BASE_URL = "https://ddd-n8n.qmp9yp.easypanel.host/api/v1";
const N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ZjFjNTVkMy00ZmM3LTQ1MTItOWZjMC05MDZjYzI2NjIzOGEiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNGU2M2UwMzctZDg1Mi00MzU1LWE1OTUtMTY5Yzg2ODA4M2U5IiwiaWF0IjoxNzgxNzY4MDA0fQ.FmLMvc3MHwAd2rXya-6nkooq7KOZy_7sXwlmNQt6fKo";

interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

interface N8nExecution {
  id: string;
  workflowId: string;
  mode: string;
  startedAt: string;
  stoppedAt?: string;
  status: string;
  executionTime?: number;
}

async function n8nFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${N8N_BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "X-N8N-API-KEY": N8N_API_KEY,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`n8n API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

// ============================================================
// WORKFLOWS
// ============================================================

export async function getN8nWorkflows(): Promise<N8nWorkflow[]> {
  const data = await n8nFetch<{ data: N8nWorkflow[] }>("/workflows");
  return data.data;
}

export async function getN8nWorkflowById(id: string): Promise<N8nWorkflow> {
  return n8nFetch<N8nWorkflow>(`/workflows/${id}`);
}

export async function getN8nWorkflowExecutions(
  workflowId?: string,
  limit = 20
): Promise<N8nExecution[]> {
  const params = new URLSearchParams();
  if (workflowId) params.append("workflowId", workflowId);
  params.append("limit", String(limit));
  const data = await n8nFetch<{ data: N8nExecution[] }>(`/executions?${params.toString()}`);
  return data.data;
}

// ============================================================
// METRICAS / ESTADISTICAS
// ============================================================

export async function getN8nStats() {
  const workflows = await getN8nWorkflows();
  const executions = await getN8nWorkflowExecutions(undefined, 100);

  const activeCount = workflows.filter((w) => w.active).length;
  const totalCount = workflows.length;

  const successful = executions.filter((e) => e.status === "success").length;
  const failed = executions.filter((e) => e.status === "error").length;
  const totalExec = executions.length;

  const avgTime =
    executions.length > 0
      ? executions.reduce((s, e) => s + (e.executionTime || 0), 0) / executions.length
      : 0;

  return {
    workflows: {
      total: totalCount,
      active: activeCount,
      inactive: totalCount - activeCount,
    },
    executions: {
      total: totalExec,
      success: successful,
      failed: failed,
      successRate: totalExec > 0 ? (successful / totalExec) * 100 : 0,
    },
    performance: {
      avgExecutionTimeMs: Math.round(avgTime),
      lastUpdated: new Date().toISOString(),
    },
  };
}

// ============================================================
// WORKFLOW RRRR7 - Rhinoberto
// ============================================================

export async function getRhinobertoWorkflow() {
  return getN8nWorkflowById("Gq72rk97ysswPENK");
}

export async function getRhinobertoExecutions(limit = 10) {
  return getN8nWorkflowExecutions("Gq72rk97ysswPENK", limit);
}

// ============================================================
// MAPEO A FORMATO DEL PORTAL
// ============================================================

import type { Workflow } from "./mock-data";

export async function getWorkflowsFromN8n(): Promise<Workflow[]> {
  try {
    const [workflows, executions] = await Promise.all([
      getN8nWorkflows(),
      getN8nWorkflowExecutions(undefined, 50),
    ]);

    return workflows.map((w) => {
      const wfExecs = executions.filter((e) => e.workflowId === w.id);
      const successful = wfExecs.filter((e) => e.status === "success");
      const failed = wfExecs.filter((e) => e.status === "error");
      const total = wfExecs.length;

      const estado: Workflow["estado"] =
        !w.active ? "inactivo" : failed.length > successful.length && total > 0 ? "error" : "activo";

      const avgTime =
        total > 0
          ? wfExecs.reduce((s, e) => s + (e.executionTime || 0), 0) / total
          : 0;

      return {
        id: w.id,
        nombre: w.name,
        estado,
        ejecuciones24h: total,
        exito: total > 0 ? (successful.length / total) * 100 : 0,
        latenciaMs: Math.round(avgTime),
        ultimaEjecucion: wfExecs[0]?.startedAt
          ? `hace ${Math.round((Date.now() - new Date(wfExecs[0].startedAt).getTime()) / 60000)}m`
          : "sin ejecuciones",
        fuente: "n8n",
      };
    });
  } catch (err) {
    console.error("Error al obtener workflows de n8n:", err);
    // Fallback: retornar vacio para que el UI maneje el estado
    return [];
  }
}

// ============================================================
// KPIs DESDE N8N
// ============================================================

import type { KpiCard } from "./mock-data";

export async function getKpisFromN8n(): Promise<KpiCard[]> {
  try {
    const stats = await getN8nStats();

    return [
      {
        id: "wf_activos",
        label: "Workflows Activos",
        value: `${stats.workflows.active}/${stats.workflows.total}`,
        delta: 0,
        helper: "en tiempo real",
        tone: "brand",
      },
      {
        id: "exec_24h",
        label: "Ejecuciones 24h",
        value: String(stats.executions.total),
        delta: 0,
        helper: "ultimas 24 horas",
        tone: "positive",
      },
      {
        id: "tasa_exito",
        label: "Tasa de Exito",
        value: `${stats.executions.successRate.toFixed(1)}%`,
        delta: stats.executions.successRate,
        helper: "promedio global",
        tone: stats.executions.successRate >= 95 ? "positive" : "negative",
      },
      {
        id: "latencia",
        label: "Latencia Promedio",
        value: `${stats.performance.avgExecutionTimeMs}ms`,
        delta: 0,
        helper: "tiempo de ejecucion",
        tone: "neutral",
      },
      {
        id: "auto_act",
        label: "Automatizaciones Activas",
        value: String(stats.workflows.active),
        delta: 0,
        helper: "operacion normal",
        tone: "neutral",
      },
    ];
  } catch (err) {
    console.error("Error al obtener KPIs de n8n:", err);
    return [];
  }
}

// ============================================================
// PARSEO DE EJECUCIONES - Extraer conversaciones y leads
// ============================================================

export interface ParsedExecution {
  executionId: string;
  workflowId: string;
  timestamp: string;
  status: string;
  telefono?: string;
  contacto?: string;
  mensaje?: string;
  respuesta?: string;
  intencion?: string;
  urgencia?: string;
  canal?: string;
}

export async function getExecutionDetail(executionId: string) {
  try {
    return await n8nFetch<any>(`/executions/${executionId}?includeData=true`);
  } catch {
    return null;
  }
}

export async function parseRhinobertoExecutions(limit = 20): Promise<ParsedExecution[]> {
  try {
    const executions = await getN8nWorkflowExecutions("Gq72rk97ysswPENK", limit);
    const parsed: ParsedExecution[] = [];

    for (const exec of executions) {
      const detail = await getExecutionDetail(exec.id);
      if (!detail || !detail.data) continue;

      const resultData = detail.data?.resultData?.runData || {};
      const webhookNode = Object.keys(resultData).find((k) =>
        k.toLowerCase().includes("webhook")
      );

      let telefono = "";
      let contacto = "";
      let mensaje = "";
      let respuesta = "";
      let intencion = "";
      let urgencia = "normal";
      let canal = "WhatsApp";

      if (webhookNode && resultData[webhookNode]?.[0]?.data?.[0]?.json?.body) {
        const body = resultData[webhookNode][0].data[0].json.body;
        telefono = body.data?.key?.remoteJid || body.sender || "";
        contacto = body.data?.pushName || body.pushName || "Cliente";
        mensaje = body.data?.message?.conversation || body.data?.message?.extendedTextMessage?.text || "";
      }

      const httpNode = Object.keys(resultData).find((k) =>
        k.toLowerCase().includes("mandar") || k.toLowerCase().includes("send")
      );
      if (httpNode && resultData[httpNode]?.[0]?.data?.[0]?.json) {
        const sendData = resultData[httpNode][0].data[0].json;
        respuesta = sendData.text || "";
      }

      const codeNode = Object.keys(resultData).find((k) =>
        k.toLowerCase().includes("analisis") || k.toLowerCase().includes("intencion")
      );
      if (codeNode && resultData[codeNode]?.[0]?.data?.[0]?.json) {
        const analysis = resultData[codeNode][0].data[0].json;
        intencion = analysis.tipo_consulta || analysis.intention || "";
        urgencia = analysis.urgencia || analysis.urgency || "normal";
      }

      parsed.push({
        executionId: exec.id,
        workflowId: exec.workflowId,
        timestamp: exec.startedAt,
        status: exec.status,
        telefono,
        contacto,
        mensaje,
        respuesta,
        intencion,
        urgencia,
        canal,
      });
    }

    return parsed;
  } catch (err) {
    console.error("Error parseando ejecuciones:", err);
    return [];
  }
}
