"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) return null;

  const isMultiple = images.length > 1;

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const altText = isMultiple
    ? `${productName} - imagen ${currentIndex + 1}`
    : productName;

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square bg-surface2 rounded-lg overflow-hidden">
        <Image
          src={images[currentIndex]}
          alt={altText}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
          priority={currentIndex === 0}
        />
      </div>

      {isMultiple && (
        <>
          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={goPrev}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-canvas border border-hairline hover:bg-surfaceHover transition-colors"
              aria-label="Anterior imagen"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Dot indicators */}
            <div
              className="flex items-center gap-2"
              role="tablist"
              aria-label="Seleccionar imagen"
            >
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  role="tab"
                  aria-selected={index === currentIndex}
                  aria-label={`Imagen ${index + 1} de ${images.length}`}
                  type="button"
                  className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-primary scale-110"
                      : "bg-surface3 hover:bg-surfaceHover"
                  }`}
                >
                  <span
                    className={`block rounded-full transition-all ${
                      index === currentIndex
                        ? "w-3 h-3 bg-onPrimary"
                        : "w-2 h-2 bg-muted"
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              onClick={goNext}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-canvas border border-hairline hover:bg-surfaceHover transition-colors"
              aria-label="Siguiente imagen"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
