"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Card, Badge, Plate } from "@/components/ui-system";
import { I } from "@/components/Icon";

type Vehicle = {
  id: string;
  plate: string;
  make: string | null;
  model: string | null;
  color: string | null;
  authorized: boolean;
  owner: { id: string; name: string; email: string };
  currentBlock: { id: string; name: string } | null;
};

export default function AdminVehiclesPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }} className="muted">Cargando…</div>}>
      <AdminVehicles />
    </Suspense>
  );
}

function AdminVehicles() {
  const params = useSearchParams();
  const [items, setItems] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState(params.get("q") ?? "");

  async function load() {
    const q = search ? `?plate=${encodeURIComponent(search.toUpperCase())}` : "";
    const r = await fetch(`/api/vehicles${q}`).then((r) => r.json());
    setItems(r.vehicles ?? []);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync with the `?q=` search param sent by the topbar.
  useEffect(() => {
    const q = params.get("q") ?? "";
    setSearch(q);
    const url = q ? `?plate=${encodeURIComponent(q.toUpperCase())}` : "";
    fetch(`/api/vehicles${url}`)
      .then((r) => r.json())
      .then((r) => setItems(r.vehicles ?? []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  async function toggleAuth(v: Vehicle) {
    const r = await fetch(`/api/vehicles/${v.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorized: !v.authorized }),
    });
    if (!r.ok) return toast.error("No se pudo actualizar");
    toast.success(v.authorized ? "Vehículo bloqueado" : "Vehículo autorizado");
    load();
  }

  async function remove(v: Vehicle) {
    if (!confirm(`¿Eliminar patente ${v.plate}?`)) return;
    const r = await fetch(`/api/vehicles/${v.id}`, { method: "DELETE" });
    if (!r.ok) return toast.error("No se pudo eliminar");
    toast.success("Vehículo eliminado");
    load();
  }

  return (
    <div style={{ padding: 24 }}>
      <div className="row between" style={{ marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: "var(--ff-display)", fontSize: 24 }}>Vehículos</h1>
          <p className="muted" style={{ fontSize: 13 }}>
            Registro completo del parque vehicular del campus
          </p>
        </div>
      </div>

      <div className="row" style={{ gap: 8, maxWidth: 460, marginBottom: 16 }}>
        <div className="searchbox" style={{ flex: 1 }}>
          <I name="search" size={17} />
          <input
            className="input mono"
            placeholder="Buscar patente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
          />
        </div>
        <button className="btn primary" onClick={load}>
          Buscar
        </button>
      </div>

      <Card>
        <table className="table">
          <thead>
            <tr>
              <th>Patente</th>
              <th>Vehículo</th>
              <th>Color</th>
              <th>Dueño</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th style={{ textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((v) => (
              <tr key={v.id}>
                <td>
                  <Plate size="sm">{v.plate}</Plate>
                </td>
                <td>
                  {[v.make, v.model].filter(Boolean).join(" ") || (
                    <span className="muted">—</span>
                  )}
                </td>
                <td className="muted">{v.color ?? "—"}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{v.owner.name}</div>
                  <div className="muted" style={{ fontSize: 12 }}>
                    {v.owner.email}
                  </div>
                </td>
                <td>
                  {v.currentBlock ? (
                    <Badge kind="info">{v.currentBlock.name}</Badge>
                  ) : (
                    <span className="muted" style={{ fontSize: 12 }}>
                      Fuera
                    </span>
                  )}
                </td>
                <td>
                  <Badge kind={v.authorized ? "go" : "no"}>
                    {v.authorized ? "Autorizado" : "Bloqueado"}
                  </Badge>
                </td>
                <td>
                  <span className="row" style={{ gap: 6, justifyContent: "flex-end" }}>
                    <button
                      className="btn ghost icon"
                      title={v.authorized ? "Bloquear" : "Autorizar"}
                      onClick={() => toggleAuth(v)}
                    >
                      <I name={v.authorized ? "shieldAlert" : "shieldCheck"} size={16} />
                    </button>
                    <button
                      className="btn danger icon"
                      title="Eliminar"
                      onClick={() => remove(v)}
                    >
                      <I name="trash" size={16} />
                    </button>
                  </span>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 24 }} className="muted">
                  Sin vehículos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
