"use client"

import { useState } from "react"
import Image from "next/image"

interface BookDisplayProps {
  id: string
  title: string
  author: string
  price: number
  coverImage: string
  discountPrice?: number
}

export default function BookDisplay({ id, title, author, price, coverImage, discountPrice }: BookDisplayProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-lg border bg-white transition-all hover:shadow-md h-full max-w-xs mx-auto w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="group-hover:opacity-95 transition-all duration-300 p-4 flex items-center justify-center bg-white rounded-lg overflow-hidden">
        <div
          className={`relative w-full aspect-[2/3] overflow-hidden rounded-md shadow-md transition-all duration-300 group-hover:shadow-lg ${isHovered ? "transform rotate-y-30" : ""}`}
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.5s",
            transform: isHovered ? "rotate3d(0, 1, 0, 30deg)" : "none",
          }}
        >
          <div
            className="absolute top-0 left-0 w-[10px] h-full bg-black/10"
            style={{
              transform: "translateX(-5px) rotateY(-90deg)",
              transformOrigin: "right",
            }}
          ></div>
          <div
            className="absolute top-[2px] bottom-[2px] left-0 w-[10px] bg-white"
            style={{
              transform: "translateX(-3px) rotateY(-90deg)",
              transformOrigin: "right",
              zIndex: -1,
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-0"></div>
          <Image
            src={coverImage || "/placeholder.svg"}
            alt={title}
            fill
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
          />
          <div className="absolute inset-0 border border-black/5 rounded-md pointer-events-none"></div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4 pt-2">
        <h3 className="line-clamp-1 text-base font-medium">{title}</h3>
        <p className="line-clamp-1 text-sm text-muted-foreground">{author}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <div>
            {discountPrice ? (
              <div className="flex flex-col">
                <p className="text-base font-semibold">Rp{discountPrice.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground line-through">Rp{price.toLocaleString()}</p>
              </div>
            ) : (
              <p className="text-base font-semibold">Rp{price.toLocaleString()}</p>
            )}
          </div>
          <button className="h-8 rounded-full px-3 bg-primary text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <span className="sr-only">Tambah ke keranjang</span>
          </button>
        </div>
      </div>
    </div>
  )
}
