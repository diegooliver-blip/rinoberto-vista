// ============================================================
// DB LOCAL - Almacenamiento persistente para el portal
// Usa JSON file como base de datos ligera
// ============================================================

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DB_DIR = join(process.cwd(), ".data");
const DB_FILE = join(DB_DIR, "portal-db.json");

interface DbSchema {
  conversations: ConversationRecord[];
  leads: LeadRecord[];
  analytics: AnalyticsPoint[];
  lastSync: string;
  version: number;
}

export interface ConversationRecord {
  id: string;
  telefono: string;
  contacto: string;
  mensaje: string;
  respuesta?: string;
  intencion: string;
  urgencia: string;
  timestamp: string;
  canal: "WhatsApp" | "Instagram" | "Webchat";
  estado: string;
  sentimiento: "positivo" | "neutral" | "negativo";
  workflowId?: string;
  executionId?: string;
}

export interface LeadRecord {
  id: string;
  nombre: string;
  telefono: string;
  email?: string;
  empresa?: string;
  estado: string;
  score: number;
  fuente: string;
  region: string;
  ultimaActividad: string;
  valor?: number;
  probabilidad?: number;
  notas?: string;
}

export interface AnalyticsPoint {
  fecha: string;
  conversaciones: number;
  leads: number;
  citas: number;
  respuestasBot: number;
  escalaciones: number;
}

function ensureDb(): DbSchema {
  try {
    if (!existsSync(DB_DIR)) mkdirSync(DB_DIR, { recursive: true });
    if (!existsSync(DB_FILE)) {
      const empty: DbSchema = {
        conversations: [],
        leads: [],
        analytics: [],
        lastSync: new Date().toISOString(),
        version: 1,
      };
      writeFileSync(DB_FILE, JSON.stringify(empty, null, 2), "utf-8");
      return empty;
    }
    return JSON.parse(readFileSync(DB_FILE, "utf-8")) as DbSchema;
  } catch {
    return { conversations: [], leads: [], analytics: [], lastSync: new Date().toISOString(), version: 1 };
  }
}

function saveDb(db: DbSchema) {
  try {
    if (!existsSync(DB_DIR)) mkdirSync(DB_DIR, { recursive: true });
    writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Error guardando DB:", err);
  }
}

// ============================================================
// CONVERSACIONES
// ============================================================

export function insertConversation(record: ConversationRecord) {
  const db = ensureDb();
  // Evitar duplicados por executionId
  if (record.executionId) {
    const exists = db.conversations.some((c) => c.executionId === record.executionId);
    if (exists) return;
  }
  db.conversations.unshift(record);
  // Mantener maximo 5000 registros
  if (db.conversations.length > 5000) db.conversations = db.conversations.slice(0, 5000);
  db.lastSync = new Date().toISOString();
  saveDb(db);
}

export function getConversationsDb(limit = 100, offset = 0): ConversationRecord[] {
  const db = ensureDb();
  return db.conversations.slice(offset, offset + limit);
}

export function getConversationsByPhone(telefono: string): ConversationRecord[] {
  const db = ensureDb();
  return db.conversations.filter((c) => c.telefono === telefono);
}

export function getConversationStats() {
  const db = ensureDb();
  const today = new Date().toISOString().split("T")[0];
  const todayConvos = db.conversations.filter((c) => c.timestamp.startsWith(today));
  return {
    total: db.conversations.length,
    hoy: todayConvos.length,
    porCanal: {
      WhatsApp: db.conversations.filter((c) => c.canal === "WhatsApp").length,
      Instagram: db.conversations.filter((c) => c.canal === "Instagram").length,
      Webchat: db.conversations.filter((c) => c.canal === "Webchat").length,
    },
    porUrgencia: {
      critical: db.conversations.filter((c) => c.urgencia === "critical").length,
      high: db.conversations.filter((c) => c.urgencia === "high").length,
      normal: db.conversations.filter((c) => c.urgencia === "normal").length,
    },
  };
}

// ============================================================
// LEADS
// ============================================================

export function upsertLead(lead: LeadRecord) {
  const db = ensureDb();
  const idx = db.leads.findIndex((l) => l.telefono === lead.telefono);
  if (idx >= 0) {
    db.leads[idx] = { ...db.leads[idx], ...lead, id: db.leads[idx].id };
  } else {
    db.leads.unshift(lead);
  }
  if (db.leads.length > 2000) db.leads = db.leads.slice(0, 2000);
  db.lastSync = new Date().toISOString();
  saveDb(db);
}

export function getLeadsDb(limit = 100): LeadRecord[] {
  const db = ensureDb();
  return db.leads.slice(0, limit);
}

// ============================================================
// ANALYTICS
// ============================================================

export function recordAnalytics(point: AnalyticsPoint) {
  const db = ensureDb();
  const idx = db.analytics.findIndex((a) => a.fecha === point.fecha);
  if (idx >= 0) {
    db.analytics[idx] = point;
  } else {
    db.analytics.push(point);
  }
  saveDb(db);
}

export function getAnalyticsDb(days = 7): AnalyticsPoint[] {
  const db = ensureDb();
  return db.analytics.slice(-days);
}

// ============================================================
// RESET (para testing)
// ============================================================

export function resetDb() {
  const empty: DbSchema = {
    conversations: [],
    leads: [],
    analytics: [],
    lastSync: new Date().toISOString(),
    version: 1,
  };
  saveDb(empty);
}
