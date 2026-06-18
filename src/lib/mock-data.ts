// Capa de datos simulada para el Rinoberto Intelligence Portal.
// Toda la UI consume datos desde este módulo a través de funciones puras,
// de modo que en el futuro cada función pueda reemplazarse por una llamada
// real a N8N / Supabase / WhatsApp API / OpenAI sin tocar componentes.

export interface KpiCard {
  id: string;
  label: string;
  value: string;
  delta: number; // porcentaje
  helper: string;
  tone: "positive" | "negative" | "neutral" | "brand";
}

export interface TrendPoint {
  date: string;
  conversaciones: number;
  leads: number;
  citas: number;
}

export interface Workflow {
  id: string;
  nombre: string;
  estado: "activo" | "inactivo" | "error" | "advertencia";
  ejecuciones24h: number;
  exito: number;
  latenciaMs: number;
  ultimaEjecucion: string;
  fuente: string;
}

export type LeadStatus =
  | "Nuevo Lead"
  | "Contactado"
  | "Calificado"
  | "Cita Agendada"
  | "Cerrado Ganado"
  | "Cerrado Perdido";

export interface Conversation {
  id: string;
  contacto: string;
  iniciales: string;
  telefono: string;
  canal: "WhatsApp" | "Instagram" | "Webchat";
  estado: LeadStatus;
  ultimoMensaje: string;
  sentimiento: "positivo" | "neutral" | "negativo";
  sentimientoScore: number;
  hora: string;
  fuente: string;
  region: string;
}

export interface Lead {
  id: string;
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  score: number;
  estado: LeadStatus;
  fuente: string;
  region: string;
  probabilidad: number;
  ultimaActividad: string;
  valor: number;
}

export interface Notification {
  id: string;
  tipo: "info" | "warning" | "critical";
  titulo: string;
  mensaje: string;
  hora: string;
  leido: boolean;
}

export interface KnowledgeDoc {
  id: string;
  titulo: string;
  categoria: string;
  tags: string[];
  version: string;
  actualizado: string;
  resumen: string;
}

/* ============================== KPIs ============================== */

export function getKpis(): KpiCard[] {
  return [
    { id: "conv_total", label: "Conversaciones Totales", value: "24,102", delta: 12.4, helper: "vs mes anterior", tone: "positive" },
    { id: "conv_activas", label: "Conversaciones Activas", value: "318", delta: 4.1, helper: "ahora mismo", tone: "brand" },
    { id: "leads_total", label: "Leads Generados", value: "2,847", delta: 9.2, helper: "vs mes anterior", tone: "positive" },
    { id: "leads_cal", label: "Leads Calificados", value: "1,842", delta: 8.1, helper: "vs mes anterior", tone: "positive" },
    { id: "citas", label: "Citas Agendadas", value: "412", delta: 6.8, helper: "este mes", tone: "positive" },
    { id: "conversion", label: "Tasa de Conversión", value: "14.2%", delta: 0.3, helper: "estable", tone: "neutral" },
    { id: "respuesta", label: "Tiempo de Respuesta Promedio", value: "1.4s", delta: -12.0, helper: "más rápido", tone: "positive" },
    { id: "msg_hoy", label: "Mensajes Enviados Hoy", value: "8,294", delta: 5.6, helper: "vs ayer", tone: "positive" },
    { id: "msg_semana", label: "Mensajes Esta Semana", value: "52,148", delta: 11.3, helper: "vs semana ant.", tone: "positive" },
    { id: "msg_mes", label: "Mensajes Este Mes", value: "214,902", delta: 14.8, helper: "vs mes anterior", tone: "positive" },
    { id: "precision", label: "Precisión de Rinoberto", value: "98.4%", delta: 0.2, helper: "óptimo", tone: "brand" },
    { id: "workflow_ok", label: "Éxito de Workflows", value: "99.1%", delta: 0.4, helper: "últimas 24h", tone: "positive" },
    { id: "workflow_err", label: "Errores de Workflow", value: "7", delta: -22.0, helper: "vs ayer", tone: "positive" },
    { id: "auto_act", label: "Automatizaciones Activas", value: "38", delta: 0, helper: "operación normal", tone: "neutral" },
  ];
}

/* ============================== Tendencias ============================== */

