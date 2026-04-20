import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import { useState } from "react";
import Inicio from "@/pages/Inicio";
import Dashboard from "@/pages/Dashboard";
import RedConocimiento from "@/pages/RedConocimiento";
import Simulador from "@/pages/Simulador";
import Asistente from "@/pages/Asistente";
import CommandPalette from "@/components/CommandPalette";

const navItems = [
  { path: "/", label: "🏠 Inicio" },
  { path: "/dashboard", label: "📊 Dashboard de Biorreactor" },
  { path: "/red", label: "🌐 Red de Bio-Conocimiento" },
  { path: "/simulador", label: "🧪 Simulador de Bioprocesos" },
  { path: "/asistente", label: "💬 Asistente BioSync" },
];

function Sidebar({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const [location] = useLocation();

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full z-30 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{
          width: "260px",
          background: "#0A2E2E",
          borderRight: "1px solid rgba(0,229,204,0.15)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b" style={{ borderColor: "rgba(0,229,204,0.15)" }}>
          <span className="text-2xl">🔬</span>
          <div>
            <div className="text-white font-bold text-lg leading-tight" style={{ fontFamily: "system-ui" }}>
              BioSync Studio
            </div>
            <div className="text-xs" style={{ color: "#00E5CC" }}>
              Biofabricación inteligente
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(0,229,204,0.5)" }}>
              Navegación
            </span>
          </div>
          {navItems.map((item) => {
            const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`sidebar-nav-link flex items-center gap-3 px-4 py-3 mx-2 rounded-lg mb-1 cursor-pointer text-sm font-medium ${
                    isActive ? "sidebar-nav-active" : ""
                  }`}
                  style={{
                    color: isActive ? "#00E5CC" : "rgba(255,255,255,0.75)",
                    background: isActive ? "rgba(0,229,204,0.12)" : "transparent",
                    borderLeft: isActive ? "3px solid #00E5CC" : "3px solid transparent",
                  }}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom info */}
        <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(0,229,204,0.15)" }}>
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            BioSync Studio v2.0
          </div>
          <div className="text-xs mt-1" style={{ color: "rgba(0,229,204,0.5)" }}>
            Desde $99/mes
          </div>
        </div>
      </aside>
    </>
  );
}

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const [location] = useLocation();
  const current = navItems.find((n) => n.path === location || (n.path !== "/" && location.startsWith(n.path)));

  return (
    <header
      className="flex items-center gap-4 px-4 lg:px-6 h-14 border-b sticky top-0 z-10"
      style={{ background: "#0A2E2E", borderColor: "rgba(0,229,204,0.15)" }}
    >
      <button
        className="lg:hidden text-white p-1.5 rounded-lg hover:bg-white/10 transition"
        onClick={onMenuClick}
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex items-center gap-2">
        <span className="text-white font-medium text-sm">{current?.label || "🏠 Inicio"}</span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-white/5"
          style={{
            color: "rgba(255,255,255,0.5)",
            border: "1px solid rgba(0,229,204,0.2)",
            background: "rgba(0,229,204,0.04)",
          }}
          title="Abrir Command Palette"
        >
          <span>Buscar…</span>
          <kbd className="bs-mono text-[10px] px-1 rounded" style={{ background: "rgba(0,229,204,0.12)", color: "#00E5CC" }}>
            ⌘K
          </kbd>
        </button>
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
          style={{ background: "rgba(0,229,204,0.15)", color: "#00E5CC", border: "1px solid rgba(0,229,204,0.3)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
          Sistema activo
        </div>
      </div>
    </header>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: "#06191A" }}>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col lg:ml-[260px] min-w-0">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Inicio} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/red" component={RedConocimiento} />
      <Route path="/simulador" component={Simulador} />
      <Route path="/asistente" component={Asistente} />
      <Route>
        <div className="flex items-center justify-center h-[60vh] text-white text-xl">Página no encontrada</div>
      </Route>
    </Switch>
  );
}

function App() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <WouterRouter base={basePath}>
      <Layout>
        <Router />
      </Layout>
      <CommandPalette basePath={basePath} />
    </WouterRouter>
  );
}

export default App;
