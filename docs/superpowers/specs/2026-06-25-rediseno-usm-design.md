# Spec · Rediseño visual S.I.G.T.E-WEB → sistema de diseño institucional USM

**Fecha:** 2026-06-25
**Estado:** Aprobado para planificar
**Tipo:** Migración de capa visual (solo diseño)

## Contexto

El proyecto actual `S.I.G.T.E-WEB` (Next.js 15 + Prisma/Neon + Tailwind + shadcn/ui)
usa un tema "darkmatter / VanillaSoft" (naranja/industrial, oscuro por defecto,
tipografía monoespaciada) sin identidad universitaria.

Existe un proyecto de referencia en `C:\Users\juanp\Escritorio\sigte\web` con un
**sistema de diseño institucional completo** derivado del Manual de Normas
Gráficas de la **Universidad Técnica Federico Santa María (USM)**: azul `#004B85`,
verde/rojo/amarillo de semáforo, tipografías Roboto/Roboto Condensed/Roboto Mono,
componentes con firma propia (placa de patente, KPIs, grilla de estacionamientos,
feed de accesos en vivo, sidebar navy), tema claro por defecto y modo oscuro para
tótem/guardia.

El objetivo es **copiar fielmente ese diseño** sobre el proyecto actual,
conservando todo el backend, auth, rutas y lógica de datos existentes.

## Decisiones tomadas

| Decisión | Elección |
|---|---|
| Branding | **USM tal cual** (colores, escudo punteado placeholder, lenguaje institucional) |
| Alcance | **Todo el proyecto** (~20 páginas) |
| Features | **Solo diseño** — las mejoras de features se anotan, no se implementan |
| Enfoque | **Adopción fiel** del sistema de diseño USM; Tailwind queda solo para layout |
| Portal usuario | Topbar claro (no sidebar navy) |
| shadcn/ui | Se deja en el repo hasta una limpieza final |
| Tema por defecto | **Claro** (oscuro reservado a pantallas operativas/tótem) |

## Alcance

### Dentro del alcance
- Capa visual: CSS, fuentes, componentes de presentación, layouts/shells, JSX de páginas.
- Re-skin de las ~20 páginas existentes manteniendo su fetching y lógica.

### Fuera del alcance (no tocar)
- Backend Prisma/Neon, esquema de datos.
- Auth JWT (`jose`, `bcryptjs`, cookies, `getSession()`), `/api/auth/*`.
- Rutas y estructura de roles (`/admin`, `/guard`, `/user`; enums `ADMIN/GUARD/USER`).
- APIs y lógica de negocio.
- Flujo Supabase/OTP de la referencia (se conserva el login propio).
- Nuevas features (tótem, LPR, validación manual, etc.) — solo se anotan.

## Diseño

### 1. Fundación (sistema de diseño)
- **`src/app/globals.css`**: reemplazar el tema actual. Mantener `@tailwind base/components/utilities`
  arriba; añadir tokens USM (`:root` + `.dark`) y clases de componentes
  (`.card .btn .metric .plate .lot .badge .table .field .avatar .callout .searchbox .switch`
  `.access-row .chip-role .brand .skeleton` + utilidades `.mono .muted .row .col` etc.),
  portadas desde `Escritorio\sigte\web\app\globals.css`.
- **`src/app/layout.tsx`**: cargar `Roboto`, `Roboto_Condensed`, `Roboto_Mono` vía
  `next/font/google` exponiendo `--font-roboto`, `--font-roboto-condensed`,
  `--font-roboto-mono`. `viewport.themeColor = "#004B85"`. `next-themes` con
  `defaultTheme="light"`. Conservar `TooltipProvider` y `Toaster` si se siguen usando.
- **`src/components/Icon.tsx`**: copiar el set de íconos SVG inline de referencia.
- **`src/components/ui-system.tsx`**: copiar `Plate`, `Badge`, `Brand`, `Card`,
  `Metric`, `LotGrid`, `AccessStream`, `DirTag`, `Modal`. `Brand` con escudo USM
  punteado (placeholder; el escudo oficial requiere autorización de `marca@usm.cl`).
- **`src/lib/design-data.ts`**: tipos y labels que requieren los componentes
  (`Estado = "go"|"no"|"wait"`, `Acceso`, `Lot`, `ESTADO_LABEL`), mapeados a las
  formas de datos de las APIs actuales del proyecto.

### 2. Shells de navegación
- **Admin y Guardia** → `src/components/PanelShell.tsx`: sidebar navy
  (`--usm-azul-900`), ítem activo azul con borde izquierdo amarillo, topbar con
  título/subtítulo de pantalla, búsqueda (patente/RUT/persona), avatar con
  iniciales y rol. Basado en `Escritorio\sigte\web\components\panel\Shell.tsx`.
  Cableado a los `items` de nav actuales, `getSession()` y `POST /api/auth/logout`.
  Reemplaza `src/components/Nav.tsx` en `admin/layout.tsx` y `guard/layout.tsx`.
