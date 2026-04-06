import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, GraduationCap } from "lucide-react";
import { loginRequest } from "../services/authService";
import { useAuthStore } from "../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginRequest({ email, password });

      setAuth({
        token: data.token,
        user: data.user,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.error || "Não foi possível realizar o login.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <section className="hidden lg:flex flex-col justify-between bg-blue-700 text-white p-10 xl:p-14">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-3">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">EduCast</h1>
              <p className="text-sm text-slate-300">
                Educação além da internet
              </p>
            </div>
          </div>

          <div className="max-w-xl">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200">
              Plataforma web de gerenciamento
            </span>

            <h2 className="mt-6 text-4xl font-bold leading-tight">
              Acesse o painel e gerencie conteúdos, usuários e transmissões.
            </h2>

            <p className="mt-4 text-slate-300 leading-relaxed text-lg">
              Uma experiência mais institucional para professores, equipe
              administrativa e operação do projeto.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-lg font-semibold">Web</p>
              <p className="text-sm text-slate-300">Gestão do sistema</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-lg font-semibold">Seguro</p>
              <p className="text-sm text-slate-300">Sessão autenticada</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-lg font-semibold">Escalável</p>
              <p className="text-sm text-slate-300">Base para perfis</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-[#eef2f7] p-6 md:p-10">
          <div className="w-full max-w-md rounded-[32px] bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.15)] border border-slate-200 md:p-8">
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-3 lg:hidden">
                <div className="rounded-2xl bg-blue-700 p-3 text-white">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">EduCast</h1>
                  <p className="text-sm text-slate-500">
                    Plataforma educacional
                  </p>
                </div>
              </div>

              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Login
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Bem-vindo de volta
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Entre com seu e-mail e senha para continuar.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  E-mail
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 transition focus-within:border-slate-400 focus-within:shadow-sm">
                  <Mail className="h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
                    placeholder="admin@email.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Senha
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 transition focus-within:border-slate-400 focus-within:shadow-sm">
                  <Lock className="h-5 w-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-slate-500 transition hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-blue-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
