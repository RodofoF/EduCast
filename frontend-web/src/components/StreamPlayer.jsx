import Hls from "hls.js";
import { AlertCircle, LoaderCircle, Radio } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export default function StreamPlayer({ item }) {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const isHls = useMemo(
    () => item?.url?.toLowerCase().includes(".m3u8"),
    [item?.url],
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !item?.url) return;

    let hls;

    setLoading(true);
    setHasError(false);

    const onLoadedData = () => setLoading(false);
    const onWaiting = () => setLoading(true);
    const onPlaying = () => setLoading(false);
    const onError = () => {
      setHasError(true);
      setLoading(false);
    };

    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("error", onError);

    if (isHls) {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = item.url;
      } else if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(item.url);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data?.fatal) {
            setHasError(true);
            setLoading(false);
          }
        });
      } else {
        setHasError(true);
        setLoading(false);
      }
    } else {
      video.src = item.url;
    }

    video.load();

    return () => {
      video.pause();
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("error", onError);

      if (hls) {
        hls.destroy();
      }
    };
  }, [item, isHls]);

  if (!item) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="aspect-video w-full bg-black">
        <video
          ref={videoRef}
          controls
          autoPlay
          playsInline
          className="h-full w-full bg-black object-cover"
        />
      </div>

      {loading ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-[2px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Carregando transmissão...
          </div>
        </div>
      ) : null}

      {hasError ? (
        <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-blue-200 bg-blue-600/10 p-4 text-sm text-blue-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4" />
            <div>
              <p className="font-semibold">
                Não foi possível reproduzir o vídeo.
              </p>
              <p className="mt-1 text-blue-700/80">
                Verifique se o servidor de streaming está ativo e se a URL do
                `VITE_STREAM_BASE_URL` está correta.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold tracking-[0.18em] text-blue-700 uppercase border border-slate-200">
            {item.type === "LIVE" ? "Transmissão" : "Videoaula"}
          </span>

          {item.type === "LIVE" ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              <Radio className="h-3.5 w-3.5" />
              AO VIVO
            </span>
          ) : null}

          <span className="text-xs text-slate-600">{item.duration}</span>
        </div>
      </div>
    </div>
  );
}
