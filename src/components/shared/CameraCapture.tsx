import { useEffect, useRef, useState } from "react";
import { X, RefreshCw, Camera as CameraIcon } from "lucide-react";

interface CameraCaptureProps {
  open: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
}

const CameraCapture = ({ open, onClose, onCapture }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const start = async () => {
      setError(null);
      setReady(false);
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Il tuo browser non supporta l'accesso alla fotocamera.");
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 1280 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
          setReady(true);
        }
      } catch (err: any) {
        console.warn("Camera error:", err);
        const name = err?.name || "";
        if (name === "NotAllowedError" || name === "SecurityError") {
          setError("Permesso fotocamera negato. Abilita l'accesso dalle impostazioni del browser.");
        } else if (name === "NotFoundError" || name === "OverconstrainedError") {
          setError("Nessuna fotocamera disponibile su questo dispositivo.");
        } else {
          setError(err?.message || "Impossibile aprire la fotocamera.");
        }
      }
    };

    start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [open, facingMode]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;
    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) return;
    const size = Math.min(w, h);
    const sx = (w - size) / 2;
    const sy = (h - size) / 2;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (facingMode === "user") {
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    onCapture(dataUrl);
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black overflow-hidden" style={{ height: "100dvh" }}>
      <div className="flex items-center justify-end p-3 shrink-0">
        <button
          type="button"
          onClick={onClose}
          aria-label="Chiudi"
          className="text-white/80 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="relative flex-1 min-h-0 w-full overflow-hidden bg-black">
        <div className="absolute inset-0 flex items-center justify-center p-3">
          <div className="relative aspect-square h-full max-h-full w-auto max-w-full overflow-hidden border border-white/20 bg-black">
          {error ? (
            <div className="flex h-full w-full items-center justify-center p-6 text-center">
              <p className="font-body text-sm text-white/80">{error}</p>
            </div>
          ) : (
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`h-full w-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
            />
          )}
        </div>

        <div className="flex w-full items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setFacingMode((m) => (m === "user" ? "environment" : "user"))}
            disabled={!!error}
            className="flex items-center gap-2 border border-white/30 px-4 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-white/10 disabled:opacity-40"
          >
            <RefreshCw className="h-4 w-4" /> Cambia
          </button>
          <button
            type="button"
            onClick={handleCapture}
            disabled={!ready || !!error}
            className="flex flex-1 items-center justify-center gap-2 bg-white px-6 py-3 font-body text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-white/90 disabled:opacity-40"
          >
            <CameraIcon className="h-4 w-4" /> Scatta
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
