import {
  Layers3,
  Loader2,
  MonitorPlay,
  Radio,
  RefreshCcw,
  Video,
  X,
} from "lucide-react";
import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";
import EmptyState from "../components/EmptyState";
import SectionHeader from "../components/SectionHeader";
import { listLiveVideos, listOnDemandVideos } from "../services/videoService";
import { parseApiError } from "../utils/parseApiError";

function getItemId(item) {
  return item?.id ?? item?._id ?? item?.liveId ?? item?.onDemandId ?? null;
}

function getDisplayTitle(item, fallback = "Sem título") {
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

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const baseUrl = getApiBaseUrl();
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function resolveThumbnailUrl(item) {
  const raw = item?.thumbnail_url || item?.thumbnailUrl || item?.thumb || "";
  return resolveAssetUrl(raw);
}

function resolveVideoUrl(item) {
  const raw = item?.video_url || item?.videoUrl || item?.url || "";
  return resolveAssetUrl(raw);
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const [liveVideos, setLiveVideos] = useState([]);
  const [onDemandVideos, setOnDemandVideos] = useState([]);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerItem, setViewerItem] = useState(null);
  const [viewerType, setViewerType] = useState(null);

  async function loadDashboardData(options = {}) {
    const isRefresh = options.isRefresh ?? false;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [lives, ondemand] = await Promise.all([
        listLiveVideos(),
        listOnDemandVideos(),
      ]);

      setLiveVideos(Array.isArray(lives) ? lives : []);
      setOnDemandVideos(Array.isArray(ondemand) ? ondemand : []);
    } catch (error) {
      setFeedback({
        type: "error",
        message: parseApiError(
          error,
          "Não foi possível carregar os conteúdos do painel.",
        ),
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  function handleWatch(item, type) {
    setViewerItem(item);
    setViewerType(type);
    setViewerOpen(true);
  }

  function handleCloseViewer() {
    setViewerOpen(false);
    setViewerItem(null);
    setViewerType(null);
  }

  const totalLives = liveVideos.length;
  const totalOnDemand = onDemandVideos.length;
  const totalCatalogo = totalLives + totalOnDemand;

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Painel"
        title="Dashboard de conteúdos"
        description="Visualize rapidamente as lives e os vídeos on-demand publicados no EduCast."
        action={
          <button
            type="button"
            onClick={() => loadDashboardData({ isRefresh: true })}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
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
          title="Lives ao vivo"
          value={loading ? "..." : String(totalLives).padStart(2, "0")}
          subtitle="Transmissões cadastradas"
          icon={<Radio className="h-5 w-5 text-blue-700" />}
        />

        <SummaryCard
          title="Vídeos on-demand"
          value={loading ? "..." : String(totalOnDemand).padStart(2, "0")}
          subtitle="Conteúdos gravados"
          icon={<Video className="h-5 w-5 text-blue-700" />}
        />

        <SummaryCard
          title="Total no catálogo"
          value={loading ? "..." : String(totalCatalogo).padStart(2, "0")}
          subtitle="Biblioteca geral"
          icon={<Layers3 className="h-5 w-5 text-blue-700" />}
        />
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-blue-600/10 p-3">
            <Radio className="h-5 w-5 text-blue-700" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
              Conteúdo ao vivo
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              Lives publicadas
            </h2>
          </div>
        </div>

        {loading ? (
          <LoadingBlock text="Carregando lives..." />
        ) : liveVideos.length ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {liveVideos.map((item) => {
              const id = getItemId(item);

              return (
                <VideoThumbCard
                  key={id}
                  item={item}
                  type="live"
                  onWatch={handleWatch}
                />
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Nenhuma live cadastrada"
            description="Quando você publicar uma live, ela aparecerá aqui no painel."
          />
        )}
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-blue-600/10 p-3">
            <MonitorPlay className="h-5 w-5 text-blue-700" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
              Conteúdo gravado
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              Vídeos on-demand
            </h2>
          </div>
        </div>

        {loading ? (
          <LoadingBlock text="Carregando vídeos on-demand..." />
        ) : onDemandVideos.length ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {onDemandVideos.map((item) => {
              const id = getItemId(item);

              return (
                <VideoThumbCard
                  key={id}
                  item={item}
                  type="ondemand"
                  onWatch={handleWatch}
                />
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Nenhum vídeo on-demand cadastrado"
            description="Quando você publicar um vídeo gravado, ele aparecerá aqui no painel."
          />
        )}
      </section>

      <VideoViewerModal
        open={viewerOpen}
        item={viewerItem}
        type={viewerType}
        onClose={handleCloseViewer}
      />
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

function LoadingBlock({ text }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <Loader2 className="h-4 w-4 animate-spin" />
      {text}
    </div>
  );
}

function VideoThumbCard({ item, type, onWatch }) {
  const id = getItemId(item);
  const thumbnail = resolveThumbnailUrl(item);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow">
      <div className="h-28 bg-slate-100">
        {thumbnail ? (
          <>
            <img
              src={thumbnail}
              alt={getDisplayTitle(item, "Vídeo")}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallback =
                  e.currentTarget.parentElement?.querySelector(
                    ".thumb-fallback",
                  );
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <div className="thumb-fallback hidden h-full w-full items-center justify-center text-xs text-slate-400">
              Sem thumbnail
            </div>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
            Sem thumbnail
          </div>
        )}
      </div>

      <div className="space-y-2 p-3">
        <div className="flex items-center justify-between gap-2">
          <span
            className={[
              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
              type === "live"
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-700",
            ].join(" ")}
          >
            {type === "live" ? "Live" : "On-demand"}
          </span>

          <span className="text-[10px] text-slate-500">#{id}</span>
        </div>

        <h3 className="line-clamp-2 text-xs font-semibold text-slate-900">
          {getDisplayTitle(item)}
        </h3>

        <p className="line-clamp-2 text-[11px] text-slate-500">
          {getDisplayDescription(item)}
        </p>
      </div>

      <div className="border-t border-slate-100 px-3 py-2">
        <button
          type="button"
          onClick={() => onWatch(item, type)}
          className="w-full rounded-full bg-blue-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-800"
        >
          Assistir
        </button>
      </div>
    </article>
  );
}

function VideoViewerModal({ open, item, type, onClose }) {
  if (!open || !item) return null;

  const title = getDisplayTitle(item, "Sem título");
  const description = getDisplayDescription(item, "Sem descrição informada.");
  const videoUrl = resolveVideoUrl(item);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div>
            <span
              className={[
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
                type === "live"
                  ? "bg-blue-600/10 text-blue-700"
                  : "bg-slate-100 text-slate-700",
              ].join(" ")}
            >
              {type === "live" ? (
                <Radio className="h-3.5 w-3.5" />
              ) : (
                <Video className="h-3.5 w-3.5" />
              )}
              {type === "live" ? "Live" : "On-demand"}
            </span>

            <h3 className="mt-3 text-lg font-semibold text-slate-900">
              {title}
            </h3>

            <p className="mt-1 text-sm text-slate-600">{description}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="bg-black">
          {type === "live" ? (
            <DashboardLivePlayer src={videoUrl} />
          ) : (
            <video
              controls
              autoPlay
              className="aspect-video w-full bg-black"
              src={videoUrl}
            >
              Seu navegador não suporta vídeo HTML5.
            </video>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardLivePlayer({ src }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return undefined;

    let hls;

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
    } else {
      video.src = src;
    }

    return () => {
      video.pause();
      if (hls) hls.destroy();
    };
  }, [src]);

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
