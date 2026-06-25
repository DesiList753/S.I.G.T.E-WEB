# Rediseño visual USM — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar la capa visual de `S.I.G.T.E-WEB` por el sistema de diseño institucional USM del proyecto de referencia, conservando backend, auth, rutas y lógica de datos.

**Architecture:** Se porta el design system de `C:\Users\juanp\Escritorio\sigte\web` (CSS de tokens + clases, íconos SVG inline, componentes de presentación, shells de navegación) a `src/`. Cada página existente se reescribe usando esos componentes pero conservando su fetching actual. Tailwind queda solo para utilidades de layout.

**Tech Stack:** Next.js 15, React 19, Tailwind 3 (solo layout), recharts, next-themes, Prisma/Neon (sin cambios), `next/font/google` (Roboto family).

**Verificación (en vez de TDD unitario):** este es trabajo de UI; cada tarea se valida con `pnpm build` (o `npm run build`) sin errores y revisión visual contra `C:\Users\juanp\Escritorio\sigte\screenshots\`. No se escriben tests unitarios para estilos.

**Rama:** `rediseno-usm` (ya creada). El gestor de paquetes del repo es **pnpm** (hay `pnpm-lock.yaml`); usar `pnpm` para comandos.

**Rutas de referencia (origen, solo lectura):**
- `REF = C:\Users\juanp\Escritorio\sigte\web`
- Destino `DST = C:\Users\juanp\Documentos\GitHub\S.I.G.T.E-WEB`

---

## File Structure

**Crear:**
- `src/components/Icon.tsx` — set de íconos SVG inline (copia de `REF/components/Icon.tsx`).
- `src/components/ui-system.tsx` — `Plate, Badge, Brand, Card, Metric, LotGrid, AccessStream, DirTag, Modal` (adaptado de `REF/components/ui.tsx`).
- `src/lib/design-data.ts` — tipos `Estado, Acceso, Lot` + `ESTADO_LABEL` + helper `lotLevel()`.
- `src/components/PanelShell.tsx` — sidebar navy + topbar para admin/guardia (adaptado de `REF/components/panel/Shell.tsx`).
- `src/components/PortalShell.tsx` — topbar claro para usuario/conductor.
- `src/components/ChartsUSM.tsx` — gráficos recharts con paleta USM (adaptado de `REF/components/panel/Graficos.tsx`).
- `src/app/home.module.css` — estilos de la landing (copia de `REF/app/home.module.css`).

**Modificar:**
- `src/app/globals.css` — tema USM.
- `src/app/layout.tsx` — fuentes Roboto + tema claro + themeColor.
- `src/app/page.tsx` (landing), `src/app/login/page.tsx`, `src/app/register/page.tsx`.
- `src/app/admin/layout.tsx`, `src/app/guard/layout.tsx`, `src/app/user/layout.tsx`.
- Las 16 páginas de `admin/`, `guard/`, `user/`.

**Eliminar (fase final):** `src/components/Nav.tsx` y componentes `src/components/ui/*` sin uso.

---

## FASE 1 — Fundación

### Task 1: Tipos y datos de presentación (`design-data.ts`)

**Files:**
- Create: `src/lib/design-data.ts`

- [ ] **Step 1: Crear el archivo con tipos y labels**

```ts
// src/lib/design-data.ts
// Tipos y etiquetas que consumen los componentes de presentación USM.
// Mapean las formas de datos de las APIs actuales a lo que la UI necesita.

export type Estado = "go" | "no" | "wait" | "neutral";

export const ESTADO_LABEL: Record<Estado | "info", string> = {
  go: "Autorizado",
  no: "Denegado",
  wait: "Pendiente",
  neutral: "—",
  info: "Info",
};

export interface Acceso {
  t: string;            // hora "09:41:07"
  patente: string;      // "JKLM·52"
  titular: string;      // nombre del dueño
  rol: string;          // "Estudiante" | "Funcionario" | ...
  estado: Estado;       // semáforo
  acceso: string;       // "Norte" | "Sur"
  via: string;          // "LPR" | "QR" | "Manual"
  direccion?: "in" | "out";
}

export interface Lot {
  id: string;
  nombre: string;
  ocup: number;
  cap: number;
  pct: number;
  estado: string;       // "Disponible" | "Casi lleno" | "Crítico" | "Lleno"
  level: "low" | "mid" | "high" | "full";
}

/** Deriva nivel/estado de un lote a partir de ocupación. */
export function lotLevel(ocup: number, cap: number): Pick<Lot, "pct" | "estado" | "level"> {
  const pct = cap ? Math.round((ocup / cap) * 100) : 0;
  if (ocup >= cap) return { pct: 100, estado: "Lleno", level: "full" };
  if (pct > 85) return { pct, estado: "Crítico", level: "high" };
  if (pct > 50) return { pct, estado: "Casi lleno", level: "mid" };
  return { pct, estado: "Disponible", level: "low" };
}
```

- [ ] **Step 2: Verificar tipos**

Run: `cd "C:/Users/juanp/Documentos/GitHub/S.I.G.T.E-WEB" && pnpm exec tsc --noEmit`
Expected: sin errores nuevos en `design-data.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/design-data.ts
git commit -m "feat(design): tipos y labels de presentación USM"
```

---

### Task 2: Íconos (`Icon.tsx`)

**Files:**
- Create: `src/components/Icon.tsx`

- [ ] **Step 1: Copiar el archivo de referencia verbatim**

Copiar el contenido completo de `REF/components/Icon.tsx` a `src/components/Icon.tsx` sin cambios (no tiene dependencias externas). Exporta `I`, `iconSvg`, `IconName`.

- [ ] **Step 2: Verificar build de tipos**

Run: `pnpm exec tsc --noEmit`
Expected: sin errores en `Icon.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/Icon.tsx
git commit -m "feat(design): set de íconos SVG inline USM"
```

---

### Task 3: Componentes de presentación (`ui-system.tsx`)

**Files:**
- Create: `src/components/ui-system.tsx`

- [ ] **Step 1: Copiar `REF/components/ui.tsx` y ajustar imports**

Copiar el contenido de `REF/components/ui.tsx` a `src/components/ui-system.tsx`, cambiando solo las líneas de import:
- `import { I } from "./Icon";` → se mantiene (`./Icon`).
- `import { ESTADO_LABEL, type Acceso, type Estado, type Lot } from "@/lib/data";`
  → `import { ESTADO_LABEL, type Acceso, type Estado, type Lot } from "@/lib/design-data";`

Mantener tal cual: `Plate, Badge, Brand, Card, Metric, LotGrid, DirTag, AccessStream, Modal`.

- [ ] **Step 2: Verificar tipos**

Run: `pnpm exec tsc --noEmit`
Expected: sin errores en `ui-system.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui-system.tsx
git commit -m "feat(design): componentes de presentación USM (Card, Metric, Plate, Badge, LotGrid, AccessStream, Modal)"
```

---

### Task 4: Tema global (`globals.css`)

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Reescribir globals.css**

Reemplazar el contenido completo de `src/app/globals.css` por:
1. Las 3 directivas de Tailwind al inicio (conservar):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
2. A continuación, **todo** el contenido de `REF/app/globals.css` (desde el bloque `:root{ ... }` con la paleta USM hasta el final), pegado verbatim.

Resultado: Tailwind preflight + tokens USM + clases de componentes. La regla `*{box-sizing:border-box;margin:0;padding:0}` del reset USM convive con preflight (redundante, inofensivo).

- [ ] **Step 2: Verificar que compila**

Run: `pnpm build`
Expected: build OK (puede haber errores en páginas aún no migradas que usan clases viejas; si el build falla solo por CSS, corregir; si falla por TSX de páginas, es esperado hasta migrarlas — anotar y continuar).

> Nota: si `pnpm build` falla por páginas no migradas, usar `pnpm dev` y verificar que la landing/login renderizan tokens nuevos. El build completo se valida al final de cada fase.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(design): tema institucional USM en globals.css"
```

