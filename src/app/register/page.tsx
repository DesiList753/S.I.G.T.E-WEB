"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { I } from "@/components/Icon";
import { Brand, Card } from "@/components/ui-system";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    universityId: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No se pudo completar el registro");
        return;
      }
      router.replace("/user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg)", padding: 24 }}>
      <Card style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ display: "inline-flex", marginBottom: 20 }}>
          <Brand />
        </div>
        <h1 style={{ fontSize: 22, marginBottom: 4 }}>Crear cuenta</h1>
        <p style={{ color: "var(--ink-500)", fontSize: 13.5, marginBottom: 20 }}>
          Registro como usuario del campus.
        </p>

        <form onSubmit={submit} className="col" style={{ gap: 14 }}>
          <div className="field">
            <label className="field-lbl">Nombre completo</label>
            <input
              className="input"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label className="field-lbl">Credencial universitaria</label>
            <input
              className="input"
              placeholder="USR-2026-123"
              value={form.universityId}
              onChange={(e) => setForm({ ...form, universityId: e.target.value })}
            />
          </div>
          <div className="field">
            <label className="field-lbl">Correo</label>
            <input
              className="input"
              type="email"
              required
              placeholder="nombre.apellido@usm.cl"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="field">
            <label className="field-lbl">Contraseña</label>
            <input
              className="input"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {error && (
            <div className="field-err">
              <I name="alert" size={14} /> {error}
            </div>
          )}

          <button className="btn primary block" type="submit" disabled={loading}>
            <I name="userCheck" size={18} /> {loading ? "Creando…" : "Registrarme"}
          </button>

          <p style={{ fontSize: 13, color: "var(--ink-500)", textAlign: "center", margin: 0 }}>
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" style={{ color: "var(--accent)", fontWeight: 600 }}>
              Inicia sesión
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
