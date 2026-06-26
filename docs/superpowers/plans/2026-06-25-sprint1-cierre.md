# Cierre de Sprint 1 (MVP de gestión) — Plan

**Objetivo:** completar el Sprint 1 a un MVP honesto y demostrable de punta a punta. Sin hardware (LPR/barrera/RFID), móvil nativo ni SSO — eso es roadmap.

**Rama:** `rediseno-usm` (pnpm). No tocar cambios pre-existentes ajenos salvo los indicados.

## Tareas (Definition of Done)

### 1. Coherencia
- `src/app/login/page.tsx`: cambiar credenciales demo de `@sigte.cl` a `@usm.cl` (admin@usm.cl/guardia@usm.cl/user@usm.cl). **Actualizar también `prisma/seed.ts`** para que esos correos existan (o mantener ambos). Mantener contraseñas.
- `src/app/api/access/lookup/route.ts`: "Indicá plate, qr o uid" → "Indica…" (quitar voseo).

### 2. QR firmado + expiración (caso de uso: validar QR de verdad)
- Crear helper `src/lib/qr.ts` con `signQrToken(vehicleId, issuedAt)` y `verifyQrToken(token)` usando HMAC-SHA256 con `process.env.QR_SECRET ?? process.env.JWT_SECRET ?? "dev-secret"`. Formato `sigte:v1:<vehicleId>:<issuedAt>:<sig>`.
- `src/app/api/qr/route.ts`: usar `signQrToken`.
- `src/app/api/access/lookup/route.ts`: al recibir `qr`, usar `verifyQrToken` — rechazar si firma inválida o si `issuedAt` venció (>5 min) devolviendo `{ vehicle: null, qrError: "expirado"|"invalido" }`.
- `src/app/guard/page.tsx`: mostrar el `qrError` si viene.

### 3. Reglas de acceso (autoriza/deniega + capacidad)
- `src/app/api/access/route.ts` (POST): al registrar IN, si `!vehicle.authorized` → registrar `authorized:false` + `note` y devolver advertencia (no bloquear duro, pero marcar). Si el bloque destino está lleno (occupied>=capacity) → impedir o avisar. Mantener la notificación existente. Confirmar que la salida (OUT) libera `currentBlockId`.

### 4. Trazabilidad de resolución de infracción
- `prisma/schema.prisma`: agregar a `Infraction`: `resolvedById String?`, `resolvedAt DateTime?`, `resolution String?`, `evidenceUrl String?`. Relación opcional a User (resolvedBy). Ejecutar `pnpm prisma generate` (no migrate en local si usa db push; usar `pnpm db:push`).
- `src/app/api/infractions/[id]/route.ts`: al cambiar a RESOLVED/DISMISSED, guardar `resolvedById=session.sub`, `resolvedAt=now`, `resolution` (motivo opcional del body).

### 5. Reconocer infracción (conductor)
- `src/app/api/infractions/[id]/route.ts`: permitir que un USER dueño de la infracción haga PATCH `status: "ACKNOWLEDGED"` (solo esa transición; validar `userId === session.sub`).
- `src/app/user/infractions/page.tsx`: botón "Reconocer" en infracciones `OPEN` que llama al PATCH y refresca.

### 6. Mi historial de accesos (conductor)
- Nueva ruta `src/app/user/access/page.tsx` (+ tab en `PortalShell`/user layout "Mis accesos", icon "history") que hace `GET /api/access` (debe devolver al USER solo los de sus vehículos — confirmar/filtrar en `src/app/api/access/route.ts` GET por `vehicle.ownerId` si rol USER) y los lista con `AccessStream`/`.table` + `Plate` + `DirTag`.

### 7. Exportar bitácora (admin)
- `src/app/api/access/route.ts` (o nueva `export/route.ts`): soportar `?format=csv` devolviendo CSV con headers. 
- `src/app/admin/access/page.tsx`: botón "Exportar CSV" (`.btn ghost` con icon "download") que descarga.

### 8. Seed de demo "vivo"
- `prisma/seed.ts`: agregar accesos recientes (varios IN/OUT de **hoy** y últimos 7 días) e infracciones, para que el dashboard muestre métricas y gráficos no vacíos. Ejecutar `pnpm seed`.

## Verificación
- `pnpm exec tsc --noEmit` limpio.
- `pnpm build` verde (parar dev antes; no borrar `.next` con dev corriendo).
- Commits lógicos por tarea con prefijo `feat(sprint1)`/`fix(sprint1)`.

## Fuera de alcance (roadmap, NO implementar)
LPR/OCR, barrera física, RFID, app móvil nativa, SSO Azure AD, websockets, subida real de archivos de evidencia.
