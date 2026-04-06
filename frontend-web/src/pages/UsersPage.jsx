import { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Building2,
  RefreshCcw,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import {
  createUser,
  listUsers,
  updateUser,
  deleteUser,
} from "../services/usersService";
import { useAuthStore } from "../store/authStore";

const ROLE_OPTIONS = [
  { value: 1, label: "Administrador", icon: ShieldCheck },
  { value: 2, label: "Professor", icon: GraduationCap },
  { value: 3, label: "Aluno", icon: BookOpen },
  { value: 4, label: "Escola", icon: Building2 },
];

function extractGroupId(group) {
  if (group == null) return null;

  if (typeof group === "number" || typeof group === "string") {
    const parsed = Number(group);
    return Number.isNaN(parsed) ? null : parsed;
  }

  if (typeof group === "object") {
    const possibleId =
      group.id ??
      group.groupId ??
      group.userGroupId ??
      group.roleId ??
      group.value;

    const parsed = Number(possibleId);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
}

function getUserGroupId(user) {
  if (Array.isArray(user?.userGroups) && user.userGroups.length > 0) {
    return extractGroupId(user.userGroups[0]);
  }

  if (Array.isArray(user?.groups) && user.groups.length > 0) {
    return extractGroupId(user.groups[0]);
  }

  if (typeof user?.roleId !== "undefined") {
    return extractGroupId(user.roleId);
  }

  if (typeof user?.groupId !== "undefined") {
    return extractGroupId(user.groupId);
  }

  return null;
}

function getRoleLabel(user) {
  const groupId = getUserGroupId(user);
  const found = ROLE_OPTIONS.find(
    (role) => Number(role.value) === Number(groupId),
  );
  return found?.label || `Perfil ${groupId ?? "-"}`;
}

function getInitials(value = "") {
  return value
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getUserId(user) {
  return user?.id ?? user?._id ?? user?.userId ?? null;
}

export default function UsersPage() {
  const authUser = useAuthStore((state) => state.user);

  const authUserGroupId = useMemo(() => getUserGroupId(authUser), [authUser]);
  const isAdmin = authUserGroupId === 1;

  const visibleRoles = useMemo(() => {
    if (isAdmin) return ROLE_OPTIONS;
    return ROLE_OPTIONS.filter((role) => role.value === 3);
  }, [isAdmin]);

  const defaultUserGroup = visibleRoles[0]?.value || 3;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const [editingUserId, setEditingUserId] = useState(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    userGroup: defaultUserGroup,
  });

  useEffect(() => {
    setForm((prev) => {
      if (visibleRoles.some((role) => role.value === prev.userGroup)) {
        return prev;
      }

      return {
        ...prev,
        userGroup: defaultUserGroup,
      };
    });
  }, [defaultUserGroup, visibleRoles]);

  function resetForm() {
    setForm({
      username: "",
      email: "",
      password: "",
      userGroup: defaultUserGroup,
    });
    setEditingUserId(null);
  }

  async function fetchUsers() {
    setLoading(true);
    setFeedback((prev) => ({
      ...prev,
      message: prev.type === "success" ? prev.message : "",
    }));

    try {
      const data = await listUsers();
      setUsers(data);
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Não foi possível carregar os usuários.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: "", message: "" });

    const payload = {
      username: form.username.trim(),
      email: form.email.trim().toLowerCase(),
      userGroups: [Number(form.userGroup)],
    };

    if (form.password.trim()) {
      payload.password = form.password;
    }

    try {
      if (editingUserId) {
        await updateUser(editingUserId, payload);
        setFeedback({
          type: "success",
          message: "Usuário atualizado com sucesso.",
        });
      } else {
        await createUser({
          ...payload,
          password: form.password,
        });
        setFeedback({
          type: "success",
          message: "Usuário criado com sucesso.",
        });
      }

      resetForm();
      await fetchUsers();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          (editingUserId
            ? "Não foi possível atualizar o usuário."
            : "Não foi possível criar o usuário."),
      });
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(user) {
    if (!isAdmin) return;

    setEditingUserId(getUserId(user));
    setForm({
      username: user.username || user.name || "",
      email: user.email || "",
      password: "",
      userGroup: getUserGroupId(user) || defaultUserGroup,
    });

    setFeedback({ type: "", message: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(user) {
    if (!isAdmin) return;

    const userId = getUserId(user);
    if (!userId) {
      setFeedback({
        type: "error",
        message: "Não foi possível identificar o usuário para exclusão.",
      });
      return;
    }

    const confirmed = window.confirm(
      `Deseja realmente excluir o usuário "${user.username || user.email}"?`,
    );

    if (!confirmed) return;

    try {
      await deleteUser(userId);

      if (editingUserId === userId) {
        resetForm();
      }

      setFeedback({
        type: "success",
        message: "Usuário excluído com sucesso.",
      });

      await fetchUsers();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Não foi possível excluir o usuário.",
      });
    }
  }

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return users;

    return users.filter((user) => {
      const username = String(user.username || user.name || "").toLowerCase();
      const email = String(user.email || "").toLowerCase();
      return username.includes(term) || email.includes(term);
    });
  }, [users, search]);

  const summary = useMemo(() => {
    const total = users.length;
    const admins = users.filter((user) => getUserGroupId(user) === 1).length;
    const teachers = users.filter((user) => getUserGroupId(user) === 2).length;
    const students = users.filter((user) => getUserGroupId(user) === 3).length;

    return { total, admins, teachers, students };
  }, [users]);

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
              Gestão de usuários
            </span>

            <h1 className="mt-5 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
              Cadastre e acompanhe alunos, professores e administradores
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 md:text-base">
              Essa tela foi pensada para o professor e para a gestão web. Ela
              centraliza o cadastro de novos acessos e a visualização rápida dos
              perfis já existentes no sistema.
            </p>
          </div>

          <button
            onClick={fetchUsers}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCcw className="h-4 w-4" />
            Atualizar lista
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Total</p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {summary.total}
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                usuários cadastrados
              </p>
            </div>
            <div className="rounded-2xl bg-slate-100 p-3 text-blue-700">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Administradores</p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {summary.admins}
              </h3>
              <p className="mt-2 text-sm text-slate-400">controle do sistema</p>
            </div>
            <div className="rounded-2xl bg-slate-100 p-3 text-blue-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Professores</p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {summary.teachers}
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                produção de conteúdo
              </p>
            </div>
            <div className="rounded-2xl bg-slate-100 p-3 text-blue-700">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Alunos</p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {summary.students}
              </h3>
              <p className="mt-2 text-sm text-slate-400">consumo no app</p>
            </div>
            <div className="rounded-2xl bg-slate-100 p-3 text-blue-700">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.35fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-blue-700 p-3 text-white">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingUserId ? "Editar usuário" : "Novo usuário"}
                </h2>
                <p className="text-sm text-slate-500">
                  {editingUserId
                    ? "Atualize os dados do usuário selecionado."
                    : "Cadastro rápido para alunos, professores e administradores."}
                </p>
              </div>
            </div>

            {editingUserId ? (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
                Cancelar
              </button>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Nome de usuário
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, username: e.target.value }))
                }
                placeholder="Ex: maria.silva"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                E-mail
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="usuario@educast.com"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {editingUserId ? "Nova senha (opcional)" : "Senha"}
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder={
                  editingUserId
                    ? "Preencha só se quiser alterar"
                    : "Digite a senha inicial"
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                required={!editingUserId}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Perfil
              </label>
              <select
                value={form.userGroup}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    userGroup: Number(e.target.value),
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              >
                {visibleRoles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {!isAdmin ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-700">
                No perfil atual, o cadastro está limitado à criação de alunos.
              </div>
            ) : null}

            {feedback.message ? (
              <div
                className={`rounded-2xl px-4 py-3 text-sm ${
                  feedback.type === "error"
                    ? "border border-slate-200 bg-slate-100 text-slate-700"
                    : "border border-blue-200 bg-blue-50 text-blue-700"
                }`}
              >
                {feedback.message}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-2xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving
                ? editingUserId
                  ? "Salvando alterações..."
                  : "Salvando..."
                : editingUserId
                  ? "Salvar alterações"
                  : "Criar usuário"}
            </button>
          </form>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Usuários cadastrados
              </h2>
              <p className="text-sm text-slate-500">
                Visualização rápida dos acessos já disponíveis na plataforma.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou e-mail"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 md:w-64"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                Carregando usuários...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                Nenhum usuário encontrado.
              </div>
            ) : (
              filteredUsers.map((user, index) => {
                const userId = getUserId(user);

                return (
                  <div
                    key={userId || `${user.email}-${index}`}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-sm font-semibold text-white">
                          {getInitials(
                            user.username || user.name || user.email || "U",
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {user.username || user.name || "Sem nome"}
                          </p>
                          <p className="text-sm text-slate-500">
                            {user.email || "Sem e-mail"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                          {getRoleLabel(user)}
                        </span>

                        {typeof user.active !== "undefined" ? (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              user.active
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {user.active ? "Ativo" : "Inativo"}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {isAdmin ? (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(user)}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          <Pencil className="h-4 w-4" />
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(user)}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          <Trash2 className="h-4 w-4" />
                          Excluir
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