---

### Task 5: Layout raíz (fuentes Roboto + tema claro)

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Reescribir layout.tsx**

```tsx
import type { Metadata, Viewport } from "next";
import { Roboto, Roboto_Condensed, Roboto_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const roboto = Roboto({ weight: ["400", "500", "700", "900"], subsets: ["latin"], variable: "--font-roboto" });
const robotoCondensed = Roboto_Condensed({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--font-roboto-condensed" });
const robotoMono = Roboto_Mono({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--font-roboto-mono" });

export const metadata: Metadata = {
  title: "S.I.G.T.E · UTFSM",
  description:
    "Sistema Inteligente de Gestión de Tránsito y Estacionamiento · Universidad Técnica Federico Santa María",
};

export const viewport: Viewport = {
  themeColor: "#004B85",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${roboto.variable} ${robotoCondensed.variable} ${robotoMono.variable}`}
    >
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verificar en dev**

Run: `pnpm dev` y abrir `http://localhost:3000`
Expected: tipografía Roboto, fondo claro.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(design): fuentes Roboto + tema claro por defecto"
```

---

## FASE 2 — Shells de navegación

### Task 6: PanelShell (admin/guardia)

**Files:**
- Create: `src/components/PanelShell.tsx`

- [ ] **Step 1: Adaptar `REF/components/panel/Shell.tsx`**

Copiar la estructura visual de `REF/components/panel/Shell.tsx` (`Sidebar`, `TopBar`, contenedor) a `src/components/PanelShell.tsx`, con estas adaptaciones (NO copiar la lógica Supabase ni `/api/perfil` ni `usePendientes`):

- Imports: `import { I } from "@/components/Icon";` y `import { Brand } from "@/components/ui-system";`.
- Eliminar imports y usos de `@/lib/supabase-browser`.
- Recibir nav y sesión por props (las inyecta cada layout):

```tsx
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { I } from "@/components/Icon";
import { Brand } from "@/components/ui-system";

