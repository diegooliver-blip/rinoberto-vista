# AGENTS.md - Portal Rhinoberto

## Proyecto
**Nombre**: Rinoberto Intelligence Portal  
**Cliente**: SLA Asociados  
**Tecnologia**: TanStack Start + React + Tailwind CSS v4 + shadcn/ui  
**Conexion**: Integrado con instancia n8n (workflow RRRR7)  

## Estructura
- `src/lib/n8n-api.ts` - Cliente API de n8n
- `src/lib/data.ts` - Capa de datos hibrida (n8n + local)
- `src/routes/` - Rutas basadas en archivos (file-based routing)
- `src/components/` - Componentes UI

## Variables de Entorno Requeridas
```
N8N_API_URL=https://ddd-n8n.qmp9yp.easypanel.host/api/v1
N8N_API_KEY=<tu-api-key>
```

## Deployment
- Plataforma recomendada: Vercel
- Build command: `vite build`
- Output directory: `dist`

## Notas
- Este proyecto es propiedad exclusiva de SLA Asociados
- Desarrollado de forma independiente para el control del agente Rhinoberto
