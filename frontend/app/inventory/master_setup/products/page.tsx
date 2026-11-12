
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import { toast } from "sonner";

import ProductHeader from "./components/ProductHeader";
import ProductStats from "./components/ProductStats";
import ProductTable from "./components/ProductTable";
import type { Product } from "./components/ProductTable";

import ProductFormModal, {
  type ProductOption,
} from "./components/ProductFormModal";

import ProductViewModal from "./components/ProductViewModal";

// ==========================================
// NORMALIZE MASTER DATA
// ==========================================

const normalizeOptions = (data: any[] = []): ProductOption[] => {
  return data
    .filter((item) => item && item.id != null)
    .map((item) => ({
      id: Number(item.id),

      name:
        item.name ||
        item.category_name ||
        item.sub_category_name ||
        item.brand_name ||
        item.unit_name ||
        "",

      category_id:
        item.category_id != null
          ? Number(item.category_id)
          : item.category?.id != null
            ? Number(item.category.id)
            : undefined,
    }));
};

// ==========================================
// NORMALIZE PRODUCT IMAGES
// ==========================================

const normalizeProductImages = (images: any): string[] => {
  if (!images) return [];

  let parsedImages = images;

  if (typeof parsedImages === "string") {
    try {
      parsedImages = JSON.parse(parsedImages);
    } catch {
      parsedImages = [parsedImages];
    }
  }

  if (!Array.isArray(parsedImages)) {
    parsedImages = [parsedImages];
  }

  return parsedImages
    .filter(
      (image): image is string =>
        typeof image === "string" && image.trim() !== ""
    )
    .map((image) => image.trim());
};

// ==========================================
// NORMALIZE PRODUCT DATA
// ==========================================

const normalizeProducts = (data: any[] = []): Product[] => {
  return data
    .filter((item) => item && item.id != null)
    .map((item) => {
      const mainImage =
        item.product_image || item.image || null;

      const multipleImages = normalizeProductImages(
        item.product_images
      );

      const allImages = Array.from(
        new Set(
          [mainImage, ...multipleImages].filter(
            (image): image is string =>
              typeof image === "string" && image.trim() !== ""
          )
        )
      );

      return {
        id: Number(item.id),

        product_name: item.product_name || item.name || "",

        category_id: Number(
          item.category_id ?? item.category?.id ?? 0
        ),

        sub_category_id: Number(
          item.sub_category_id ??
          item.sub_category?.id ??
          0
        ),

        brand_id: Number(
          item.brand_id ?? item.brand?.id ?? 0
        ),

        unit_id: Number(
          item.unit_id ?? item.unit?.id ?? 0
        ),

        category_name:
          item.category?.category_name ||
          item.category?.name ||
          item.category_name ||
          "",

        sub_category_name:
          item.subCategory?.sub_category_name ||
          item.sub_category?.sub_category_name ||
          item.sub_category?.name ||
          item.sub_category_name ||
          "",

        brand_name:
          item.brand?.brand_name ||
          item.brand?.name ||
          item.brand_name ||
          "",

        unit_name:
          item.unit?.unit_name ||
          item.unit?.name ||
          item.unit_name ||
          "",

        product_image: mainImage,

        product_images: allImages,

        description: item.description || "",

        status:
          item.status === "Inactive"
            ? "Inactive"
            : "Active",
      };
    });
};

// ==========================================
// PRODUCT PAGE
// ==========================================

