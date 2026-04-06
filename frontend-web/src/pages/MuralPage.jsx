import { Megaphone, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import EmptyState from "../components/EmptyState";
import SectionHeader from "../components/SectionHeader";
import {
  createContent,
  deleteContent,
  listContents,
} from "../services/contentService";
import { useAuthStore } from "../store/authStore";
import { parseApiError } from "../utils/parseApiError";

function getUserGroupIds(user) {
  if (!user) return [];
  if (Array.isArray(user.userGroups)) return user.userGroups.map(Number);
  return [];
}

function canPublish(user) {
  const groups = getUserGroupIds(user);
  return groups.includes(1) || groups.includes(2);
}

function formatDate(date) {
  if (!date) return "-";
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(date));
  } catch {
    return "-";
  }
}

export default function MuralPage() {
  const authUser = useAuthStore((state) => state.user);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    content: "",
    category: "Avisos",
    theme: "Geral",
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const userCanPublish = useMemo(() => canPublish(authUser), [authUser]);

  async function fetchPosts() {
    setLoading(true);

    try {
      const data = await listContents();

      const ordered = [...data].sort((a, b) => {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });

      setPosts(ordered);
    } catch (error) {
      setFeedback({
        type: "error",
        message: parseApiError(
          error,
          "Não foi possível carregar as publicações do mural.",
        ),
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setFeedback({
        type: "error",
        message: "Preencha pelo menos o título e a mensagem.",
      });
      return;
    }

    if (!authUser?.id) {
      setFeedback({
        type: "error",
        message: "Usuário não identificado para publicar no mural.",
      });
      return;
    }
    if (!userCanPublish) return;

    setSaving(true);
    setFeedback({ type: "", message: "" });

    try {
      await createContent({
        title: form.title.trim(),
        user_id: Number(authUser?.id),
        subtitle: form.subtitle.trim(),
        content: form.content.trim(),
        category: form.category.trim() || "Avisos",
        theme: form.theme.trim() || "Geral",
      });

      setForm({
        title: "",
        subtitle: "",
        content: "",
        category: "Avisos",
        theme: "Geral",
      });

      setFeedback({
        type: "success",
        message: "Publicação criada com sucesso.",
      });

      await fetchPosts();
    } catch (error) {
      setFeedback({
        type: "error",
        message: parseApiError(error, "Não foi possível publicar no mural."),
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(post) {
    const confirmed = window.confirm(
      `Deseja realmente excluir a publicação "${post.title}"?`,
    );

    if (!confirmed) return;

    try {
      await deleteContent(post.id);

      setFeedback({
        type: "success",
        message: "Publicação excluída com sucesso.",
      });

      await fetchPosts();
    } catch (error) {
      setFeedback({
        type: "error",
        message: parseApiError(error, "Não foi possível excluir a publicação."),
      });
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Comunicação"
        title="Mural de recados"
        description="Este módulo já está alinhado ao backend. As publicações feitas aqui passam a ser a base real para a futura leitura no app mobile dos alunos."
        action={
          <div className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-600/10 px-4 py-3 text-sm text-blue-700">
            <Megaphone className="h-4 w-4" />
            Módulo integrado ao backend
          </div>
        }
      />

      {feedback.message ? (
        <div
          className={[
            "rounded-2xl border px-4 py-3 text-sm",
            feedback.type === "success"
              ? "border-blue-200 bg-blue-600/10 text-blue-700"
              : "border-slate-200 bg-slate-100 text-slate-700",
          ].join(" ")}
        >
          {feedback.message}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        {userCanPublish ? (
          <form
            onSubmit={handleSubmit}
            className="rounded-[32px] border border-slate-200 bg-white shadow-sm p-6"
          >
            <h4 className="text-lg font-semibold text-slate-900">
              Nova publicação
            </h4>

            <div className="mt-5 space-y-4">
              <Field label="Título">
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Ex.: Aula especial amanhã"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                />
              </Field>

              <Field label="Subtítulo">
                <input
                  name="subtitle"
                  value={form.subtitle}
                  onChange={handleChange}
                  placeholder="Opcional"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Categoria">
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Avisos"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                  />
                </Field>

                <Field label="Tema">
                  <input
                    name="theme"
                    value={form.theme}
                    onChange={handleChange}
                    placeholder="Geral"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                  />
                </Field>
              </div>

              <Field label="Mensagem">
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  required
                  placeholder="Escreva um aviso claro para os alunos"
                  rows={7}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                />
              </Field>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Plus className="h-4 w-4" />
              {saving ? "Publicando..." : "Publicar no mural"}
            </button>
          </form>
        ) : (
          <div className="rounded-[32px] border border-slate-200 bg-white shadow-sm p-6">
            <h4 className="text-lg font-semibold text-slate-900">
              Criação de publicações
            </h4>
            <div className="mt-5">
              <EmptyState
                title="Apenas administradores e professores publicam"
                description="Seu perfil pode visualizar o mural normalmente. A criação de novos comunicados fica restrita aos perfis autorizados pelo backend."
              />
            </div>
          </div>
        )}

        <div className="rounded-[32px] border border-slate-200 bg-white shadow-sm p-6">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-lg font-semibold text-slate-900">
              Publicações recentes
            </h4>

            <button
              type="button"
              onClick={fetchPosts}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-200 transition hover:border-blue-300"
            >
              <RefreshCcw className="h-4 w-4" />
              Atualizar
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {loading ? (
              <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
                Carregando publicações...
              </div>
            ) : posts.length ? (
              posts.map((post) => {
                const canDeletePost =
                  Number(authUser?.id) === Number(post.user_id) ||
                  getUserGroupIds(authUser).includes(1);

                return (
                  <article
                    key={post.id}
                    className="rounded-[26px] border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h5 className="text-lg font-semibold text-slate-900">
                            {post.title}
                          </h5>

                          <div className="flex gap-2">
                            <span className="px-3 py-1 text-sm rounded-full bg-blue-50 text-primary font-medium">
                              Avisos
                            </span>

                            <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-neutral">
                              Geral
                            </span>
                          </div>
                        </div>

                        {post.subtitle ? (
                          <p className="mt-2 text-sm text-slate-700">
                            {post.subtitle}
                          </p>
                        ) : null}

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {post.content}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span>
                            Autor:{" "}
                            {post.user?.username ||
                              post.user?.name ||
                              `Usuário #${post.user_id ?? "-"}`}
                          </span>
                          <span>•</span>
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </div>

                      {canDeletePost ? (
                        <button
                          type="button"
                          onClick={() => handleDelete(post)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs font-medium cursor-pointer text-black-700 transition hover:opacity-90 hover:bg-red-50 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                          Excluir
                        </button>
                      ) : null}
                    </div>
                  </article>
                );
              })
            ) : (
              <EmptyState
                title="Nenhuma publicação encontrada"
                description="Quando professores ou administradores publicarem conteúdo, ele aparecerá aqui e servirá de base para a futura integração com o app mobile."
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}
