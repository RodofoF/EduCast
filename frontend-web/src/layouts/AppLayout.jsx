import {
  Bell,
  LayoutDashboard,
  LogOut,
  Menu,
  MonitorPlay,
  Newspaper,
  Users,
} from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAuthStore } from "../store/authStore";
import logoEducast from "../assets/logo-educast.png";

const items = [
  { to: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { to: "/videoaulas", label: "Videoaulas", icon: MonitorPlay },
  { to: "/mural", label: "Mural", icon: Newspaper },
  { to: "/usuarios", label: "Usuários", icon: Users },
];

const titles = {
  "/dashboard": "Painel do Professor",
  "/videoaulas": "Catálogo de Videoaulas",
  "/mural": "Mural da Escola",
  "/usuarios": "Gestão de Usuários",
};

export default function AppLayout() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const pageTitle = useMemo(
    () => titles[location.pathname] || "EduCast",
    [location.pathname],
  );

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <div className="flex min-h-screen">
        <aside
          className={[
            "fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-gradient-to-b from-blue-700 via-blue-600 to-blue-800 p-5 text-white shadow-2xl shadow-blue-900/10 backdrop-blur-xl transition-transform lg:static lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <div className="flex h-full flex-col">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
              <img
                src={logoEducast}
                alt="EduCast"
                className="h-16 w-auto object-contain rounded-xl"
              />
            </div>

            <div className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-blue-100">
                Perfil ativo
              </p>
              <p className="mt-3 text-lg font-semibold text-white">
                {user?.username || user?.name || "Usuário autenticado"}
              </p>
              <p className="text-sm text-blue-100/85">
                {user?.email || "Sem e-mail"}
              </p>
              <p className="mt-2 text-xs text-blue-100/75">
                Ambiente focado em catálogo, conteúdo e experiência de
                streaming.
              </p>
            </div>

            <nav className="mt-8 space-y-2">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                        isActive
                          ? "bg-white text-blue-700 shadow-lg shadow-blue-950/15"
                          : "text-white hover:bg-white/12 hover:text-white",
                      ].join(" ")
                    }
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>

            <div className="mt-auto rounded-3xl border border-white/15 bg-white/10 p-4 text-sm text-white">
              <p className="font-semibold text-white">Foco do web</p>
              <p className="mt-2 text-blue-100/85">
                O painel foi estruturado para o professor administrar conteúdo,
                explorar o catálogo e refletir isso no app mobile.
              </p>
              <button
                type="button"
                onClick={logout}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
        </aside>

        {open ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
            onClick={() => setOpen(false)}
          />
        ) : null}

        <main className="flex-1 p-3 md:p-4 lg:p-5">
          <header className="mb-6 rounded-[28px] border border-slate-200 bg-white/90 p-4 shadow-xl shadow-blue-100/60 backdrop-blur-xl md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  className="rounded-2xl border border-slate-200 bg-white p-3 text-blue-700 lg:hidden"
                  onClick={() => setOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-blue-700">
                    Educação além da internet
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
                    {pageTitle}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Plataforma web com visual mais leve, institucional e pronta
                    para catálogo, aulas e transmissões.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <Bell className="h-4 w-4 text-blue-700" />
                Streaming preparado para web e mobile.
              </div>
            </div>
          </header>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
