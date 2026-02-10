import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";


interface BeforeAfterSectionProps {
  beforeImage: string;
  afterImage: string;
  name: string;
}

const BeforeAfterSection = ({ beforeImage, afterImage, name }: BeforeAfterSectionProps) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateSlider(e.clientX);
  }, [updateSlider]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updateSlider(e.clientX);
  }, [updateSlider]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mx-auto max-w-2xl px-4 py-12"
    >
      {/* Section header */}
      <div className="mb-8 text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            Il tuo potenziale, {name}
          </h2>
        </div>
        <p className="mx-auto max-w-md font-body text-sm text-muted-foreground">
          Trascina il cursore per visualizzare come potrebbe migliorare la tua pelle seguendo la routine personalizzata
        </p>
      </div>

      {/* Before/After Slider */}
      <div
        ref={containerRef}
        className="relative mx-auto aspect-square max-w-md cursor-col-resize select-none overflow-hidden rounded-3xl border-2 border-gold/20 shadow-gold-lg"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: "none" }}
      >
        {/* After image (full background) */}
        <img
          src={afterImage}
          alt="Dopo la routine"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        {/* Before image (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={beforeImage}
            alt="Prima della routine"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ width: `${(100 / sliderPos) * 100}%`, maxWidth: "none" }}
            draggable={false}
          />
        </div>

        {/* Slider line */}
        <div
          className="absolute top-0 bottom-0 z-10"
          style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
        >
          <div className="h-full w-0.5 bg-white/80 shadow-lg" />
          {/* Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/90 bg-gradient-gold shadow-gold">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M5 3L2 8L5 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11 3L14 8L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 z-20 rounded-full bg-foreground/70 px-3 py-1 backdrop-blur-sm">
          <span className="font-body text-xs font-medium text-background">Prima</span>
        </div>
        <div className="absolute top-4 right-4 z-20 rounded-full bg-gold/80 px-3 py-1 backdrop-blur-sm">
          <span className="font-body text-xs font-medium text-primary-foreground">Dopo</span>
        </div>
      </div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mx-auto mt-6 max-w-md"
      >
        <div className="flex items-start gap-3 rounded-xl border border-gold/20 bg-card p-4">
          <div>
            <p className="font-body text-xs font-medium text-foreground">
              Immagine a scopo illustrativo
            </p>
            <p className="mt-1 font-body text-[11px] leading-relaxed text-muted-foreground">
              La simulazione "dopo" è generata dall'intelligenza artificiale a titolo esemplificativo e non rappresenta 
              una garanzia di risultato. I risultati reali possono variare in base al tipo di pelle, alla costanza 
              nell'applicazione e ad altri fattori individuali. Consulta sempre un dermatologo per esigenze specifiche.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default BeforeAfterSection;