export function getTrend(days = 7): TrendPoint[] {
  const labels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const base = [320, 410, 380, 520, 612, 488, 720];
  return Array.from({ length: days }, (_, i) => {
    const idx = i % 7;
    const c = base[idx] + Math.round(Math.sin(i) * 40);
    return {
      date: days === 7 ? labels[idx] : `D${i + 1}`,
      conversaciones: c,
      leads: Math.round(c * 0.32),
      citas: Math.round(c * 0.09),
    };
  });
}

export function getFunnel() {
  return [
    { etapa: "Contactos", valor: 24102 },
    { etapa: "Conversaciones", valor: 8420 },
    { etapa: "Leads", valor: 2847 },
    { etapa: "Calificados", valor: 1842 },
    { etapa: "Citas", valor: 412 },
    { etapa: "Ganados", valor: 184 },
  ];
}

export function getSourceMix() {
  return [
    { fuente: "WhatsApp", valor: 62 },
    { fuente: "Instagram", valor: 18 },
    { fuente: "Webchat", valor: 12 },
    { fuente: "Referido", valor: 8 },
  ];
}

/* ============================== Workflows N8N ============================== */

export function getWorkflows(): Workflow[] {
  return [
    { id: "wf_001", nombre: "WhatsApp → CRM Sync", estado: "activo", ejecuciones24h: 12402, exito: 99.92, latenciaMs: 142, ultimaEjecucion: "hace 4s", fuente: "n8n / WhatsApp Cloud" },
    { id: "wf_002", nombre: "Clasificación de Leads (IA)", estado: "activo", ejecuciones24h: 2115, exito: 100, latenciaMs: 890, ultimaEjecucion: "hace 12s", fuente: "n8n / OpenAI" },
    { id: "wf_003", nombre: "Calendly Webhook", estado: "advertencia", ejecuciones24h: 412, exito: 96.2, latenciaMs: 612, ultimaEjecucion: "hace 1m", fuente: "n8n / Calendly" },
    { id: "wf_004", nombre: "Sincronización Salesforce", estado: "error", ejecuciones24h: 843, exito: 82.1, latenciaMs: 2103, ultimaEjecucion: "hace 6m", fuente: "n8n / Salesforce" },
    { id: "wf_005", nombre: "Notificaciones Slack", estado: "activo", ejecuciones24h: 1820, exito: 99.7, latenciaMs: 88, ultimaEjecucion: "hace 2s", fuente: "n8n / Slack" },
    { id: "wf_006", nombre: "Resumen Diario por Email", estado: "activo", ejecuciones24h: 1, exito: 100, latenciaMs: 3204, ultimaEjecucion: "hoy 08:00", fuente: "n8n / SMTP" },
    { id: "wf_007", nombre: "Backup PostgreSQL", estado: "inactivo", ejecuciones24h: 0, exito: 0, latenciaMs: 0, ultimaEjecucion: "ayer 23:00", fuente: "n8n / PostgreSQL" },
    { id: "wf_008", nombre: "Enriquecimiento Airtable", estado: "activo", ejecuciones24h: 642, exito: 99.1, latenciaMs: 412, ultimaEjecucion: "hace 30s", fuente: "n8n / Airtable" },
  ];
}

/* ============================== Conversaciones ============================== */

const NOMBRES = [
  ["Jorge Ramírez", "JR"], ["Martha Solís", "MS"], ["Daniel Alva", "DA"],
  ["Ana Lozano", "AL"], ["Carlos Mendoza", "CM"], ["Sofía Vargas", "SV"],
  ["Roberto Pérez", "RP"], ["Lucía Castro", "LC"], ["Diego Fernández", "DF"],
  ["Valeria Núñez", "VN"], ["Andrés Quispe", "AQ"], ["Patricia León", "PL"],
];

const ESTADOS: LeadStatus[] = ["Nuevo Lead", "Contactado", "Calificado", "Cita Agendada", "Cerrado Ganado", "Cerrado Perdido"];
const MENSAJES = [
  "Hola, me interesa agendar una demo para el servicio empresarial.",
  "¿Cuál es el costo del plan empresa?",
  "Cita confirmada para el martes a las 14:30.",
  "Quiero saber más sobre la integración con n8n.",
  "Gracias por la información, lo revisaré con mi equipo.",
  "¿Tienen soporte en LATAM?",
  "Necesito una cotización para 50 usuarios.",
  "Acabo de recibir el contrato, lo firmo hoy.",
];
const REGIONES = ["México", "Colombia", "Perú", "Chile", "Argentina", "España"];
const FUENTES = ["WhatsApp Ads", "Instagram", "Webchat", "Referido", "Google Ads"];