- **Usuario (conductor)** → `src/components/PortalShell.tsx`: topbar claro con
  `Brand` + tabs (Inicio, Vehículos, Mi QR, Alertas, Infracciones) + avatar.
  Contenido centrado con ancho máximo. Reemplaza `Nav.tsx` en `user/layout.tsx`.

### 3. Páginas públicas
- **`/` (landing)** — `src/app/page.tsx` + `src/app/home.module.css`: hero azul,
  secciones Módulos / Funcionalidades / Roles / footer institucional. Módulos
  adaptados a las 3 entradas reales: Panel web (admin/guardia), Portal del
  conductor (usuario), Acceso institucional (login). El tótem se omite como módulo
  (anotado como mejora futura), no se deja card rota.
- **`/login`** — layout split (formulario izquierda + panel azul con grano a la
  derecha). **Conservar la lógica actual** (`POST /api/auth/login`, credenciales
  demo, redirección por rol). No portar Supabase/OTP.
- **`/register`** — card USM con `.field/.input`, conservando la lógica de registro.

### 4. Mapeo de páginas (re-skin, conservando datos/lógica)

| Ruta | Componentes USM |
|---|---|
| `/admin` | `Metric` (KPIs) + `AccessStream` + `LotGrid` + gráficos + `callout` |
| `/admin/users` | `.table` + `avatar` + `chip-role` + `Modal` |
| `/admin/vehicles` | `.table` + `Plate` + `Modal` |
| `/admin/parking` | `LotGrid` + `.card` |
| `/admin/access` | `AccessStream` / `.table` + `DirTag` |
| `/admin/infractions` | `.table` + `Badge` + `Modal` + `callout` |
| `/guard` | KPIs + accesos en vivo + validación (estética pórtico) |
| `/guard/history` | `.table` + `Plate` |
| `/guard/infractions` | `.table` + `Modal` |
| `/guard/occupancy` | `LotGrid` |
| `/guard/search` | `.searchbox` + `.table` + `Plate` |
| `/user` | saludo + `Metric` grid + cards de acción |
| `/user/qr` | card QR + `Plate` + expiración |
| `/user/vehicles` | cards con `Plate` |
| `/user/infractions` | lista + `Badge` + `callout` |
| `/user/notifications` | lista de avisos |

### 5. Gráficos
Portar `Graficos.tsx` (recharts, paleta USM hex) adaptado a `/api/dashboard`.
Reemplaza el uso de `src/components/ui/chart.tsx`.

## Mejoras de features detectadas (NO implementar; registrar para decisión futura)
- Tótem de acceso (kiosk, modo oscuro, estados Autorizado/Acércate/Detente).
- Validación manual (escaneo QR/cédula) en pórtico.
- Formato y validación de **RUT** (`lib/rut.ts` de referencia).
- Ocupación por presencia exacta.
- Exportación CSV de bitácora/auditoría.
- Personas de confianza (conductor autoriza terceros).
- Solicitudes de inscripción de vehículo con documentos adjuntos.
- Campana de pendientes con conteo en topbar (admin).
- Etiqueta de dirección entrada/salida (`DirTag`) en filas de acceso.

## Componentes / unidades y sus límites
- **globals.css** — tokens + clases; sin dependencias; consumido por todo.
- **Icon.tsx** — íconos SVG; sin dependencias.
- **ui-system.tsx** — presentación pura; depende de Icon + design-data.
- **design-data.ts** — tipos/labels; sin dependencias; adapta datos de APIs.
- **PanelShell / PortalShell** — layout + sesión; dependen de ui-system + Icon + auth.
- **Páginas** — dependen de shells, ui-system y de sus APIs actuales (sin cambios).

## Verificación
1. `next build` sin errores de tipos ni de compilación.
2. `next dev` y comparación visual de pantallas clave (landing, login, dashboards
   admin/guard, portal usuario) contra los screenshots de referencia en
   `Escritorio\sigte\screenshots\`. Captura con Playwright si aplica.
3. Navegación por rol funciona (gating de sesión intacto).

## Orden de implementación
1. Fundación (globals.css, fuentes, Icon, ui-system, design-data).
2. Shells (PanelShell, PortalShell) + layouts.
3. Públicas (landing, login, register).
4. Admin (6 páginas).
5. Guard (5 páginas).
6. User (5 páginas).
7. Gráficos USM.
8. Limpieza de shadcn/ui sin uso.
9. Verificación (build + visual).

## Riesgos / consideraciones
- Coexistencia Tailwind preflight + reset USM: redundante pero inofensiva;
  validar que no rompa layouts.
- Cambio de tema oscuro→claro por defecto: aprobado explícitamente.
- Las formas de datos de las APIs actuales difieren de las de referencia; los
  componentes de presentación se adaptan vía `design-data.ts`, no al revés.
