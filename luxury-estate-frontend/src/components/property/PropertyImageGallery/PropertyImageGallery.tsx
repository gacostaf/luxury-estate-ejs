import { useState } from 'react'

import {
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Play,
} from 'lucide-react'

import type { PropertyGalleryImageDTO } from '@/types/property-gallery'

interface PropertyImageGalleryProps {
  images: PropertyGalleryImageDTO[]
}

export function PropertyImageGallery({
  images,
}: PropertyImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] =
    useState(0)

  const [fullscreen, setFullscreen] =
    useState(false)

  const currentImage = images[selectedIndex]

  function goNext() {
    setSelectedIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1,
    )
  }

  function goPrevious() {
    setSelectedIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1,
    )
  }

  return (
    <>
      <section className="relative bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Image */}
          <div className="relative overflow-hidden rounded-3xl">
            <img
              src={currentImage?.url}
              alt={currentImage?.alt}
              className="h-[650px] w-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            {/* Actions */}
            <div className="absolute right-6 top-6 flex items-center gap-3">
              <button
                onClick={() => setFullscreen(true)}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/60"
              >
                <Maximize2 className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goPrevious}
                  className="absolute left-6 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/60"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  onClick={goNext}
                  className="absolute right-6 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/60"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Video Badge */}
            {currentImage?.type === 'video' && (
              <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-5 py-3 text-white backdrop-blur-md">
                <Play className="h-5 w-5 fill-white" />

                <span className="text-sm font-semibold uppercase tracking-wide">
                  Video Tour
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedIndex(index)}
                className={`
                  relative shrink-0 overflow-hidden rounded-2xl border-2 transition-all
                  ${index === selectedIndex ? 'border-[#C6A15B] shadow-2xl' : 'border-transparent hover:border-white/30'}
                `}
              >
                <img
                  src={image.thumbnailUrl || image.url}
                  alt={image.alt}
                  className="h-24 w-40 object-cover"
                />

                <div className="absolute inset-0 bg-black/20" />

                {image.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-md">
                      <Play className="h-5 w-5 fill-white text-white" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Fullscreen Modal */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-6">
          <button
            onClick={() => setFullscreen(false)}
            className="absolute right-6 top-6 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur-md"
          >
            Close
          </button>

          <img
            src={currentImage?.url}
            alt={currentImage?.alt}
            className="max-h-full max-w-full rounded-3xl object-contain"
          />
        </div>
      )}
    </>
  )
}