export function getConversations(limit?: number): Conversation[] {
  const list: Conversation[] = NOMBRES.flatMap((n, i) =>
    Array.from({ length: 2 }, (_, j) => {
      const k = i * 2 + j;
      const sent = (["positivo", "neutral", "negativo"] as const)[k % 3];
      return {
        id: `conv_${k + 1}`,
        contacto: n[0],
        iniciales: n[1],
        telefono: `+52 55 ${1000 + k}-${2000 + k}`,
        canal: (["WhatsApp", "Instagram", "Webchat"] as const)[k % 3],
        estado: ESTADOS[k % ESTADOS.length],
        ultimoMensaje: MENSAJES[k % MENSAJES.length],
        sentimiento: sent,
        sentimientoScore: sent === "positivo" ? 0.85 + (k % 5) / 100 : sent === "neutral" ? 0.5 : 0.25,
        hora: `${10 + (k % 8)}:${String(10 + (k % 50)).padStart(2, "0")}`,
        fuente: FUENTES[k % FUENTES.length],
        region: REGIONES[k % REGIONES.length],
      };
    })
  );
  return limit ? list.slice(0, limit) : list;
}

export function getConversationById(id: string) {
  const conv = getConversations().find((c) => c.id === id);
  if (!conv) return null;
  const mensajes = [
    { role: "user" as const, text: "Hola, vi su publicidad sobre automatización.", time: "10:02" },
    { role: "bot" as const, text: `¡Hola ${conv.contacto.split(" ")[0]}! Soy Rinoberto, el asistente de SLA. ¿En qué puedo ayudarte hoy?`, time: "10:02" },
    { role: "user" as const, text: conv.ultimoMensaje, time: conv.hora },
    { role: "bot" as const, text: "Perfecto, en seguida te envío la información. ¿Prefieres una llamada o demo en vivo?", time: conv.hora },
  ];
  const acciones = [
    { hora: "10:02", accion: "Intent detectado: solicitud_demo", tipo: "ai" as const },
    { hora: "10:03", accion: "Workflow ejecutado: Clasificación de Leads", tipo: "workflow" as const },
    { hora: "10:03", accion: "Score asignado: 87/100", tipo: "ai" as const },
    { hora: conv.hora, accion: "Sincronizado con Salesforce CRM", tipo: "workflow" as const },
  ];
  return { ...conv, mensajes, acciones };
}

/* ============================== Leads ============================== */

export function getLeads(): Lead[] {
  return NOMBRES.flatMap((n, i) =>
    Array.from({ length: 3 }, (_, j) => {
      const k = i * 3 + j;
      const score = 35 + ((k * 13) % 65);
      return {
        id: `lead_${k + 1}`,
        nombre: n[0],
        empresa: ["Tech Solutions", "Grupo Andino", "Innova SA", "Lumen Corp", "Pacífico Digital"][k % 5],
        email: `${n[0].toLowerCase().replace(/[^a-z]/g, ".")}@empresa.com`,
        telefono: `+52 55 ${2000 + k}-${3000 + k}`,
        score,
        estado: ESTADOS[k % ESTADOS.length],
        fuente: FUENTES[k % FUENTES.length],
        region: REGIONES[k % REGIONES.length],
        probabilidad: Math.min(95, score + 8),
        ultimaActividad: ["hace 3m", "hace 22m", "hace 1h", "hace 4h", "ayer", "hace 2 días"][k % 6],
        valor: 1500 + ((k * 870) % 18000),
      };
    })
  );
}

/* ============================== IA Performance ============================== */

export function getAiMetrics() {
  return {
    interacciones: 48294,
    intencionAccuracy: 96.8,
    calidadRespuesta: 4.7,
    escalacion: 4.2,
    intervencion: 2.1,
    topPreguntas: [
      { pregunta: "¿Cuál es el precio del plan empresa?", veces: 1842 },
      { pregunta: "¿Tienen integración con WhatsApp?", veces: 1204 },
      { pregunta: "Quiero agendar una demo", veces: 982 },
      { pregunta: "¿Cómo funciona el onboarding?", veces: 734 },
      { pregunta: "¿Tienen soporte 24/7?", veces: 612 },
      { pregunta: "¿Puedo conectar mi CRM?", veces: 548 },
    ],
    topicos: [
      { topico: "Precios", peso: 38 },
      { topico: "Integraciones", peso: 24 },
      { topico: "Demos", peso: 18 },
      { topico: "Soporte", peso: 12 },
      { topico: "Onboarding", peso: 8 },
    ],
    heatmap: Array.from({ length: 7 }, (_, d) =>
      Array.from({ length: 24 }, (_, h) => {
        const peak = h >= 9 && h <= 19 ? 1 : 0.35;
        return Math.round(((Math.sin(d + h / 4) + 1) / 2) * 100 * peak);
      })
    ),
  };
}

