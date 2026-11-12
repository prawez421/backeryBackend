"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  X,
  Package,
  Tag,
  Layers,
  Award,
  Ruler,
  Image as ImageIcon,
  FileText,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type { Product } from "./ProductTable";

// ==========================================
// TYPES & INTERFACES
// ==========================================

type ProductWithImages = Product & {
  product_image?: string | null;
  product_images?: string[] | string | null;
};

interface ProductViewModalProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  storageUrl?: string;
}

// ==========================================
// COMPONENT
// ==========================================

export default function ProductViewModal({
  open,
  product,
  onClose,
  storageUrl = "",
}: ProductViewModalProps) {
  const [selectedImage, setSelectedImage] = useState("");
  const [imageErrors, setImageErrors] = useState<string[]>([]);

  const productData = product as ProductWithImages | null;

  // ==========================================
  // IMAGE URL RESOLVER
  // ==========================================

  const getImageUrl = (image?: string | null) => {
    if (!image || typeof image !== "string") return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:") ||
      image.startsWith("blob:")
    ) {
      return image;
    }

    const baseUrl = storageUrl.replace(/\/+$/, "");
    const imagePath = image.replace(/^\/+/, "");

    return baseUrl ? `${baseUrl}/${imagePath}` : `/${imagePath}`;
  };

  // ==========================================
  // NORMALIZE PRODUCT IMAGES
  // ==========================================

  const productImages = useMemo(() => {
    if (!productData) return [];

    let galleryImages: string[] = [];
    const images = productData.product_images;

    if (Array.isArray(images)) {
      galleryImages = images;
    } else if (typeof images === "string" && images.trim()) {
      try {
        const parsed = JSON.parse(images);
        galleryImages = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        galleryImages = [images];
      }
    }

    const allImages = [productData.product_image, ...galleryImages];

    return Array.from(
      new Set(
        allImages
          .filter(
            (image): image is string =>
              typeof image === "string" && image.trim() !== ""
          )
          .map((image) => getImageUrl(image))
          .filter(Boolean)
      )
    );
  }, [
    productData?.id,
    productData?.product_image,
    productData?.product_images,
    storageUrl,
  ]);

  // ==========================================
  // AVAILABLE IMAGES (EXCLUDING ERRORS)
  // ==========================================

  const availableImages = useMemo(() => {
    return productImages.filter((image) => !imageErrors.includes(image));
  }, [productImages, imageErrors]);

  // ==========================================
  // EFFECTS: RESET & FALLBACKS
  // ==========================================

  useEffect(() => {
    setImageErrors([]);
    setSelectedImage(productImages[0] || "");
  }, [productImages]);

  useEffect(() => {
    if (selectedImage && !availableImages.includes(selectedImage)) {
      setSelectedImage(availableImages[0] || "");
    }
    if (!selectedImage && availableImages.length > 0) {
      setSelectedImage(availableImages[0]);
    }
  }, [availableImages, selectedImage]);

  // Escape key listener
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  // ==========================================
  // IMAGE NAVIGATION & ERROR HANDLING
  // ==========================================

  const currentImageIndex = availableImages.indexOf(selectedImage);

  const showPreviousImage = () => {
    if (!availableImages.length) return;
    const previousIndex =
      currentImageIndex <= 0 ? availableImages.length - 1 : currentImageIndex - 1;
    setSelectedImage(availableImages[previousIndex]);
  };

  const showNextImage = () => {
    if (!availableImages.length) return;
    const nextIndex =
      currentImageIndex >= availableImages.length - 1 ? 0 : currentImageIndex + 1;
    setSelectedImage(availableImages[nextIndex]);
  };

  const handleImageError = (image: string) => {
    setImageErrors((prev) => (prev.includes(image) ? prev : [...prev, image]));
  };

  // ==========================================
  // GUARD CLAUSE
  // ==========================================

  if (!open || !productData) return null;

  const isActive = productData?.status === "Active";

  const detailItems = [
    { label: "Category", value: productData.category_name || "—", icon: Tag },
    { label: "Sub Category", value: productData.sub_category_name || "—", icon: Layers },
    { label: "Brand", value: productData.brand_name || "—", icon: Award },
    { label: "Unit", value: productData.unit_name || "—", icon: Ruler },
  ];

  // ==========================================
  // RENDER JSX
  // ==========================================

  return (
    <div
      className="fixed inset-0 z-[100] h-screen w-screen overflow-hidden bg-slate-950/80 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-view-title"
        className="flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl"
      >
        {/* HEADER */}
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Package size={22} />
            </div>
            <div>
              <h2 id="product-view-title" className="text-lg font-bold text-slate-900">
                Product Details
              </h2>
              <p className="text-xs text-slate-500">
                Complete product specifications and gallery
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </header>

        {/* MAIN BODY */}
        <main className="min-h-0 flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6">
          <div className="mx-auto max-w-[1400px] grid grid-cols-1 gap-6 xl:grid-cols-2">
            
            {/* LEFT COLUMN: IMAGES */}
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Gallery</h3>
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                  {availableImages.length} Images
                </span>
              </div>

              {/* Main Preview Box */}
              <div className="relative flex h-[300px] w-full items-center justify-center overflow-hidden rounded-xl bg-slate-100 sm:h-[380px]">
                {selectedImage ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      key={selectedImage}
                      src={selectedImage}
                      alt={productData.product_name || "Product image"}
                      className="max-h-full max-w-full object-contain"
                      onError={() => handleImageError(selectedImage)}
                    />

                    {/* Counter Badge */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                      {currentImageIndex + 1} / {availableImages.length}
                    </div>

                    {/* Navigation Buttons */}
                    {availableImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={showPreviousImage}
                          aria-label="Previous image"
                          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md transition hover:bg-indigo-600 hover:text-white"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          type="button"
                          onClick={showNextImage}
                          aria-label="Next image"
                          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md transition hover:bg-indigo-600 hover:text-white"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <ImageIcon size={36} strokeWidth={1.5} />
                    <p className="text-xs font-medium">No image available</p>
                  </div>
                )}
              </div>

              {/* Thumbnails Row */}
              {availableImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {availableImages.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-slate-50 transition ${
                        selectedImage === image
                          ? "border-indigo-600 ring-2 ring-indigo-100"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-full w-full object-cover"
                        onError={() => handleImageError(image)}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: DETAILS */}
            <div className="flex flex-col gap-5">
              
              {/* Core Information Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {productData.status || "Unknown"}
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    ID: #{productData.id}
                  </span>
                </div>

                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  {productData.product_name || "Unnamed Product"}
                </h1>

                {/* Attribute Grid */}
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {detailItems.map(({ label, value, icon: Icon }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                          {label}
                        </p>
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-3 flex items-center gap-2.5 text-slate-900">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <FileText size={18} />
                  </div>
                  <h3 className="font-semibold text-sm">Description</h3>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                    {productData.description?.trim() || "No description provided."}
                  </p>
                </div>
              </div>

            </div>

          </div>
        </main>

        {/* FOOTER */}
        <footer className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-white px-6 py-4 shadow-sm">
          <p className="text-xs text-slate-400">
            Product ID: #{productData.id}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            Close
          </button>
        </footer>
      </section>
    </div>
  );
}