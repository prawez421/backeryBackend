
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Package,
  ImagePlus,
  Trash2,
  Save,
  ArrowLeft,
} from "lucide-react";

// ==========================================
// TYPES
// ==========================================

export interface ProductFormData {
  id?: number;
  product_name: string;
  category_id: number;
  sub_category_id: number;
  brand_id: number;
  unit_id: number;
  description: string;
  product_image?: string | null;
  product_images?: Array<
    string | {
      id?: number;
      image?: string;
      path?: string;
      url?: string;
    }
  >;
  status: "Active" | "Inactive";
}

export interface ProductOption {
  id: number;
  name: string;
  category_id?: number;
}

interface ProductFormModalProps {
  onClose: () => void;
  onSubmit: (formData: FormData) => void | Promise<void>;
  saving: boolean;
  initialData?: ProductFormData | null;
  categories: ProductOption[];
  subCategories: ProductOption[];
  brands: ProductOption[];
  units: ProductOption[];
  storageUrl?: string;
}

interface ExistingImage {
  key: string;
  path: string;
  url: string;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES = 10;

// ==========================================
// COMPONENT
// ==========================================

export default function ProductFormModal({
  onClose,
  onSubmit,
  saving,
  initialData,
  categories,
  subCategories,
  brands,
  units,
  storageUrl = "",
}: ProductFormModalProps) {

  // ==========================================
  // FORM STATES
  // ==========================================

  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [description, setDescription] = useState("");

  const [status, setStatus] = useState<"Active" | "Inactive">(
    "Active"
  );

  // ==========================================
  // IMAGE STATES
  // ==========================================

  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [removedImagePaths, setRemovedImagePaths] = useState<string[]>([]);

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (image?: string | null) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:") ||
      image.startsWith("blob:")
    ) {
      return image;
    }

    const baseUrl = storageUrl.replace(/\/$/, "");
    const imagePath = image.replace(/^\/+/, "");

