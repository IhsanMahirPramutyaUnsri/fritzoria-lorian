"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselProps {
  children: React.ReactNode[]
  autoPlay?: boolean
  interval?: number
}

export default function Carousel({ children, autoPlay = true, interval = 5000 }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const updateIndex = useCallback(
    (newIndex: number) => {
      if (newIndex < 0) {
        newIndex = children.length - 1
      } else if (newIndex >= children.length) {
        newIndex = 0
      }
      setActiveIndex(newIndex)
    },
    [children.length],
  )

  useEffect(() => {
    if (!autoPlay || isPaused) return

    const timer = setInterval(() => {
      updateIndex(activeIndex + 1)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, activeIndex, updateIndex, isPaused])

  return (
    <div
      className="relative overflow-hidden rounded-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {children.map((child, index) => (
          <div key={index} className="w-full flex-shrink-0">
            {child}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50"
        onClick={() => updateIndex(activeIndex - 1)}
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50"
        onClick={() => updateIndex(activeIndex + 1)}
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicator dots */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 space-x-2">
        {children.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === activeIndex ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
            onClick={() => updateIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  )
}
