/* Landing — punto de entrada del sistema S.I.G.T.E */
import Link from "next/link";
import { I } from "@/components/Icon";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import s from "./home.module.css";

export default async function Home() {
  const session = await getSession();
  if (session) {
    if (session.role === "ADMIN") redirect("/admin");
    if (session.role === "GUARD") redirect("/guard");
    redirect("/user");
  }

  return (
    <div>
      <div className={s.top}>
        <div className={s.topIn}>
          <span style={{ color: "var(--usm-azul)" }}>
            <span className="brand">
              <span className="sigla">S.I.G.T.E</span>
            </span>
          </span>
          <span style={{ fontSize: 13, color: "var(--ink-500)" }}>· Plataforma de control vehicular</span>
          <span className={s.topRight}>UTFSM · Viña del Mar</span>
        </div>
      </div>

      <header className={s.hero}>
        <div className={s.heroIn}>
          <div className={s.eyebrow}>Sistema Inteligente de Gestión de Tránsito y Estacionamiento</div>
          <h1>Todo el campus, en un sistema.</h1>
          <p>
            Panel web para administración y guardia, portal y app móvil para conductores, y el tótem de acceso del
            pórtico — todos conectados a una sola base de datos, en tiempo real.
          </p>
          <div className={s.pills}>
            <span className={s.pill}>Validación multimodal · LPR + QR + credencial</span>
            <span className={s.pill}>Ocupación por sector en tiempo real</span>
            <span className={s.pill}>Inscripción de vehículos en línea</span>
            <span className={s.pill}>Campus Viña del Mar</span>
          </div>
        </div>
      </header>

      <div className={s.wrap}>
        <section className={s.section} style={{ paddingTop: "var(--sp-7)" }}>
          <span className={s.secNum}>01 — MÓDULOS</span>
          <h2 className={s.sec}>Plataformas del sistema</h2>
          <div className={s.rule} />
          <p className={s.secIntro}>
            Tres puntos de contacto, una sola fuente de datos: cada acceso, vehículo e infracción queda registrado y
            trazable.
          </p>

          <div className={s.modules}>
            <Link className={s.mod} href="/login">
              <div className={`${s.thumb} ${s.thWeb}`}>
                <div
                  className={s.mini}
                  style={{ width: 230, height: 140, background: "#fff", left: "50%", top: 30, transform: "translateX(-50%)", display: "flex", overflow: "hidden" }}
                >
                  <div style={{ width: 52, background: "#002B4D" }} />
                  <div style={{ flex: 1, padding: 10 }}>
                    <div style={{ height: 8, width: "60%", background: "#CBDDEC", borderRadius: 3 }} />
                    <div style={{ display: "flex", gap: 6, marginTop: 9 }}>
                      <div style={{ flex: 1, height: 30, background: "#E8F0F6", borderRadius: 5 }} />
                      <div style={{ flex: 1, height: 30, background: "#E3F3EC", borderRadius: 5 }} />
                      <div style={{ flex: 1, height: 30, background: "#FEF4DD", borderRadius: 5 }} />
                    </div>
                    <div style={{ height: 7, width: "90%", background: "#EEF1F4", borderRadius: 3, marginTop: 10 }} />
                    <div style={{ height: 7, width: "80%", background: "#EEF1F4", borderRadius: 3, marginTop: 6 }} />
                  </div>
                </div>
              </div>
              <div className={s.modBody}>
                <div className={s.kk}>
                  <span className={s.ic} style={{ background: "var(--usm-azul)" }}>
                    <I name="dashboard" size={19} />
                  </span>
                  <h3>Panel web</h3>
                  <span className={s.count}>12 pantallas</span>
                </div>
                <div className={s.role}>ADMIN + GUARDIA · ESCRITORIO</div>
                <p>
                  Dashboard con gráficos, padrón de vehículos, solicitudes de inscripción, usuarios, estacionamientos
                  con mapa de ocupación, reportes, auditoría y el panel de pórtico en vivo.
                </p>
                <span className={s.go}>
                  Abrir panel <I name="arrowRight" size={16} />
                </span>
              </div>
            </Link>

            <Link className={s.mod} href="/login">
              <div className={`${s.thumb} ${s.thMob}`}>
                <div
                  className={s.mini}
                  style={{
                    width: 96,
                    height: 188,
                    background: "#fff",
                    left: "50%",
                    top: 18,
                    transform: "translateX(-50%)",
                    borderRadius: 18,
                    border: "5px solid #0b1c2b",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ height: 30, background: "#008452" }} />
                  <div style={{ flex: 1, padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ height: 54, background: "#fff", border: "1px solid #E2E6EA", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 34, height: 34, background: "repeating-linear-gradient(0deg,#0b1c2b 0 3px,#fff 3px 6px)" }} />
                    </div>
                    <div style={{ display: "flex", gap: 5 }}>
                      <div style={{ flex: 1, height: 26, background: "#E3F3EC", borderRadius: 5 }} />
                      <div style={{ flex: 1, height: 26, background: "#FEF4DD", borderRadius: 5 }} />
                    </div>
                  </div>
                  <div style={{ height: 26, background: "#fff", borderTop: "1px solid #E2E6EA" }} />
                </div>
              </div>
              <div className={s.modBody}>
                <div className={s.kk}>
                  <span className={s.ic} style={{ background: "var(--usm-verde)" }}>
                    <I name="qr" size={19} />
                  </span>
                  <h3>Portal del conductor</h3>
                  <span className={s.count}>web + app</span>
                </div>
                <div className={s.role}>CONDUCTOR · TELÉFONO O NAVEGADOR</div>
                <p>
                  QR dinámico de acceso, solicitud de inscripción de vehículo con documentos, mis vehículos, personas de
                  confianza, actividad, infracciones y avisos. También como app nativa.
                </p>
                <span className={s.go}>
                  Abrir portal <I name="arrowRight" size={16} />
                </span>
              </div>
            </Link>

            <Link className={s.mod} href="/login">
              <div className={`${s.thumb} ${s.thWeb}`} style={{ background: "linear-gradient(135deg,#003a66,#0a5a99)" }}>
                <div
                  className={s.mini}
                  style={{
                    width: 230,
                    height: 140,
                    background: "#fff",
                    left: "50%",
                    top: 30,
                    transform: "translateX(-50%)",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: 10 }}>
                    <div style={{ height: 8, width: "70%", background: "#CBDDEC", borderRadius: 3 }} />
                    <div style={{ height: 20, width: "85%", background: "#004B85", borderRadius: 5 }} />
                  </div>
                  <div style={{ background: "linear-gradient(160deg,#002B4D,#004B85)" }} />
                </div>
              </div>
              <div className={s.modBody}>
                <div className={s.kk}>
                  <span className={s.ic} style={{ background: "#0a5a99" }}>
                    <I name="login" size={19} />
                  </span>
                  <h3>Acceso institucional</h3>
                  <span className={s.count}>@usm.cl</span>
                </div>
                <div className={s.role}>LOGIN · CUENTA INSTITUCIONAL</div>
                <p>
                  Cualquier cuenta @usm.cl puede ingresar con enlace al correo o contraseña. Los roles y la inscripción
                  de vehículos los aprueba administración.
                </p>
                <span className={s.go}>
                  Ir al login <I name="arrowRight" size={16} />
                </span>
              </div>
            </Link>
          </div>
        </section>

        <section className={s.section}>
          <span className={s.secNum}>02 — FUNCIONALIDADES</span>
          <h2 className={s.sec}>Qué hace el sistema</h2>
          <div className={s.rule} />
          <p className={s.secIntro}>
            Del ingreso al pórtico hasta el reporte mensual: cada movimiento queda registrado, trazable y visible para
            quien corresponde.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--sp-3)" }}>
            {(
              [
                [
                  "barrier",
                  "Control de acceso en el pórtico",
                  "La cámara LPR lee la patente (también desde una foto) y el sistema autoriza, deniega o deriva a validación manual con QR o cédula. El guardia puede abrir la barrera y todo queda en la bitácora.",
                ],
                [
                  "parking",
                  "Estacionamientos con presencia real",
                  "Cada vehículo que entra se asigna a un sector. El mapa muestra quién está dentro, permite moverlo de sector o registrar su salida, y la ocupación se calcula sola — exacta, siempre.",
                ],
                [
                  "userCheck",
                  "Inscripción de vehículos en línea",
                  "El conductor postula su vehículo desde el portal adjuntando padrón, permiso de circulación y licencia. Administración revisa los documentos y aprueba o rechaza con motivo; también existe el alta presencial.",
                ],
                [
                  "qr",
                  "QR dinámico anti-clonación",
                  "Cada conductor genera un código firmado que expira en 60 segundos y solo sirve para sus propias patentes. El guardia lo escanea y ve al titular real del padrón.",
                ],
                [
                  "file",
                  "Fiscalización formativa",
                  "Las infracciones se registran con foto de evidencia y notifican al conductor, que las reconoce desde su portal. Administración las resuelve o desestima — con historial completo.",
                ],
                [
                  "chart",
                  "Reportes y auditoría",
                  "Dashboard con tendencias de entradas y salidas, métodos de acceso y vehículos frecuentes; bitácora inmutable filtrable y exportable a CSV para respaldo institucional.",
                ],
              ] as const
            ).map(([icon, titulo, texto]) => (
              <div className="card" key={titulo}>
                <span
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: "var(--usm-azul)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                  }}
                >
                  <I name={icon} size={19} />
                </span>
                <h4 style={{ fontFamily: "var(--ff-display)", fontSize: 15.5, marginBottom: 6 }}>{titulo}</h4>
                <p style={{ fontSize: 13, color: "var(--ink-500)", margin: 0, lineHeight: 1.55 }}>{texto}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={s.section}>
          <span className={s.secNum}>03 — ROLES</span>
          <h2 className={s.sec}>Cada rol ve lo suyo</h2>
          <div className={s.rule} />
          <div className={s.grid2}>
            <div className="card">
              <h4 style={{ fontFamily: "var(--ff-display)", fontSize: 15, marginBottom: 8 }}>Conductor</h4>
              <p style={{ fontSize: 13, color: "var(--ink-500)", margin: 0, lineHeight: 1.55 }}>
                Entra con su correo @usm.cl. Ve su QR, sus vehículos y su actividad; inscribe vehículos, autoriza
                personas de confianza y recibe avisos. Nada más — sus datos son suyos.
              </p>
            </div>
            <div className="card">
              <h4 style={{ fontFamily: "var(--ff-display)", fontSize: 15, marginBottom: 8 }}>Guardia y administración</h4>
              <p style={{ fontSize: 13, color: "var(--ink-500)", margin: 0, lineHeight: 1.55 }}>
                El guardia opera el pórtico, valida accesos y registra infracciones. Administración además gestiona el
                padrón, los roles, los sectores y aprueba las solicitudes. Cada acción queda atribuida a quien la hizo.
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer className={s.footer}>
        <div className={s.footerIn}>
          <b>S.I.G.T.E — Sistema Inteligente de Gestión de Tránsito y Estacionamiento</b> · UTFSM, Sede Viña del Mar.
          <br />
          Acceso con cuenta institucional @usm.cl. El uso del escudo institucional debe ser autorizado por la Dirección
          General de Comunicaciones (<code>marca@usm.cl</code>).
        </div>
      </footer>
    </div>
  );
}
