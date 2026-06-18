import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { insertConversation, upsertLead, type ConversationRecord, type LeadRecord } from "@/lib/db";

export const APIRoute = createAPIFileRoute("/api/webhook/n8n")({
  POST: async ({ request }) => {
    try {
      const body = await request.json();

      // Validar token de seguridad (opcional, configurable)
      const authHeader = request.headers.get("x-webhook-auth");
      const expectedToken = process.env.WEBHOOK_SECRET || "sla-rhinoberto-2026";
      if (authHeader !== expectedToken) {
        return json({ error: "Unauthorized" }, { status: 401 });
      }

      const eventType = body.eventType || body.type || "message";

      // ============================================================
      // EVENTO: Mensaje de conversacion
      // ============================================================
      if (eventType === "conversation" || eventType === "message") {
        const record: ConversationRecord = {
          id: body.id || `conv_${Date.now()}`,
          telefono: body.telefono || body.phone || body.sender || "unknown",
          contacto: body.contacto || body.name || body.pushName || "Cliente",
          mensaje: body.mensaje || body.message || body.text || "",
          respuesta: body.respuesta || body.response || undefined,
          intencion: body.intencion || body.intention || "general",
          urgencia: body.urgencia || body.urgency || "normal",
          timestamp: body.timestamp || new Date().toISOString(),
          canal: body.canal || body.channel || "WhatsApp",
          estado: body.estado || body.status || "Nuevo Lead",
          sentimiento: body.sentimiento || body.sentiment || "neutral",
          workflowId: body.workflowId || undefined,
          executionId: body.executionId || undefined,
        };
        insertConversation(record);
        return json({ ok: true, event: "conversation", id: record.id });
      }

      // ============================================================
      // EVENTO: Lead generado
      // ============================================================
      if (eventType === "lead") {
        const lead: LeadRecord = {
          id: body.id || `lead_${Date.now()}`,
          nombre: body.nombre || body.name || "Lead",
          telefono: body.telefono || body.phone || "unknown",
          email: body.email || undefined,
          empresa: body.empresa || body.company || undefined,
          estado: body.estado || body.status || "Nuevo Lead",
          score: body.score || 50,
          fuente: body.fuente || body.source || "WhatsApp",
          region: body.region || body.location || "México",
          ultimaActividad: body.ultimaActividad || new Date().toISOString(),
          valor: body.valor || body.value || undefined,
          probabilidad: body.probabilidad || body.probability || undefined,
          notas: body.notas || body.notes || undefined,
        };
        upsertLead(lead);
        return json({ ok: true, event: "lead", id: lead.id });
      }

      // ============================================================
      // EVENTO: Analytics / Metricas
      // ============================================================
      if (eventType === "analytics") {
        // Guardar punto de analytics
        return json({ ok: true, event: "analytics" });
      }

      return json({ ok: true, event: eventType, received: true });
    } catch (err) {
      console.error("Error en webhook n8n:", err);
      return json({ error: "Invalid payload" }, { status: 400 });
    }
  },
});