export default function ProductPage() {
  // Product State
  const [products, setProducts] = useState<Product[]>([]);

  // Master Data States
  const [categories, setCategories] = useState<ProductOption[]>([]);
  const [subCategories, setSubCategories] = useState<ProductOption[]>([]);
  const [brands, setBrands] = useState<ProductOption[]>([]);
  const [units, setUnits] = useState<ProductOption[]>([]);

  // Loading States
  const [loading, setLoading] = useState(false);
  const [masterLoading, setMasterLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Search
  const [search, setSearch] = useState("");

  // Form Mode
  const [formMode, setFormMode] = useState<
    "list" | "add" | "edit"
  >("list");

  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // View Modal
  const [showViewModal, setShowViewModal] = useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  // Storage URL
  const storageUrl =
    process.env.NEXT_PUBLIC_STORAGE_URL || "";

  // ==========================================
  // FETCH PRODUCTS AND MASTER DATA
  // ==========================================

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setMasterLoading(true);

      // First API call: products and categories
      const response = await axiosInstance.get(
        ProjectApiList.productList,
        {
          params: {
            per_page: 1000,
          },
        }
      );

      const result = response.data;

      // Products
      const productData = result?.data?.data || [];

      setProducts(normalizeProducts(productData));

      // Initial master data
      const masters = result?.masters || {};

      const categoryOptions = normalizeOptions(
        masters.categories || []
      );

      setCategories(categoryOptions);

      setUnits(normalizeOptions(masters.units || []));

      // ======================================
      // FETCH CATEGORY-WISE MASTERS
      // ======================================

      const categoryMasterResponses = await Promise.all(
        categoryOptions.map(async (category) => {
          try {
            const categoryResponse = await axiosInstance.get(
              ProjectApiList.productList,
              {
                params: {
                  category_id: category.id,
                  per_page: 1,
                },
              }
            );

            return {
              subCategories: normalizeOptions(
                categoryResponse.data?.masters?.sub_categories || []
              ),

              brands: normalizeOptions(
                categoryResponse.data?.masters?.brands || []
              ),
            };
          } catch (error) {
            console.error(
              `Failed to fetch masters for category ${category.id}:`,
              error
            );

            return {
              subCategories: [],
              brands: [],
            };
          }
        })
      );

      // Combine all category-wise subcategories
      const allSubCategories = categoryMasterResponses.flatMap(
        (item) => item.subCategories
      );

      // Combine all category-wise brands
      const allBrands = categoryMasterResponses.flatMap(
        (item) => item.brands
      );

      // Remove duplicate records
      const uniqueSubCategories = Array.from(
        new Map(
          allSubCategories.map((item) => [item.id, item])
        ).values()
      );

      const uniqueBrands = Array.from(
        new Map(
          allBrands.map((item) => [item.id, item])
        ).values()
      );

      setSubCategories(uniqueSubCategories);
      setBrands(uniqueBrands);

    } catch (error: any) {
      console.error("Product Fetch Error:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to load product data"
      );

    } finally {
      setLoading(false);
      setMasterLoading(false);
    }
  }, []);

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  // ==========================================
  // SYNC SELECTED PRODUCT
  // ==========================================

  useEffect(() => {
    if (!selectedProduct) return;

    const updatedProduct = products.find(
      (item) => item.id === selectedProduct.id
    );

    if (
      updatedProduct &&
      updatedProduct !== selectedProduct
    ) {
      setSelectedProduct(updatedProduct);
    }
  }, [products, selectedProduct]);

  // ==========================================
  // SEARCH FILTER
  // ==========================================

  const filteredProducts = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return products;

    return products.filter((product) =>
      [
        product.product_name,
        product.category_name,
        product.sub_category_name,
        product.brand_name,
        product.unit_name,
        product.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [products, search]);

  // ==========================================
  // PRODUCT STATISTICS
  // ==========================================

  const activeProducts = products.filter(
    (item) => item.status === "Active"
  ).length;

  const inactiveProducts = products.filter(
    (item) => item.status === "Inactive"
  ).length;

  const totalBrands = new Set(
    products.map((item) => item.brand_id).filter(Boolean)
  ).size;

  // ==========================================
  // ADD PRODUCT
  // ==========================================

  const handleAdd = () => {
    setEditProduct(null);
    setFormMode("add");
  };

  // ==========================================
  // EDIT PRODUCT
  // ==========================================

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setFormMode("edit");
  };

  // ==========================================
  // CANCEL FORM
  // ==========================================

  const handleCancel = () => {
    setEditProduct(null);
    setFormMode("list");
  };

  // ==========================================
  // VIEW PRODUCT
  // ==========================================

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  // ==========================================
  // CREATE / UPDATE PRODUCT
  // ==========================================

  const handleSubmit = async (formData: FormData) => {
    try {
      setSaving(true);

      if (formMode === "edit" && editProduct) {
        await axiosInstance.post(
          ProjectApiList.productUpdate(editProduct.id),
          formData
        );

        toast.success("Product updated successfully");

      } else {
        await axiosInstance.post(
          ProjectApiList.productCreate,
          formData
        );

        toast.success("Product created successfully");
      }

      setEditProduct(null);
      setFormMode("list");

      await fetchProducts();

    } catch (error: any) {
      console.error("Product Save Error:", error);

      const errors = error.response?.data?.errors;

      const validationMessage = errors
        ? Object.values(errors).flat()[0]
        : null;

      toast.error(
        String(
          validationMessage ||
          error.response?.data?.message ||
          "Something went wrong"
        )
      );

    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await axiosInstance.delete(
        ProjectApiList.productDelete(id)
      );

      toast.success("Product deleted successfully");

      await fetchProducts();

    } catch (error: any) {
      console.error("Product Delete Error:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to delete product"
      );
    }
  };

  // ==========================================
  // REFRESH ALL DATA
  // ==========================================

  const handleRefresh = async () => {
    await fetchProducts();

    toast.success("Data refreshed successfully");
  };

  // ==========================================
  // MAIN JSX
  // ==========================================

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6">

      {formMode === "list" ? (
        <>
          {/* Product Header */}
          <ProductHeader
            onAdd={handleAdd}
            onRefresh={handleRefresh}
            loading={loading || masterLoading}
          />

          {/* Product Statistics */}
          <ProductStats
            totalProducts={products.length}
            activeProducts={activeProducts}
            inactiveProducts={inactiveProducts}
            totalBrands={totalBrands}
          />

          {/* Product Table */}
          <ProductTable
            products={filteredProducts}
            loading={loading}
            search={search}
            onSearch={setSearch}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      ) : (
        /* Add / Edit Product Form */
        <ProductFormModal
          key={
            formMode === "edit"
              ? `edit-${editProduct?.id}`
              : "add-product"
          }
          onClose={handleCancel}
          onSubmit={handleSubmit}
          saving={saving}
          initialData={editProduct}
          categories={categories}
          subCategories={subCategories}
          brands={brands}
          units={units}
          storageUrl={storageUrl}
        />
      )}

      {/* Product View Modal */}
      <ProductViewModal
        open={showViewModal}
        product={selectedProduct}
        onClose={() => {
          setShowViewModal(false);
          setSelectedProduct(null);
        }}
        storageUrl={storageUrl}
      />

    </div>
  );
}
