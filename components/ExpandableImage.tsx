"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Maximize2, X } from "lucide-react";

const ZOOM_LEVEL = 2.5;
const LENS_SIZE = 140;

function ImageZoomLightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [zooming, setZooming] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [lens, setLens] = useState({ left: 0, top: 0, visible: false });

  const updateZoom = useCallback((clientX: number, clientY: number) => {
    const img = imgRef.current;
    if (!img) return;

    const rect = img.getBoundingClientRect();
    const inside =
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom;

    if (!inside) {
      setLens((l) => ({ ...l, visible: false }));
      setZooming(false);
      return;
    }

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    const half = LENS_SIZE / 2;
    const lensLeft = Math.max(
      0,
      Math.min(rect.width - LENS_SIZE, (clampedX / 100) * rect.width - half),
    );
    const lensTop = Math.max(
      0,
      Math.min(rect.height - LENS_SIZE, (clampedY / 100) * rect.height - half),
    );

    setPos({ x: clampedX, y: clampedY });
    setLens({ left: lensLeft, top: lensTop, visible: true });
    setZooming(true);
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    updateZoom(e.clientX, e.clientY);
  };

  const handlePointerLeave = () => {
    setZooming(false);
    setLens((l) => ({ ...l, visible: false }));
  };

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto overscroll-y-contain bg-black/90"
      style={{ WebkitOverflowScrolling: "touch" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <button
        type="button"
        onClick={onClose}
        className="fixed top-4 right-4 z-[10001] rounded-full bg-black/60 p-2.5 text-white shadow-lg transition-colors hover:bg-black/80"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      <div
        className="relative z-[10000] mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 py-20 sm:px-8 sm:py-24"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[11px] font-medium tracking-wide text-white/60">
          <span className="hidden lg:inline">Hover over the image to zoom</span>
          <span className="lg:hidden">Drag over the image to zoom</span>
        </p>

        <div className="flex w-full flex-col items-stretch gap-4 lg:flex-row">
          <div
            className="flex min-w-0 flex-1 items-center justify-center"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onPointerEnter={(e) => updateZoom(e.clientX, e.clientY)}
          >
            <div className="relative inline-block max-w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={src}
                alt={alt}
                className="block h-auto max-h-[min(70vh,640px)] w-auto max-w-full touch-none rounded-lg object-contain shadow-2xl select-none"
                draggable={false}
              />
              {lens.visible && (
                <div
                  className="pointer-events-none absolute hidden border-2 border-white/90 bg-white/15 shadow-[0_0_0_1px_rgba(0,0,0,0.3)] lg:block"
                  style={{
                    width: LENS_SIZE,
                    height: LENS_SIZE,
                    left: lens.left,
                    top: lens.top,
                  }}
                  aria-hidden
                />
              )}
            </div>
          </div>

          <div
            className={`min-h-[200px] flex-1 overflow-hidden rounded-lg border border-white/20 bg-black shadow-2xl transition-opacity lg:min-h-[min(70vh,640px)] ${
              zooming ? "opacity-100" : "opacity-40"
            }`}
            aria-hidden
          >
            <div
              className="h-full min-h-[200px] w-full lg:min-h-[min(70vh,640px)]"
              style={{
                backgroundImage: `url(${src})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${ZOOM_LEVEL * 100}%`,
                backgroundPosition: `${pos.x}% ${pos.y}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExpandableImage({
  src,
  alt = "Reference image",
  className = "",
  thumbClassName = "",
}: {
  src: string;
  alt?: string;
  className?: string;
  thumbClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const lightbox = open ? (
    <ImageZoomLightbox src={src} alt={alt} onClose={() => setOpen(false)} />
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group relative block h-52 w-full overflow-hidden rounded-2xl border border-teal/10 bg-surface-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 dark:focus-visible:ring-offset-canvas sm:h-64 ${className}`}
        aria-label="Expand image"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full object-contain p-3 ${thumbClassName}`}
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/25">
          <span className="flex items-center gap-1.5 rounded-lg bg-black/70 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
            <Maximize2 className="h-3.5 w-3.5" />
            Click to expand
          </span>
        </span>
      </button>

      {mounted && lightbox ? createPortal(lightbox, document.body) : null}
    </>
  );
}