/* ============================== Notificaciones ============================== */

export function getNotifications(): Notification[] {
  return [
    { id: "n1", tipo: "critical", titulo: "Workflow falló", mensaje: "Sincronización Salesforce devolvió error 500.", hora: "hace 6m", leido: false },
    { id: "n2", tipo: "warning", titulo: "API desconectada", mensaje: "El webhook de Calendly responde con latencia elevada.", hora: "hace 22m", leido: false },
    { id: "n3", tipo: "info", titulo: "Volumen alto de leads", mensaje: "Se detectó un incremento del 28% en leads de WhatsApp Ads.", hora: "hace 1h", leido: false },
    { id: "n4", tipo: "info", titulo: "Actualización del sistema", mensaje: "Rinoberto v2.4.1 desplegado correctamente.", hora: "hoy 08:00", leido: true },
    { id: "n5", tipo: "warning", titulo: "Actividad inusual", mensaje: "Se registraron 12 mensajes idénticos desde el mismo número.", hora: "ayer", leido: true },
  ];
}

/* ============================== Knowledge Base ============================== */

export function getKnowledge(): KnowledgeDoc[] {
  return [
    { id: "k1", titulo: "Onboarding de nuevos clientes", categoria: "Procesos", tags: ["onboarding", "comercial"], version: "v3.2", actualizado: "12 Jun 2026", resumen: "Pasos para activar un cliente empresarial en menos de 48 horas." },
    { id: "k2", titulo: "Política de escalación a humano", categoria: "SOP", tags: ["ia", "escalación"], version: "v2.0", actualizado: "08 Jun 2026", resumen: "Reglas que determinan cuándo Rinoberto transfiere una conversación a un agente humano." },
    { id: "k3", titulo: "Configuración de workflows n8n", categoria: "Automatización", tags: ["n8n", "workflow"], version: "v4.1", actualizado: "03 Jun 2026", resumen: "Guía técnica para crear, versionar y monitorear flujos en producción." },
    { id: "k4", titulo: "Catálogo de integraciones disponibles", categoria: "Documentación", tags: ["integraciones", "api"], version: "v1.5", actualizado: "28 May 2026", resumen: "Lista de APIs y conectores soportados: WhatsApp, OpenAI, Salesforce, Slack, Airtable." },
    { id: "k5", titulo: "FAQ — Preguntas frecuentes internas", categoria: "FAQ", tags: ["faq"], version: "v2.3", actualizado: "20 May 2026", resumen: "Respuestas rápidas para el equipo de SLA sobre el funcionamiento de Rinoberto." },
    { id: "k6", titulo: "Solución de errores comunes", categoria: "Troubleshooting", tags: ["errores", "soporte"], version: "v1.8", actualizado: "15 May 2026", resumen: "Procedimientos para resolver fallos de webhooks, timeouts y desincronizaciones." },
  ];
}

/* ============================== Reportes ============================== */

export function getReports() {
  return [
    { id: "r1", nombre: "Desempeño Diario", descripcion: "KPIs y volumen de conversaciones del día.", formatos: ["PDF", "Excel", "CSV"], periodicidad: "Diario" },
    { id: "r2", nombre: "Desempeño Semanal", descripcion: "Resumen comparativo de la semana.", formatos: ["PDF", "Excel"], periodicidad: "Semanal" },
    { id: "r3", nombre: "Desempeño Mensual", descripcion: "Reporte ejecutivo para dirección.", formatos: ["PDF"], periodicidad: "Mensual" },
    { id: "r4", nombre: "Reporte de Leads", descripcion: "Pipeline, scoring y conversión por fuente.", formatos: ["Excel", "CSV"], periodicidad: "Bajo demanda" },
    { id: "r5", nombre: "Reporte de Workflows", descripcion: "Ejecuciones, errores y latencia por flujo.", formatos: ["PDF", "CSV"], periodicidad: "Semanal" },
    { id: "r6", nombre: "Reporte de Conversaciones", descripcion: "Detalle completo con sentimiento y tópicos.", formatos: ["Excel", "CSV"], periodicidad: "Bajo demanda" },
  ];
}