    return baseUrl
      ? `${baseUrl}/${imagePath}`
      : `/${imagePath}`;
  };

  // ==========================================
  // NORMALIZE EXISTING IMAGES
  // ==========================================

  const normalizeExistingImages = (
    data?: ProductFormData | null
  ): ExistingImage[] => {

    if (!data) return [];

    const rawImages = data.product_images?.length
      ? data.product_images
      : data.product_image
        ? [data.product_image]
        : [];

    const normalized = rawImages
      .map((item, index) => {

        const path =
          typeof item === "string"
            ? item
            : item.path || item.image || item.url || "";

        if (!path) return null;

        return {
          key:
            typeof item === "string"
              ? `${path}-${index}`
              : `${item.id ?? index}-${path}`,
          path,
          url: getImageUrl(path),
        };
      })
      .filter(
        (item): item is ExistingImage => item !== null
      );

    // Ensure main image is included
    if (
      data.product_image &&
      !normalized.some(
        (image) => image.path === data.product_image
      )
    ) {
      normalized.unshift({
        key: `main-${data.product_image}`,
        path: data.product_image,
        url: getImageUrl(data.product_image),
      });
    }

    return normalized;
  };

  // ==========================================
  // INITIALIZE FORM
  // ==========================================

  useEffect(() => {

    setProductName(initialData?.product_name ?? "");

    setCategoryId(
      initialData?.category_id != null
        ? String(initialData.category_id)
        : ""
    );

    setSubCategoryId(
      initialData?.sub_category_id != null
        ? String(initialData.sub_category_id)
        : ""
    );

    setBrandId(
      initialData?.brand_id != null
        ? String(initialData.brand_id)
        : ""
    );

    setUnitId(
      initialData?.unit_id != null
        ? String(initialData.unit_id)
        : ""
    );

    setDescription(initialData?.description ?? "");

    setStatus(
      initialData?.status === "Inactive"
        ? "Inactive"
        : "Active"
    );

    setExistingImages(normalizeExistingImages(initialData));
    setSelectedImages([]);
    setRemovedImagePaths([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, storageUrl]);

  // ==========================================
  // CATEGORY-WISE SUBCATEGORIES
  // ==========================================

  const filteredSubCategories = useMemo(() => {

    if (!categoryId) return [];

    return subCategories.filter(
      (item) =>
        Number(item.category_id) === Number(categoryId)
    );

  }, [subCategories, categoryId]);

  // ==========================================
  // CATEGORY-WISE BRANDS
  // ==========================================

  const filteredBrands = useMemo(() => {

    if (!categoryId) return [];

    return brands.filter(
      (item) =>
        Number(item.category_id) === Number(categoryId)
    );

  }, [brands, categoryId]);

  // ==========================================
  // NEW IMAGE PREVIEWS
  // ==========================================

  const newImagePreviews = useMemo(
    () =>
      selectedImages.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [selectedImages]
  );

  useEffect(() => {
    return () => {
      newImagePreviews.forEach((item) => {
        URL.revokeObjectURL(item.url);
      });
    };
  }, [newImagePreviews]);

  // ==========================================
  // CATEGORY CHANGE
  // ==========================================

  const handleCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {

    const selectedCategory = e.target.value;

    setCategoryId(selectedCategory);

    // Reset dependent selections
    setSubCategoryId("");
    setBrandId("");
  };

  // ==========================================
  // IMAGE UPLOAD
  // ==========================================

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const files = Array.from(e.target.files ?? []);

    e.target.value = "";

    if (!files.length) return;

    const currentCount =
      existingImages.length + selectedImages.length;

    const availableSlots = MAX_IMAGES - currentCount;

    if (availableSlots <= 0) {
      alert(`You can upload maximum ${MAX_IMAGES} images.`);
      return;
    }

    const validFiles: File[] = [];

    for (const file of files) {

      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not a valid image.`);
        continue;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        alert(`${file.name} is larger than 5 MB.`);
        continue;
      }

      if (validFiles.length >= availableSlots) {
        alert(`You can upload maximum ${MAX_IMAGES} images in total.`);
        break;
      }

      validFiles.push(file);
    }

    if (validFiles.length) {
      setSelectedImages((prev) => [
        ...prev,
        ...validFiles,
      ]);
    }
  };

  // ==========================================
  // REMOVE EXISTING IMAGE
  // ==========================================

  const handleRemoveExistingImage = (
    image: ExistingImage
  ) => {

    setExistingImages((prev) =>
      prev.filter((item) => item.key !== image.key)
    );

    setRemovedImagePaths((prev) =>
      prev.includes(image.path)
        ? prev
        : [...prev, image.path]
    );
  };

  // ==========================================
  // REMOVE NEW IMAGE
  // ==========================================

  const handleRemoveNewImage = (index: number) => {

    setSelectedImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ==========================================
  // FORM SUBMIT
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    if (!productName.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (!categoryId) {
      alert("Please select category.");
      return;
    }

    if (!subCategoryId) {
      alert("Please select sub category.");
      return;
    }

    if (!brandId) {
      alert("Please select brand.");
      return;
    }

    if (!unitId) {
      alert("Please select unit.");
      return;
    }

    // Verify selected subcategory
    const validSubCategory = filteredSubCategories.some(
      (item) => item.id === Number(subCategoryId)
    );

    if (!validSubCategory) {
      alert("Please select a valid sub category.");
      return;
    }

    // Verify selected brand
    const validBrand = filteredBrands.some(
      (item) => item.id === Number(brandId)
    );

    if (!validBrand) {
      alert("Please select a valid brand.");
      return;
    }

    const data = new FormData();

    data.append("product_name", productName.trim());
    data.append("category_id", categoryId);
    data.append("sub_category_id", subCategoryId);
    data.append("brand_id", brandId);
    data.append("unit_id", unitId);
    data.append("description", description.trim());
    data.append("status", status);

    // Append new images
    selectedImages.forEach((image) => {
      data.append("product_images[]", image);
    });

    // Append removed image paths
    removedImagePaths.forEach((path) => {
      data.append("remove_product_images[]", path);
    });

    // Laravel multipart update
    if (initialData?.id) {
      data.append("_method", "POST");
    }

    await onSubmit(data);
  };

  const totalImageCount =
    existingImages.length + selectedImages.length;

  // ==========================================
  // JSX
  // ==========================================

  return (
    <div className="w-full space-y-5">

      {/* HEADER */}

      <div className="flex flex-col gap-4 rounded-2xl border border-amber-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
            <Package size={25} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {initialData ? "Edit Product" : "Add New Product"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {initialData
                ? "Update your product information."
                : "Enter your product information below."}
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
        >
          <ArrowLeft size={17} />
          Back to Products
        </button>

      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
      >

        {/* PRODUCT NAME */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Product Name <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product name"
            required
            disabled={saving}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          />
        </div>

        {/* CATEGORY AND SUBCATEGORY */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* CATEGORY */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>

            <select
              value={categoryId}
              onChange={handleCategoryChange}
              required
              disabled={saving}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            >
              <option value="">Select Category</option>

              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* SUBCATEGORY */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Sub Category <span className="text-red-500">*</span>
            </label>

            <select
              value={subCategoryId}
              onChange={(e) => setSubCategoryId(e.target.value)}
              required
              disabled={!categoryId || saving}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <option value="">Select Sub Category</option>

              {filteredSubCategories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            {categoryId && filteredSubCategories.length === 0 && (
              <p className="mt-1 text-xs text-red-500">
                No sub categories found for this category.
              </p>
            )}
          </div>

        </div>

        {/* BRAND AND UNIT */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* BRAND */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Brand <span className="text-red-500">*</span>
            </label>

            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              required
              disabled={!categoryId || saving}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <option value="">Select Brand</option>

              {filteredBrands.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            {categoryId && filteredBrands.length === 0 && (
              <p className="mt-1 text-xs text-red-500">
                No brands found for this category.
              </p>
            )}
          </div>

          {/* UNIT */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Unit <span className="text-red-500">*</span>
            </label>

            <select
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
              required
              disabled={saving}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            >
              <option value="">Select Unit</option>

              {units.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* PRODUCT IMAGES */}

        <div>

          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">

            <label className="block text-sm font-semibold text-gray-700">
              Product Images
            </label>

            <span className="text-xs text-gray-500">
              {totalImageCount}/{MAX_IMAGES} images selected
            </span>

          </div>

          <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4">

            {/* IMAGE PREVIEW */}

            {totalImageCount > 0 && (
              <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">

                {/* EXISTING IMAGES */}

                {existingImages.map((image, index) => (
                  <div
                    key={image.key}
                    className="relative min-w-0"
                  >

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt={`Existing product image ${index + 1}`}
                      className="h-36 w-full rounded-xl border border-gray-200 bg-white object-contain p-2"
                    />

                    <span className="mt-1 block truncate text-center text-xs text-gray-500">
                      Existing image {index + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(image)}
                      disabled={saving}
                      aria-label={`Remove existing image ${index + 1}`}
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white transition hover:bg-red-600 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>

                  </div>
                ))}

                {/* NEW IMAGES */}

                {newImagePreviews.map((preview, index) => (
                  <div
                    key={`${preview.url}-${index}`}
                    className="relative min-w-0"
                  >

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview.url}
                      alt={`New product image ${index + 1}`}
                      className="h-36 w-full rounded-xl border border-gray-200 bg-white object-contain p-2"
                    />

                    <span className="mt-1 block truncate text-center text-xs text-gray-500">
                      New image {index + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                      disabled={saving}
                      aria-label={`Remove new image ${index + 1}`}
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white transition hover:bg-red-600 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>

                  </div>
                ))}

              </div>
            )}

            {/* UPLOAD BUTTON */}

            <label
              className={`flex flex-col items-center justify-center py-6 ${
                totalImageCount >= MAX_IMAGES
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
            >

              <div className="mb-3 rounded-full bg-amber-100 p-4 text-amber-600">
                <ImagePlus size={28} />
              </div>

              <p className="text-sm font-semibold text-gray-700">
                Upload Product Images
              </p>

              <p className="mt-1 text-xs text-gray-400">
                PNG, JPG or WEBP (Maximum 5 MB per image, up to {MAX_IMAGES} images)
              </p>

              <span className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-white">
                Choose Images
              </span>

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                disabled={saving || totalImageCount >= MAX_IMAGES}
                onChange={handleImageChange}
                className="hidden"
              />

            </label>

          </div>
        </div>

        {/* DESCRIPTION */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Description
          </label>

          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description..."
            disabled={saving}
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          />
        </div>

        {/* STATUS */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "Active" | "Inactive")
            }
            disabled={saving}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* FORM ACTIONS */}

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={17} />

            {saving
              ? "Saving..."
              : initialData
                ? "Update Product"
                : "Save Product"}
          </button>

        </div>

      </form>
    </div>
  );
}