export interface PanelNavItem { href: string; label: string; icon: string; }
export interface PanelNavGroup { grp: string; items: PanelNavItem[]; }

function Sidebar({ groups }: { groups: PanelNavGroup[] }) {
  const pathname = usePathname();
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  }
  return (
    <aside style={{ width: 244, background: "var(--usm-azul-900)", color: "#fff", display: "flex", flexDirection: "column", flex: "none" }}>
      <Link href="/" style={{ padding: "18px 18px 16px", borderBottom: "1px solid rgba(255,255,255,.1)", color: "inherit" }}>
        <Brand light />
      </Link>
      <nav style={{ flex: 1, overflowY: "auto", padding: "14px 12px" }}>
        {groups.map((g) => (
          <div key={g.grp} style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: "var(--ff-display)", fontSize: 10.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.45)", padding: "0 10px 7px" }}>{g.grp}</div>
            {g.items.map((it) => {
              const on = pathname === it.href || pathname.startsWith(it.href + "/");
              return (
                <Link key={it.href} href={it.href} style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 10px", marginBottom: 2, borderRadius: 8, background: on ? "var(--usm-azul)" : "transparent", color: on ? "#fff" : "rgba(255,255,255,.78)", fontFamily: "var(--ff-body)", fontSize: 13.5, fontWeight: on ? 600 : 400, boxShadow: on ? "inset 3px 0 0 var(--usm-amarillo)" : "none" }}>
                  <I name={it.icon} size={18} stroke={1.9} />
                  <span style={{ flex: 1 }}>{it.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 22px", border: "none", borderTop: "1px solid rgba(255,255,255,.1)", background: "transparent", color: "rgba(255,255,255,.7)", cursor: "pointer", fontFamily: "var(--ff-body)", fontSize: 13 }}>
        <I name="logout" size={17} /> Cerrar sesión
      </button>
    </aside>
  );
}

function TopBar({ title, subtitle, userName, userRole }: { title: string; subtitle: string; userName: string; userRole: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const ini = userName.split(/[\s.]/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <header style={{ height: 62, flex: "none", background: "var(--surface)", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 16, padding: "0 24px" }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "var(--ff-display)", fontWeight: 700, fontSize: 19, lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 1 }}>{subtitle}</div>
      </div>
      <div style={{ flex: 1 }} />
      <div className="searchbox" style={{ width: 250 }}>
        <I name="search" size={17} />
        <input className="input" placeholder="Buscar patente, RUT o persona…" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && q.trim()) router.push(`/admin/vehicles?q=${encodeURIComponent(q.trim())}`); }} aria-label="Buscar" />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 9, paddingLeft: 6, borderLeft: "1px solid var(--line)" }}>
        <span className="avatar">{ini || "…"}</span>
        <div style={{ lineHeight: 1.15 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{userName}</div>
          <div style={{ fontSize: 11, color: "var(--ink-400)" }}>{userRole}</div>
        </div>
      </div>
    </header>
  );
}

export function PanelShell({ groups, title, subtitle, userName, userRole, children }: {
  groups: PanelNavGroup[]; title: string; subtitle: string; userName: string; userRole: string; children: ReactNode;
}) {
  return (
    <div style={{ height: "100vh", display: "flex" }}>
      <Sidebar groups={groups} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopBar title={title} subtitle={subtitle} userName={userName} userRole={userRole} />
        <div style={{ flex: 1, overflowY: "auto", background: "var(--bg)" }}>{children}</div>
      </div>
    </div>
  );
}
```

> El título/subtítulo de cada pantalla se pasa por props desde un componente cliente que lea `usePathname` o, de forma simple, fijo por layout. Para mantenerlo simple, cada layout pasa el título de la sección y un subtítulo genérico; el detalle por pantalla puede refinarse después.

- [ ] **Step 2: Verificar tipos**

Run: `pnpm exec tsc --noEmit`
Expected: sin errores en `PanelShell.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/PanelShell.tsx
git commit -m "feat(design): PanelShell (sidebar navy + topbar) para admin/guardia"
```

---

### Task 7: PortalShell (usuario/conductor)

**Files:**
- Create: `src/components/PortalShell.tsx`

- [ ] **Step 1: Crear PortalShell con topbar claro**

```tsx
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode } from "react";
import { I } from "@/components/Icon";
import { Brand } from "@/components/ui-system";

export interface PortalTab { href: string; label: string; icon: string; }

export function PortalShell({ tabs, userName, children }: { tabs: PortalTab[]; userName: string; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const ini = userName.split(/[\s.]/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  }
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <header style={{ background: "var(--surface)", borderBottom: "1px solid var(--line)", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 var(--sp-5)", height: 60, display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/user" style={{ color: "var(--usm-azul)" }}><Brand /></Link>
          <div style={{ flex: 1 }} />
          <span className="avatar">{ini || "…"}</span>
          <button className="btn ghost icon" onClick={logout} title="Cerrar sesión"><I name="logout" size={18} /></button>
        </div>
        <nav style={{ maxWidth: 920, margin: "0 auto", padding: "0 var(--sp-5)", display: "flex", gap: 4, overflowX: "auto" }}>
          {tabs.map((t) => {
            const on = pathname === t.href || pathname.startsWith(t.href + "/");
            return (
              <Link key={t.href} href={t.href} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 12px", fontSize: 13.5, fontWeight: on ? 600 : 500, color: on ? "var(--usm-azul)" : "var(--ink-500)", borderBottom: on ? "2px solid var(--usm-azul)" : "2px solid transparent" }}>
                <I name={t.icon} size={17} /> {t.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main style={{ maxWidth: 920, margin: "0 auto", padding: "var(--sp-5)" }}>{children}</main>
    </div>
  );
}
```

- [ ] **Step 2: Verificar tipos**

Run: `pnpm exec tsc --noEmit`
Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/components/PortalShell.tsx
git commit -m "feat(design): PortalShell (topbar claro) para usuario/conductor"
```

---

### Task 8: Cablear los 3 layouts a los nuevos shells

**Files:**
- Modify: `src/app/admin/layout.tsx`, `src/app/guard/layout.tsx`, `src/app/user/layout.tsx`

- [ ] **Step 1: admin/layout.tsx**

```tsx
import { PanelShell, type PanelNavGroup } from "@/components/PanelShell";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const groups: PanelNavGroup[] = [
  { grp: "Administración", items: [
    { href: "/admin", label: "Dashboard", icon: "dashboard" },
    { href: "/admin/users", label: "Usuarios", icon: "users" },
    { href: "/admin/vehicles", label: "Vehículos", icon: "car" },
    { href: "/admin/parking", label: "Bloques", icon: "parking" },
    { href: "/admin/access", label: "Accesos", icon: "history" },
    { href: "/admin/infractions", label: "Infracciones", icon: "shieldAlert" },
  ] },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/");
  return (
    <PanelShell groups={groups} title="Administración" subtitle="Vista de mando" userName={session.name} userRole="Administración">
      {children}
    </PanelShell>
  );
}
```

- [ ] **Step 2: guard/layout.tsx**

Leer `src/app/guard/layout.tsx` actual para tomar sus `items` reales (history, infractions, occupancy, search, dashboard). Replicar el patrón de admin con:

```tsx
const groups: PanelNavGroup[] = [
  { grp: "Operación", items: [
    { href: "/guard", label: "Pórtico", icon: "barrier" },
    { href: "/guard/search", label: "Buscar", icon: "search" },
    { href: "/guard/infractions", label: "Infracciones", icon: "file" },
    { href: "/guard/occupancy", label: "Ocupación", icon: "parking" },
    { href: "/guard/history", label: "Historial", icon: "history" },
  ] },
];
```
Gating: `if (session.role !== "GUARD" && session.role !== "ADMIN") redirect("/");`. `title="Guardia"`, `userRole="Guardia"`.

- [ ] **Step 3: user/layout.tsx**

```tsx
import { PortalShell, type PortalTab } from "@/components/PortalShell";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const tabs: PortalTab[] = [
  { href: "/user", label: "Inicio", icon: "home" },
  { href: "/user/vehicles", label: "Vehículos", icon: "car" },
  { href: "/user/qr", label: "Mi QR", icon: "qr" },
  { href: "/user/notifications", label: "Alertas", icon: "bell" },
  { href: "/user/infractions", label: "Infracciones", icon: "file" },
];

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  return (
    <PortalShell tabs={tabs} userName={session.name}>{children}</PortalShell>
  );
}
```

> Verificar primero los `href`/rutas reales en cada layout actual antes de fijar los items. Conservar cualquier `<Toaster/>` que el layout actual incluya, colocándolo dentro del shell.

- [ ] **Step 4: Verificar en dev**

Run: `pnpm dev`, iniciar sesión como admin/guard/user (credenciales demo) y comprobar que los 3 shells renderizan y navegan.
Expected: sidebar navy en admin/guard; topbar claro en user.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/layout.tsx src/app/guard/layout.tsx src/app/user/layout.tsx
git commit -m "feat(design): cablear layouts admin/guard/user a los shells USM"
```

---

## FASE 3 — Páginas públicas

### Task 9: Landing (`/`)

**Files:**
- Create: `src/app/home.module.css`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Copiar el CSS module**

Copiar `REF/app/home.module.css` a `src/app/home.module.css` verbatim.

- [ ] **Step 2: Reescribir page.tsx**

Adaptar `REF/app/page.tsx` a `src/app/page.tsx`:
- Conservar el chequeo de sesión del actual `page.tsx` (redirige admin/guard/user si hay sesión).
- Usar `import s from "./home.module.css"`, `import { I } from "@/components/Icon"`.
- **3 módulos** (no 4, sin tótem): "Panel web" → `/login`; "Portal del conductor" → `/login`; "Acceso institucional" → `/login`. Reusar los thumbnails `thWeb`/`thMob` de referencia para los dos primeros; para el tercero usar `thWeb` con el mini de login.
- Secciones "Qué hace el sistema" y "Cada rol ve lo suyo": copiar verbatim (texto institucional USM).
- Footer institucional USM verbatim.

- [ ] **Step 3: Verificar visual**

Run: `pnpm dev`, abrir `/` sin sesión. Comparar con `screenshots/home-nueva.png`.
Expected: hero azul, módulos, secciones, footer.

- [ ] **Step 4: Commit**

```bash
git add src/app/home.module.css src/app/page.tsx
git commit -m "feat(design): landing USM (hero azul + módulos + funcionalidades)"
```

---

### Task 10: Login (`/login`)

**Files:**
- Modify: `src/app/login/page.tsx`

- [ ] **Step 1: Reescribir login con layout split USM, conservando lógica actual**

Tomar el `LoginPage` (layout split) de `REF/app/login/page.tsx` (los dos paneles: formulario izq + panel azul der con grano y "Cada patente, cada acceso, en un solo lugar"), pero **el formulario usa la lógica actual** de `src/app/login/page.tsx`:
- `POST /api/auth/login` con `{ email, password }`.
- Redirección por rol (`ADMIN→/admin`, `GUARD→/guard`, else `/user`) y soporte de `?next=`.
- Botones de credenciales demo (admin/guardia/usuario) que rellenan el form.
- Campos con clases `.field`, `.input`; botón `.btn primary lg block`; errores con `.field-err` + `<I name="alert"/>`; `Brand` arriba.

- [ ] **Step 2: Verificar**

Run: `pnpm dev`, abrir `/login`. Comparar con `screenshots/movil-login2.png` (paleta) y verificar login real con credenciales demo.
Expected: panel split azul; login funciona y redirige por rol.

- [ ] **Step 3: Commit**

```bash
git add src/app/login/page.tsx
git commit -m "feat(design): login USM (split azul) conservando auth actual"
```

---

### Task 11: Registro (`/register`)

**Files:**
- Modify: `src/app/register/page.tsx`

- [ ] **Step 1: Reescribir register en card USM**

Leer `src/app/register/page.tsx` actual para conservar su lógica (campos y `POST` al endpoint de registro). Reemplazar el markup shadcn por: contenedor centrado (`min-height:100vh; display:grid; place-items:center`), una `Card` (de `ui-system`) con `Brand`, campos `.field/.input`, botón `.btn primary block`, link a `/login`.

- [ ] **Step 2: Verificar**

Run: `pnpm dev`, abrir `/register`, crear una cuenta de prueba.
Expected: registro funciona, estética USM.

- [ ] **Step 3: Commit**

```bash
git add src/app/register/page.tsx
git commit -m "feat(design): registro USM conservando lógica actual"
```

---

## FASE 4 — Gráficos

### Task 12: ChartsUSM (paleta USM sobre datos actuales)

**Files:**
- Create: `src/components/ChartsUSM.tsx`

- [ ] **Step 1: Crear gráficos recharts con paleta USM**

Adaptar `REF/components/panel/Graficos.tsx` a `src/components/ChartsUSM.tsx`, pero consumiendo la forma de datos del dashboard actual (`/api/dashboard` → `series:{date,in,out}[]`, `occupancy:{name,capacity,occupied,percentage}[]`, `methodDist:Record<string,number>`, `topVehicles:{plate,owner,count}[]`). Exportar un componente `ChartsUSM` que reciba esos datos por props (el dashboard ya los tiene):

```tsx
"use client";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, Plate } from "@/components/ui-system";

const AZUL = "#004B85", VERDE = "#008452", ROJO = "#D60019", AMARILLO = "#F7AE00", CELESTE = "#0a5a99", GRIS = "#8a97a5";
const PIE = [AZUL, VERDE, AMARILLO, GRIS];
const METODO: Record<string, string> = { PLATE: "Patente", QR: "QR", CARD: "Credencial", MANUAL: "Manual" };

export function ChartsUSM({ series, occupancy, methodDist, topVehicles }: {
  series: { date: string; in: number; out: number }[];
  occupancy: { name: string; capacity: number; occupied: number; percentage: number }[];
  methodDist: Record<string, number>;
  topVehicles: { plate: string; owner: string; count: number }[];
}) {
  const metodos = Object.entries(methodDist || {}).map(([k, v]) => ({ nombre: METODO[k] ?? k, n: v }));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginTop: 20 }}>
      <Card title="Entradas vs salidas · 7 días">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={series} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,140,152,.25)" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v: string) => v.slice(5)} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip /><Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="in" name="Entradas" stroke={VERDE} strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="out" name="Salidas" stroke={CELESTE} strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card title="Métodos de acceso · 7 días">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={metodos} dataKey="n" nameKey="nombre" cx="50%" cy="50%" innerRadius={48} outerRadius={78} paddingAngle={2}>
              {metodos.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
            </Pie>
            <Tooltip /><Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </Card>
      <Card title="Ocupación por sector · ahora">
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={occupancy} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,140,152,.25)" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} allowDecimals={false} /><Tooltip />
            <Bar dataKey="capacity" fill="rgba(128,140,152,.3)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="occupied" radius={[4, 4, 0, 0]}>
              {occupancy.map((s, i) => <Cell key={i} fill={s.percentage > 85 ? ROJO : s.percentage > 50 ? AMARILLO : VERDE} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card title="Vehículos más frecuentes · 7 días">
        {topVehicles.length === 0 ? <p className="muted" style={{ fontSize: 13 }}>Sin registros suficientes.</p> : (
          <div className="col" style={{ gap: 8 }}>
            {topVehicles.map((v, i) => (
              <div key={v.plate} className="row between" style={{ padding: "7px 0", borderBottom: i < topVehicles.length - 1 ? "1px solid var(--line-soft)" : "none" }}>
                <span className="row" style={{ gap: 10 }}>
                  <span className="mono dim" style={{ fontSize: 12, width: 14 }}>{i + 1}</span>
                  <Plate size="sm">{v.plate}</Plate>
                  <span style={{ fontSize: 13 }}>{v.owner}</span>
                </span>
                <span className="mono" style={{ fontWeight: 700 }}>{v.count}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Verificar tipos**

Run: `pnpm exec tsc --noEmit`
Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/components/ChartsUSM.tsx
git commit -m "feat(design): gráficos recharts con paleta USM"
```

---

## FASE 5 — Páginas admin

> Patrón general por página: (1) leer la página actual y anotar sus hooks de datos (fetch a `/api/*`) y handlers; (2) **conservar** ese fetching/estado; (3) reemplazar el JSX shadcn por componentes/clases USM (`Card, Metric, Plate, Badge, LotGrid, AccessStream, Modal`, `.table`, `.btn`, `.field`, `.callout`); (4) `pnpm dev` y revisar; (5) commit.

### Task 13: Dashboard admin (`/admin`)

**Files:**
- Modify: `src/app/admin/page.tsx`

- [ ] **Step 1: Reescribir presentación conservando el fetch**

Conservar el `useEffect` que hace `fetch("/api/dashboard")` con polling 10s y el tipo `Dashboard`. Reemplazar el cuerpo por:
- Banda de KPIs con `Metric` (de `ui-system`): Usuarios, Vehículos, Accesos hoy, Dentro ahora, Infracciones abiertas, Tasa autorización. Mapear desde `data.metrics`.
- `<ChartsUSM series={data.series} occupancy={data.occupancy} methodDist={data.methodDist} topVehicles={data.topVehicles} />`.
- Ocupación con `LotGrid` derivando `Lot[]` desde `data.occupancy` con `lotLevel(occupied, capacity)`.
- Envolver en `<div style={{ padding: 24 }}>`. Skeleton de carga con clase `.skeleton`.

- [ ] **Step 2: Verificar**

Run: `pnpm dev`, abrir `/admin`. Comparar con `screenshots/dashboard-graficos.png` y `panel-usm.png`.
Expected: KPIs Metric + gráficos + ocupación tipo semáforo.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/page.tsx
git commit -m "feat(design): dashboard admin USM (Metric + ChartsUSM + LotGrid)"
```

---

### Task 14: Usuarios (`/admin/users`)

**Files:** Modify: `src/app/admin/users/page.tsx`

- [ ] **Step 1:** Conservar fetch/CRUD a `/api/users`. Reemplazar tabla shadcn por `.table` (con `<thead><th>` y filas), `avatar` con iniciales, `chip-role` por rol, y `Modal` (de `ui-system`) para crear/editar. Botones `.btn primary`/`.btn ghost`. Estado vacío con fila centrada `muted`.
- [ ] **Step 2:** `pnpm dev`, abrir `/admin/users`, probar crear/editar. Comparar estética con `panel-usm.png`.
- [ ] **Step 3:** `git add src/app/admin/users/page.tsx && git commit -m "feat(design): usuarios admin USM (.table + chip-role + Modal)"`

---

### Task 15: Vehículos (`/admin/vehicles`)

**Files:** Modify: `src/app/admin/vehicles/page.tsx`

- [ ] **Step 1:** Conservar fetch/CRUD a `/api/vehicles` (y soporte de `?q=` que envía el topbar). Reemplazar por `.table` con `Plate` para la patente, `Badge` para estado (autorizado→`go`), `Modal` para alta/edición.
- [ ] **Step 2:** `pnpm dev`, abrir `/admin/vehicles`, probar búsqueda y edición.
- [ ] **Step 3:** `git add src/app/admin/vehicles/page.tsx && git commit -m "feat(design): vehículos admin USM (.table + Plate + Modal)"`

---

### Task 16: Bloques (`/admin/parking`)

**Files:** Modify: `src/app/admin/parking/page.tsx`

- [ ] **Step 1:** Conservar fetch/CRUD a `/api/parking`. Mostrar bloques con `LotGrid` (derivar `Lot[]` con `lotLevel`) + `Card` con formulario `.field` para crear/editar capacidad.
- [ ] **Step 2:** `pnpm dev`, abrir `/admin/parking`.
- [ ] **Step 3:** `git add src/app/admin/parking/page.tsx && git commit -m "feat(design): bloques admin USM (LotGrid)"`

---

### Task 17: Accesos (`/admin/access`)

**Files:** Modify: `src/app/admin/access/page.tsx`

- [ ] **Step 1:** Conservar fetch a `/api/access`. Mapear cada registro a `Acceso` (de `design-data`) y renderizar con `AccessStream` (o `.table` si hay paginación), usando `Plate`, `Badge` y `DirTag` (entrada/salida).
- [ ] **Step 2:** `pnpm dev`, abrir `/admin/access`. Comparar con la sección "Accesos en vivo" de `panel-usm.png`.
- [ ] **Step 3:** `git add src/app/admin/access/page.tsx && git commit -m "feat(design): accesos admin USM (AccessStream)"`

---

### Task 18: Infracciones (`/admin/infractions`)

**Files:** Modify: `src/app/admin/infractions/page.tsx`

- [ ] **Step 1:** Conservar fetch/acciones a `/api/infractions`. Reemplazar por `.table` + `Badge` (estado), `Plate`, `Modal` de detalle/resolución y `callout` para destacar abiertas.
- [ ] **Step 2:** `pnpm dev`, abrir `/admin/infractions`, probar resolver/desestimar.
- [ ] **Step 3:** `git add src/app/admin/infractions/page.tsx && git commit -m "feat(design): infracciones admin USM (.table + Badge + Modal)"`

---

## FASE 6 — Páginas guard

### Task 19: Pórtico / dashboard guardia (`/guard`)

**Files:** Modify: `src/app/guard/page.tsx`

- [ ] **Step 1:** Leer la página actual y conservar su fetch. Presentar con `Metric` (KPIs operativos), `AccessStream` (accesos en vivo) y, si hay validación manual, un `Card` con `.field` + `.btn`. Banda superior con `callout` de alerta si aplica.
- [ ] **Step 2:** `pnpm dev`, abrir `/guard`.
- [ ] **Step 3:** `git add src/app/guard/page.tsx && git commit -m "feat(design): pórtico guardia USM"`

---

### Task 20: Historial (`/guard/history`)

**Files:** Modify: `src/app/guard/history/page.tsx`

- [ ] **Step 1:** Conservar fetch. `.table` o `AccessStream` con `Plate` + `DirTag` + `Badge`.
- [ ] **Step 2:** `pnpm dev`, abrir `/guard/history`.
- [ ] **Step 3:** `git add src/app/guard/history/page.tsx && git commit -m "feat(design): historial guardia USM"`

---

### Task 21: Infracciones guardia (`/guard/infractions`)

**Files:** Modify: `src/app/guard/infractions/page.tsx`

- [ ] **Step 1:** Conservar fetch/creación. `.table` + `Modal` para registrar infracción (con `.field`, `Plate`), `Badge` de estado.
- [ ] **Step 2:** `pnpm dev`, abrir `/guard/infractions`, probar crear.
- [ ] **Step 3:** `git add src/app/guard/infractions/page.tsx && git commit -m "feat(design): infracciones guardia USM"`

---

### Task 22: Ocupación (`/guard/occupancy`)

**Files:** Modify: `src/app/guard/occupancy/page.tsx`

- [ ] **Step 1:** Conservar fetch. `LotGrid` derivando `Lot[]` con `lotLevel`.
- [ ] **Step 2:** `pnpm dev`, abrir `/guard/occupancy`.
- [ ] **Step 3:** `git add src/app/guard/occupancy/page.tsx && git commit -m "feat(design): ocupación guardia USM (LotGrid)"`

---

### Task 23: Búsqueda (`/guard/search`)

**Files:** Modify: `src/app/guard/search/page.tsx`

- [ ] **Step 1:** Conservar fetch de búsqueda. `.searchbox` (input con `<I name="search"/>`), resultados en `.table`/cards con `Plate`, `Badge`, `avatar`.
- [ ] **Step 2:** `pnpm dev`, abrir `/guard/search`, probar una búsqueda.
- [ ] **Step 3:** `git add src/app/guard/search/page.tsx && git commit -m "feat(design): búsqueda guardia USM"`

---

## FASE 7 — Páginas usuario (portal)

### Task 24: Inicio conductor (`/user`)

**Files:** Modify: `src/app/user/page.tsx`

- [ ] **Step 1:** Conservar fetch (dashboard/metrics del usuario). Saludo `<h1>Hola, {nombre}</h1>`, grid de `Metric` (Mis vehículos, Accesos, Infracciones, Notificaciones), y `Card` de acción (Generar QR → `/user/qr`, Mis vehículos → `/user/vehicles`).
- [ ] **Step 2:** `pnpm dev`, abrir `/user`.
- [ ] **Step 3:** `git add src/app/user/page.tsx && git commit -m "feat(design): inicio conductor USM"`

---

### Task 25: Mi QR (`/user/qr`)

**Files:** Modify: `src/app/user/qr/page.tsx`

- [ ] **Step 1:** Conservar generación de QR (`/api/qr`, `qrcode`). Presentar en `Card` centrada con el QR, `Plate` de la patente y nota de expiración; botón `.btn primary` para regenerar.
- [ ] **Step 2:** `pnpm dev`, abrir `/user/qr`.
- [ ] **Step 3:** `git add src/app/user/qr/page.tsx && git commit -m "feat(design): mi QR conductor USM"`

---

### Task 26: Mis vehículos (`/user/vehicles`)

**Files:** Modify: `src/app/user/vehicles/page.tsx`

- [ ] **Step 1:** Conservar fetch/alta a `/api/vehicles`. Lista de `Card` con `Plate`, `Badge` de estado; `Modal`/form `.field` para agregar.
- [ ] **Step 2:** `pnpm dev`, abrir `/user/vehicles`.
- [ ] **Step 3:** `git add src/app/user/vehicles/page.tsx && git commit -m "feat(design): mis vehículos conductor USM"`

---

### Task 27: Infracciones conductor (`/user/infractions`)

**Files:** Modify: `src/app/user/infractions/page.tsx`

- [ ] **Step 1:** Conservar fetch. Lista de `Card`/`.table` con `Badge`, `Plate` y `callout` para infracciones por reconocer; acción de reconocer si existe.
- [ ] **Step 2:** `pnpm dev`, abrir `/user/infractions`.
- [ ] **Step 3:** `git add src/app/user/infractions/page.tsx && git commit -m "feat(design): infracciones conductor USM"`

---

### Task 28: Notificaciones (`/user/notifications`)

**Files:** Modify: `src/app/user/notifications/page.tsx`

- [ ] **Step 1:** Conservar fetch a `/api/notifications`. Lista de `Card`/filas con ícono `<I/>`, título, fecha y `Badge` no-leídas.
- [ ] **Step 2:** `pnpm dev`, abrir `/user/notifications`.
- [ ] **Step 3:** `git add src/app/user/notifications/page.tsx && git commit -m "feat(design): notificaciones conductor USM"`

---

## FASE 8 — Limpieza y verificación final

### Task 29: Eliminar componentes sin uso

**Files:**
- Delete: `src/components/Nav.tsx`
- Delete: `src/components/ui/*` que ya no se importen

- [ ] **Step 1: Detectar imports residuales**

Buscar usos de `@/components/Nav` y de cada archivo en `@/components/ui/` con búsqueda de texto. Conservar los que aún se importen (p. ej. `tooltip`, `sonner` si el layout los usa).

- [ ] **Step 2: Eliminar los no usados**

Borrar `src/components/Nav.tsx` y los `src/components/ui/*.tsx` sin referencias.

- [ ] **Step 3: Verificar build**

Run: `pnpm build`
Expected: build OK sin errores de imports.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore(design): eliminar Nav y componentes shadcn sin uso"
```

---

### Task 30: Verificación final (build + visual)

- [ ] **Step 1: Build completo**

Run: `pnpm build`
Expected: compila sin errores ni warnings de tipos.

- [ ] **Step 2: Recorrido visual por rol**

Run: `pnpm dev`. Iniciar sesión como admin, guard y user (credenciales demo). Recorrer las 20 rutas y comparar con `C:\Users\juanp\Escritorio\sigte\screenshots\`. Anotar discrepancias visuales y corregir.

- [ ] **Step 3: Captura opcional con Playwright**

(Opcional) Usar Playwright MCP para capturar landing, login y los 3 dashboards y comparar lado a lado con los screenshots de referencia.

- [ ] **Step 4: Commit final / preparar PR**

```bash
git add -A
git commit -m "chore(design): verificación final del rediseño USM"
```

---

## Mejoras de features detectadas (NO en este plan — registrar para decisión futura)
Tótem de acceso; validación manual QR/cédula; formato/validación de RUT; ocupación por presencia exacta; exportación CSV de bitácora; personas de confianza; solicitudes de inscripción con documentos; campana de pendientes con conteo; `DirTag` entrada/salida en todas las bitácoras.

## Notas
- Backend, auth, rutas y APIs **no se tocan**. Si una página actual usa una forma de datos que no calza con un componente USM, se adapta en la capa de presentación (o se extiende `design-data.ts`), nunca cambiando la API.
- Si `pnpm build` falla a mitad de fase por páginas aún no migradas, validar con `pnpm dev` y dejar el build verde como meta al cierre de cada fase.
