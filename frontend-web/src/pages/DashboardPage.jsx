import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  return (
    <section className="flex min-h-[calc(100vh-220px)] items-center justify-center">
      <div className="w-full max-w-3xl rounded-[32px] border border-slate-200 bg-white px-8 py-14 text-center shadow-sm">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600/10 text-blue-700">
          <LayoutDashboard className="h-8 w-8" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
          Painel
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
          Tela em produção
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
          Pensando o que terá aqui...
        </p>
      </div>
    </section>
  );
}
