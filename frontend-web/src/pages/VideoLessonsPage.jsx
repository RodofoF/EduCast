import {
  Loader2,
  MonitorPlay,
  Pencil,
  Radio,
  RefreshCcw,
  Send,
  Trash2,
  Tv,
  Upload,
  Video,
  Layers3,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";
import EmptyState from "../components/EmptyState";
import SectionHeader from "../components/SectionHeader";
import {
  createLiveVideo,
  createOnDemandVideo,
  deleteLiveVideo,
  deleteOnDemandVideo,
  listLiveVideos,
  listOnDemandVideos,
  updateLiveVideo,
  updateOnDemandVideo,
} from "../services/videoService";
import { useAuthStore } from "../store/authStore";
import { parseApiError } from "../utils/parseApiError";

const LIVE_INITIAL_FORM = {
  title: "",
  subtitle: "",
  category: "",
  theme: "",
  description: "",
  thumbnail_url: "",
  video_url: "",
  thumbnail: null,
};

const ONDEMAND_INITIAL_FORM = {
  title: "",
  subtitle: "",
  category: "",
  theme: "",
  description: "",
  thumbnail_url: "",
  video_url: "",
  thumbnail: null,
  video: null,
};

function getItemId(item) {
  return item?.id ?? item?._id ?? item?.liveId ?? item?.onDemandId ?? null;
}

function getDisplayTitle(item, fallback) {
  return item?.title || fallback;
}

function getDisplayDescription(item, fallback = "Sem descrição informada.") {
  return item?.description || fallback;
}

function getApiBaseUrl() {
  const envApi = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  return envApi.replace(/\/api\/?$/, "");
}

function resolveAssetUrl(path) {
  if (!path) return "";

  // Se já for URL completa, retorna direto
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // Se for caminho relativo (/uploads/...), monta URL completa
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function resolveVideoUrl(item) {
  const raw = item?.video_url || item?.videoUrl || item?.url || "";
  return resolveAssetUrl(raw);
}

function resolveThumbnailUrl(item) {
  const raw = item?.thumbnail_url || item?.thumbnailUrl || item?.thumb || "";
  return resolveAssetUrl(raw);
}

function buildLiveFormFromItem(item) {
  return {
    title: item?.title || "",
    subtitle: item?.subtitle || "",
    category: item?.category || "",
    theme: item?.theme || "",
    description: item?.description || "",
    thumbnail_url: resolveThumbnailUrl(item),
    video_url: resolveVideoUrl(item),
    thumbnail: null,
  };
}

function buildOnDemandFormFromItem(item) {
  return {
    title: item?.title || "",
    subtitle: item?.subtitle || "",
    category: item?.category || "",
    theme: item?.theme || "",
    description: item?.description || "",
    thumbnail_url: resolveThumbnailUrl(item),
    video_url: resolveVideoUrl(item),
    thumbnail: null,
    video: null,
  };
}

export default function VideoLessonsPage() {
  const authUser = useAuthStore((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [savingLive, setSavingLive] = useState(false);
  const [savingOnDemand, setSavingOnDemand] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const [liveChannels, setLiveChannels] = useState([]);
  const [onDemandVideos, setOnDemandVideos] = useState([]);

  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [liveStatus, setLiveStatus] = useState("idle");
  const [liveError, setLiveError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [liveForm, setLiveForm] = useState(LIVE_INITIAL_FORM);
  const [onDemandForm, setOnDemandForm] = useState(ONDEMAND_INITIAL_FORM);

  const [activePublishTab, setActivePublishTab] = useState("live");
  const [contentTab, setContentTab] = useState("live");

  const [editingLiveId, setEditingLiveId] = useState(null);
  const [editingOnDemandId, setEditingOnDemandId] = useState(null);

  const selectedChannel = useMemo(
    () =>
      liveChannels.find(
        (channel) => String(getItemId(channel)) === String(selectedChannelId),
      ),
    [liveChannels, selectedChannelId],
  );

  const isEditingLive = Boolean(editingLiveId);
  const isEditingOnDemand = Boolean(editingOnDemandId);

  async function loadData(options = {}) {
    const preserveFeedback = options.preserveFeedback ?? true;

    if (!preserveFeedback) {
      setFeedback({ type: "", message: "" });
    }

    try {
      setLoading(true);

      const [liveData, onDemandData] = await Promise.all([
        listLiveVideos(),
        listOnDemandVideos(),
      ]);

      setLiveChannels(liveData);
      setOnDemandVideos(onDemandData);

      setSelectedChannelId((currentId) => {
        const stillExists = liveData.some(
          (item) => String(getItemId(item)) === String(currentId),
        );

        if (stillExists) return currentId;
        return getItemId(liveData[0]) ?? null;
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: parseApiError(error, "Não foi possível carregar os vídeos."),
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData({ preserveFeedback: false });
  }, []);

  function handleLiveInputChange(event) {
    const { name, value, files, type } = event.target;

    setLiveForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files?.[0] || null : value,
    }));
  }

  function handleOnDemandInputChange(event) {
    const { name, value, files, type } = event.target;

    setOnDemandForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files?.[0] || null : value,
    }));
  }

  function resetLiveForm() {
    setLiveForm(LIVE_INITIAL_FORM);
    setEditingLiveId(null);
  }

  function resetOnDemandForm() {
    setOnDemandForm(ONDEMAND_INITIAL_FORM);
    setEditingOnDemandId(null);
  }

  function handleEditLive(item) {
    const id = getItemId(item);
    if (!id) return;

    setActivePublishTab("live");
    setEditingLiveId(id);
    setLiveForm(buildLiveFormFromItem(item));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleEditOnDemand(item) {
    const id = getItemId(item);
    if (!id) return;

    setActivePublishTab("ondemand");
    setEditingOnDemandId(id);
    setOnDemandForm(buildOnDemandFormFromItem(item));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmitLive(event) {
    event.preventDefault();
    setSavingLive(true);
    setFeedback({ type: "", message: "" });

    try {
      const payload = {
        ...liveForm,
        user_id: authUser?.id ?? authUser?.userId ?? "",
      };

      if (editingLiveId) {
        await updateLiveVideo(editingLiveId, payload);

        setFeedback({
          type: "success",
          message: "Live atualizada com sucesso.",
        });
      } else {
        await createLiveVideo(payload);

        setFeedback({
          type: "success",
          message: "Live publicada com sucesso.",
        });
      }

      resetLiveForm();
      await loadData();
    } catch (error) {
      setFeedback({
        type: "error",
        message: parseApiError(
          error,
          editingLiveId
            ? "Não foi possível atualizar a live."
            : "Não foi possível publicar a live.",
        ),
      });
    } finally {
      setSavingLive(false);
    }
  }

  async function handleSubmitOnDemand(event) {
    event.preventDefault();
    setSavingOnDemand(true);
    setFeedback({ type: "", message: "" });

    try {
      const payload = {
        ...onDemandForm,
        user_id: authUser?.id ?? authUser?.userId ?? "",
      };

      if (editingOnDemandId) {
        await updateOnDemandVideo(editingOnDemandId, payload);

        setFeedback({
          type: "success",
          message: "Vídeo on-demand atualizado com sucesso.",
        });
      } else {
        await createOnDemandVideo(payload);

        setFeedback({
          type: "success",
          message: "Vídeo on-demand publicado com sucesso.",
        });
      }

      resetOnDemandForm();
      await loadData();
    } catch (error) {
      setFeedback({
        type: "error",
        message: parseApiError(
          error,
          editingOnDemandId
            ? "Não foi possível atualizar o vídeo on-demand."
            : "Não foi possível publicar o vídeo on-demand.",
        ),
      });
    } finally {
      setSavingOnDemand(false);
    }
  }

  async function handleDeleteLive(item) {
    const id = getItemId(item);
    if (!id) return;

    const confirmed = window.confirm(
      `Deseja excluir a live "${getDisplayTitle(item, "Sem título")}"?`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(`live-${id}`);
      await deleteLiveVideo(id);
      await loadData();

      if (String(editingLiveId) === String(id)) {
        resetLiveForm();
      }

      setFeedback({
        type: "success",
        message: "Live excluída com sucesso.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: parseApiError(error, "Não foi possível excluir a live."),
      });
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDeleteOnDemand(item) {
    const id = getItemId(item);
    if (!id) return;

    const confirmed = window.confirm(
      `Deseja excluir o vídeo "${getDisplayTitle(item, "Sem título")}"?`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(`ondemand-${id}`);
      await deleteOnDemandVideo(id);
      await loadData();

      if (String(editingOnDemandId) === String(id)) {
        resetOnDemandForm();
      }

      setFeedback({
        type: "success",
        message: "Vídeo on-demand excluído com sucesso.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: parseApiError(error, "Não foi possível excluir o vídeo."),
      });
    } finally {
      setDeletingId(null);
    }
  }

  function renderLiveForm() {
    return (
      <form onSubmit={handleSubmitLive} className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Dados principais
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Defina o título e o contexto principal da transmissão.
              </p>
            </div>

            <InputField
              label="Título *"
              name="title"
              value={liveForm.title}
              onChange={handleLiveInputChange}
              placeholder="Ex.: Aula ao vivo de Matemática"
              required
            />

            <InputField
              label="Subtítulo"
              name="subtitle"
              value={liveForm.subtitle}
              onChange={handleLiveInputChange}
              placeholder="Ex.: Edição especial"
            />

            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Classificação
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Organize a transmissão por categoria e tema.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Categoria"
                name="category"
                value={liveForm.category}
                onChange={handleLiveInputChange}
                placeholder="Ex.: Educação"
              />

              <InputField
                label="Tema"
                name="theme"
                value={liveForm.theme}
                onChange={handleLiveInputChange}
                placeholder="Ex.: Álgebra"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Descrição e mídia
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Adicione detalhes e os arquivos ou links necessários.
              </p>
            </div>

            <TextareaField
              label="Descrição"
              name="description"
              value={liveForm.description}
              onChange={handleLiveInputChange}
              placeholder="Descreva rapidamente a transmissão."
            />

            <InputField
              label="URL da thumbnail"
              name="thumbnail_url"
              value={liveForm.thumbnail_url}
              onChange={handleLiveInputChange}
              placeholder="https://..."
            />

            <FileField
              label="Thumbnail (arquivo)"
              name="thumbnail"
              accept="image/*"
              onChange={handleLiveInputChange}
              hint={liveForm.thumbnail?.name}
            />

            <InputField
              label="URL do vídeo/live *"
              name="video_url"
              value={liveForm.video_url}
              onChange={handleLiveInputChange}
              placeholder="Ex.: http://localhost:9090/hls/live/1001/index.m3u8"
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
          {isEditingLive ? (
            <button
              type="button"
              onClick={resetLiveForm}
              className="inline-flex items-center justify-center gap-2 rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <X className="h-4 w-4" />
              Cancelar edição
            </button>
          ) : (
            <button
              type="button"
              onClick={resetLiveForm}
              className="inline-flex items-center justify-center gap-2 rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Limpar
            </button>
          )}

          <button
            type="submit"
            disabled={savingLive}
            className="inline-flex items-center justify-center gap-2 rounded-[18px] bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {savingLive ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isEditingLive ? (
              <Pencil className="h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {isEditingLive ? "Salvar live" : "Publicar live"}
          </button>
        </div>
      </form>
    );
  }

  function renderOnDemandForm() {
    return (
      <form onSubmit={handleSubmitOnDemand} className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Dados principais
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Informe os dados básicos do conteúdo gravado.
              </p>
            </div>

            <InputField
              label="Título *"
              name="title"
              value={onDemandForm.title}
              onChange={handleOnDemandInputChange}
              placeholder="Ex.: Aula gravada 01"
              required
            />

            <InputField
              label="Subtítulo"
              name="subtitle"
              value={onDemandForm.subtitle}
              onChange={handleOnDemandInputChange}
              placeholder="Ex.: Introdução"
            />

            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Classificação
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Organize o vídeo por categoria e tema.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Categoria"
                name="category"
                value={onDemandForm.category}
                onChange={handleOnDemandInputChange}
                placeholder="Ex.: Educação"
              />

              <InputField
                label="Tema"
                name="theme"
                value={onDemandForm.theme}
                onChange={handleOnDemandInputChange}
                placeholder="Ex.: Álgebra"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Descrição e mídia
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Adicione a capa e o vídeo por URL ou arquivo.
              </p>
            </div>

            <TextareaField
              label="Descrição"
              name="description"
              value={onDemandForm.description}
              onChange={handleOnDemandInputChange}
              placeholder="Descreva rapidamente o vídeo."
            />

            <InputField
              label="URL da thumbnail"
              name="thumbnail_url"
              value={onDemandForm.thumbnail_url}
              onChange={handleOnDemandInputChange}
              placeholder="https://..."
            />

            <FileField
              label="Thumbnail (arquivo)"
              name="thumbnail"
              accept="image/*"
              onChange={handleOnDemandInputChange}
              hint={onDemandForm.thumbnail?.name}
            />

            <InputField
              label="URL do vídeo"
              name="video_url"
              value={onDemandForm.video_url}
              onChange={handleOnDemandInputChange}
              placeholder="https://... ou URL local/publicada"
            />

            <FileField
              label="Vídeo (arquivo)"
              name="video"
              accept="video/*"
              onChange={handleOnDemandInputChange}
              hint={onDemandForm.video?.name}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
          {isEditingOnDemand ? (
            <button
              type="button"
              onClick={resetOnDemandForm}
              className="inline-flex items-center justify-center gap-2 rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <X className="h-4 w-4" />
              Cancelar edição
            </button>
          ) : (
            <button
              type="button"
              onClick={resetOnDemandForm}
              className="inline-flex items-center justify-center gap-2 rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Limpar
            </button>
          )}

          <button
            type="submit"
            disabled={savingOnDemand}
            className="inline-flex items-center justify-center gap-2 rounded-[18px] bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {savingOnDemand ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isEditingOnDemand ? (
              <Pencil className="h-4 w-4" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {isEditingOnDemand ? "Salvar on-demand" : "Publicar on-demand"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Conteúdo"
        title="Videoaulas"
        description="Gerencie transmissões ao vivo e conteúdos sob demanda em um só lugar."
        action={
          <button
            type="button"
            onClick={() => loadData()}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
          >
            <RefreshCcw className="h-4 w-4" />
            Atualizar
          </button>
        }
      />

      {feedback.message ? (
        <div
          className={[
            "rounded-[24px] border px-4 py-3 text-sm",
            feedback.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700",
          ].join(" ")}
        >
          {feedback.message}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Lives cadastradas"
          value={loading ? "..." : String(liveChannels.length).padStart(2, "0")}
          subtitle="Transmissões disponíveis"
          icon={<Radio className="h-5 w-5 text-blue-700" />}
        />

        <SummaryCard
          title="Vídeos on-demand"
          value={
            loading ? "..." : String(onDemandVideos.length).padStart(2, "0")
          }
          subtitle="Conteúdos gravados"
          icon={<Video className="h-5 w-5 text-blue-700" />}
        />

        <SummaryCard
          title="Total no catálogo"
          value={
            loading
              ? "..."
              : String(liveChannels.length + onDemandVideos.length).padStart(
                  2,
                  "0",
                )
          }
          subtitle="Biblioteca atual"
          icon={<Layers3 className="h-5 w-5 text-blue-700" />}
        />
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
              Publicação
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              {activePublishTab === "live"
                ? isEditingLive
                  ? "Editar live"
                  : "Nova live"
                : isEditingOnDemand
                  ? "Editar on-demand"
                  : "Novo on-demand"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Escolha o tipo de publicação e preencha os dados abaixo.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActivePublishTab("live")}
              className={[
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                activePublishTab === "live"
                  ? "bg-blue-700 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700",
              ].join(" ")}
            >
              <Radio className="h-4 w-4" />
              Live
            </button>

            <button
              type="button"
              onClick={() => setActivePublishTab("ondemand")}
              className={[
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                activePublishTab === "ondemand"
                  ? "bg-blue-700 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700",
              ].join(" ")}
            >
              <Video className="h-4 w-4" />
              On-demand
            </button>
          </div>
        </div>

        <div className="mt-6">
          {activePublishTab === "live"
            ? renderLiveForm()
            : renderOnDemandForm()}
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
              Biblioteca
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Organizar conteúdos
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Alterne entre lives e conteúdos gravados para visualizar, editar e
              excluir.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setContentTab("live")}
              className={[
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                contentTab === "live"
                  ? "bg-blue-700 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700",
              ].join(" ")}
            >
              <Radio className="h-4 w-4" />
              Lives
            </button>

            <button
              type="button"
              onClick={() => setContentTab("ondemand")}
              className={[
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                contentTab === "ondemand"
                  ? "bg-blue-700 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700",
              ].join(" ")}
            >
              <MonitorPlay className="h-4 w-4" />
              On-demand
            </button>
          </div>
        </div>

        {contentTab === "live" ? (
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-600/10 px-3 py-1 text-xs font-medium text-blue-700">
                    <Radio className="h-3.5 w-3.5" />
                    Ao vivo
                  </div>

                  <h3 className="mt-3 text-xl font-semibold text-slate-900">
                    {selectedChannel
                      ? getDisplayTitle(selectedChannel, "Canal ao vivo")
                      : "Canal ao vivo"}
                  </h3>

                  <p className="mt-1 text-sm text-slate-600">
                    {selectedChannel
                      ? getDisplayDescription(selectedChannel, "Sem descrição.")
                      : "Selecione uma live para visualizar."}
                  </p>
                </div>

                {selectedChannel ? (
                  <button
                    type="button"
                    onClick={() => {
                      setReloadKey((prev) => prev + 1);
                      setLiveError("");
                      setLiveStatus("loading");
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Recarregar player
                  </button>
                ) : null}
              </div>

              <div className="mt-5 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-900">
                {selectedChannel ? (
                  <LivePlayer
                    key={`${getItemId(selectedChannel)}-${reloadKey}`}
                    src={resolveVideoUrl(selectedChannel)}
                    onStatusChange={setLiveStatus}
                    onError={setLiveError}
                  />
                ) : (
                  <div className="flex aspect-video items-center justify-center text-sm text-slate-400">
                    Nenhuma live cadastrada.
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <span
                  className={[
                    "rounded-full px-3 py-1 font-medium",
                    liveStatus === "playing"
                      ? "bg-blue-600/10 text-blue-700"
                      : liveStatus === "loading"
                        ? "bg-slate-100 text-blue-700"
                        : "bg-slate-100 text-slate-700",
                  ].join(" ")}
                >
                  {liveStatus === "playing"
                    ? "Transmitindo"
                    : liveStatus === "loading"
                      ? "Carregando stream"
                      : "Aguardando stream"}
                </span>

                <span className="break-all text-slate-500">
                  Fonte:{" "}
                  {selectedChannel ? resolveVideoUrl(selectedChannel) : "-"}
                </span>
              </div>

              {liveError ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  {liveError}
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900">
                <Tv className="h-5 w-5 text-blue-700" />
                <h3 className="text-lg font-semibold">Lives cadastradas</h3>
              </div>

              {loading ? (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Carregando lives...
                </div>
              ) : liveChannels.length ? (
                <div className="space-y-3">
                  {liveChannels.map((channel) => {
                    const id = getItemId(channel);
                    const isActive = String(id) === String(selectedChannelId);
                    const deleteKey = `live-${id}`;
                    const thumbnail = resolveThumbnailUrl(channel);

                    return (
                      <article
                        key={id}
                        className={[
                          "overflow-hidden rounded-[24px] border bg-white shadow-sm transition",
                          isActive
                            ? "border-blue-300 ring-2 ring-blue-100"
                            : "border-slate-200",
                        ].join(" ")}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedChannelId(id);
                            setLiveError("");
                            setLiveStatus("loading");
                          }}
                          className="block w-full cursor-pointer text-left"
                        >
                          {thumbnail ? (
                            <img
                              src={thumbnail}
                              alt={getDisplayTitle(channel, "Live")}
                              className="aspect-video w-full object-cover"
                            />
                          ) : (
                            <div className="flex aspect-video items-center justify-center bg-slate-100 text-sm text-slate-400">
                              Sem thumbnail
                            </div>
                          )}

                          <div className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">
                                  <Radio className="h-3.5 w-3.5" />
                                  Live
                                </div>

                                <h4 className="mt-3 text-sm font-semibold text-slate-900">
                                  {getDisplayTitle(channel, "Sem título")}
                                </h4>

                                <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600">
                                  {getDisplayDescription(channel)}
                                </p>
                              </div>

                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                                #{id}
                              </span>
                            </div>

                            <p className="mt-3 line-clamp-2 break-all text-xs text-slate-500">
                              {resolveVideoUrl(channel) || "Sem video_url"}
                            </p>
                          </div>
                        </button>

                        <div className="flex items-center gap-2 border-t border-slate-100 px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleEditLive(channel)}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteLive(channel)}
                            disabled={deletingId === deleteKey}
                            className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {deletingId === deleteKey ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                            Excluir
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  title="Nenhuma live cadastrada"
                  description="Publique uma live usando o formulário acima e ela aparecerá aqui."
                />
              )}
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex items-center gap-2 text-slate-900">
              <MonitorPlay className="h-5 w-5 text-blue-700" />
              <h3 className="text-lg font-semibold">Conteúdo on-demand</h3>
            </div>

            {loading ? (
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando vídeos...
              </div>
            ) : onDemandVideos.length ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {onDemandVideos.map((video) => {
                  const id = getItemId(video);
                  const thumbnail = resolveThumbnailUrl(video);
                  const videoUrl = resolveVideoUrl(video);
                  const deleteKey = `ondemand-${id}`;

                  return (
                    <article
                      key={id}
                      className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
                    >
                      <div className="bg-black">
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt={getDisplayTitle(video, "Vídeo")}
                            className="aspect-video w-full object-cover"
                          />
                        ) : videoUrl ? (
                          <video
                            controls
                            preload="metadata"
                            className="aspect-video w-full"
                            src={videoUrl}
                          >
                            Seu navegador não suporta vídeo HTML5.
                          </video>
                        ) : (
                          <div className="flex aspect-video items-center justify-center text-sm text-slate-400">
                            Sem mídia disponível
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                              <Video className="h-3.5 w-3.5" />
                              On-demand
                            </div>

                            <h4 className="mt-3 text-base font-semibold text-slate-900">
                              {getDisplayTitle(video, "Sem título")}
                            </h4>

                            {video.subtitle ? (
                              <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-blue-700">
                                {video.subtitle}
                              </p>
                            ) : null}
                          </div>

                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                            #{id}
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {getDisplayDescription(video)}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {video.category ? (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                              {video.category}
                            </span>
                          ) : null}

                          {video.theme ? (
                            <span className="rounded-full bg-blue-600/10 px-3 py-1 text-xs font-medium text-blue-700">
                              {video.theme}
                            </span>
                          ) : null}
                        </div>

                        <p className="mt-4 line-clamp-2 break-all text-xs text-slate-500">
                          {videoUrl || "Sem video_url"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 border-t border-slate-100 px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleEditOnDemand(video)}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteOnDemand(video)}
                          disabled={deletingId === deleteKey}
                          className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {deletingId === deleteKey ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                          Excluir
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4">
                <EmptyState
                  title="Nenhum vídeo on-demand cadastrado"
                  description="Publique um conteúdo usando o formulário acima para começar a listar os vídeos aqui."
                />
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function SummaryCard({ title, value, subtitle, icon }) {
  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="rounded-2xl bg-blue-600/10 p-3">{icon}</div>
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">{title}</p>
      <h3 className="mt-2 text-3xl font-bold text-slate-900">{value}</h3>
      <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
    </article>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="h-12 rounded-[18px] border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function TextareaField({ label, name, value, onChange, placeholder }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function FileField({ label, name, accept, onChange, hint }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type="file"
        name={name}
        accept={accept}
        onChange={onChange}
        className="block w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-3 file:rounded-full file:border-0 file:bg-blue-600/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-700"
      />
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

function LivePlayer({ src, onStatusChange, onError }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return undefined;

    let hls;

    onError("");
    onStatusChange("loading");

    const handleLoadedData = () => onStatusChange("playing");
    const handleWaiting = () => onStatusChange("loading");
    const handleStalled = () => onStatusChange("loading");
    const handlePlaying = () => onStatusChange("playing");
    const handleVideoError = () => {
      onStatusChange("idle");
      onError(
        "Não foi possível reproduzir o canal ao vivo. Verifique se a URL está correta e se o stream está ativo.",
      );
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("stalled", handleStalled);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("error", handleVideoError);

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.play().catch(() => {});
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data?.fatal) {
          onStatusChange("idle");
          onError(
            "O stream HLS falhou no navegador. Confirme se o vídeo_url publicado é uma URL HLS válida.",
          );

          if (hls) {
            hls.destroy();
          }
        }
      });
    } else {
      onStatusChange("idle");
      onError(
        "Seu navegador não suporta HLS automaticamente. Use um navegador compatível com hls.js.",
      );
    }

    return () => {
      video.pause();
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("stalled", handleStalled);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("error", handleVideoError);

      if (hls) {
        hls.destroy();
      }
    };
  }, [src, onError, onStatusChange]);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      muted
      playsInline
      className="aspect-video w-full bg-black"
    >
      Seu navegador não suporta reprodução de vídeo.
    </video>
  );
}
