"use client";

import { useEffect, useRef, useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import { STORAGE_URL } from "@/app/api/BaseUrls";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Tags,
  CheckCircle,
  XCircle,
  Package,
  Eye,
  ImagePlus,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: number;
  category_name: string;
  status?: "Active" | "Inactive";
}

interface Brand {
  id: number;
  category_id: number;
  category?: Category | null;
  brand_name: string;
  brand_logo: string | null;
  description: string | null;
  status: "Active" | "Inactive";
}

export default function BrandPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  // FORM STATES
  const [categoryId, setCategoryId] = useState("");
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  const [brandLogo, setBrandLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [removeLogo, setRemoveLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // IMAGE URL
  const getImageUrl = (path?: string | null) => {
    if (!path) return "";

    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    return `${STORAGE_URL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
  };

  // NORMALIZE BRAND RESPONSE
  const normalizeBrand = (item: any): Brand => ({
    id: Number(item.id),
    category_id: Number(item.category_id),
    category: item.category
      ? {
          id: Number(item.category.id),
          category_name: item.category.category_name || "",
          status: item.category.status,
        }
      : null,
    brand_name: item.brand_name || "",
    brand_logo: item.brand_logo || null,
    description: item.description || "",
    status: item.status === "Inactive" ? "Inactive" : "Active",
  });

  // FETCH BRANDS + CATEGORIES FROM BRAND CONTROLLER
  const fetchBrands = async () => {
    try {
      setLoading(true);
      setCategoriesLoading(true);

      const response = await axiosInstance.get(
        ProjectApiList.brandList,
        {
          params: { per_page: 1000 },
        }
      );

      // BrandController returns categories separately from paginated brands.
      const categoryRows = response.data?.categories;
      setCategories(
        Array.isArray(categoryRows)
          ? categoryRows
              .map((item: any) => ({
                id: Number(item.id),
                category_name: item.category_name || "",
                status: item.status,
              }))
              .filter((item: Category) => item.id && item.category_name)
          : []
      );

      // Laravel paginator response: response.data.data.data
      const result = response.data?.data;
      const brandRows = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : [];

      setBrands(brandRows.map(normalizeBrand));
    } catch (error: any) {
      console.error("Brand List Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load brands and categories. Please try again."
      );
    } finally {
      setLoading(false);
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Revoke temporary preview URLs when the preview changes or component unmounts.
  useEffect(() => {
    if (!logoPreview.startsWith("blob:")) return;

    return () => {
      URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  // RESET FORM
  const resetForm = () => {
    setLogoPreview("");
    setCategoryId("");
    setBrandName("");
    setDescription("");
    setStatus("Active");

    setBrandLogo(null);
    setRemoveLogo(false);
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }

    setEditId(null);
    setShowModal(false);
  };

  // OPEN ADD MODAL
  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  // OPEN EDIT MODAL
  const openEditModal = (item: Brand) => {
    setEditId(item.id);
    setCategoryId(String(item.category_id || item.category?.id || ""));
    setBrandName(item.brand_name);
    setDescription(item.description || "");
    setStatus(item.status);

    setBrandLogo(null);
    setLogoPreview(getImageUrl(item.brand_logo));
    setRemoveLogo(false);
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }

    setShowModal(true);
  };

  // OPEN VIEW MODAL
  const openViewModal = (item: Brand) => {
    setSelectedBrand(item);
    setViewModal(true);
  };

  // HANDLE IMAGE SELECT
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Reset input so the same file can be selected again later.
    e.target.value = "";

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must not exceed 2 MB.");
      return;
    }

    setLogoPreview(URL.createObjectURL(file));
    setBrandLogo(file);
    setRemoveLogo(false);
  };

  // REMOVE SELECTED LOGO
  const handleRemoveLogo = () => {
    setLogoPreview("");
    setBrandLogo(null);
    setRemoveLogo(true);
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  // ADD / UPDATE BRAND
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const cleanName = brandName.trim();

    if (!categoryId) {
      toast.error("Please select a category.");
      return;
    }

    if (!cleanName) {
      toast.error("Brand name is required");
      return;
    }

    // FRONTEND DUPLICATE CHECK
    const duplicate = brands.some(
      (item) =>
        (item.brand_name || "").trim().toLowerCase() === cleanName.toLowerCase() &&
        item.id !== editId
    );

    if (duplicate) {
      toast.error("Brand already exists");
      return;
    }

    const formData = new FormData();

    formData.append("category_id", categoryId);
    formData.append("brand_name", cleanName);
    formData.append("description", description.trim());
    formData.append("status", status);

    if (brandLogo) {
      formData.append("brand_logo", brandLogo);
    }

    if (editId !== null) {
      formData.append("remove_logo", removeLogo ? "1" : "0");
    }

    try {
      setSaving(true);

      if (editId !== null) {
        // Laravel BrandController update route uses POST
        await axiosInstance.post(
          ProjectApiList.brandUpdate(editId),
          formData
        );

        toast.success("Brand updated successfully");
      } else {
        await axiosInstance.post(
          ProjectApiList.brandCreate,
          formData
        );

        toast.success("Brand added successfully");
      }

      resetForm();
      await fetchBrands();
    } catch (error: any) {
      console.error("Save Brand Error:", error);

      const validationErrors = error.response?.data?.errors;
      const validationMessage = validationErrors
        ? Object.values(validationErrors).flat().join(" ")
        : null;

      toast.error(
        String(
          validationMessage ||
            error.response?.data?.message ||
            "Failed to save brand. Please try again."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  // DELETE BRAND
  const deleteBrand = async (id: number) => {
    const item = brands.find((brand) => brand.id === id);

    if (!item) return;

    if (
      !window.confirm(
        `Are you sure you want to delete ${item.brand_name}?`
      )
    ) {
      return;
    }

    try {
      await axiosInstance.delete(
        ProjectApiList.brandDelete(id)
      );

      toast.success("Brand deleted successfully");

      await fetchBrands();
    } catch (error: any) {
      console.error("Delete Brand Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to delete brand. Please try again."
      );
    }
  };

  // SEARCH
  const filteredData = brands.filter((item) => {
    const searchText = search.toLowerCase();

    return (
      (item.brand_name || "").toLowerCase().includes(searchText) ||
      (item.category?.category_name || "").toLowerCase().includes(searchText)
    );
  });

  // STATISTICS
  const stats = [
    {
      title: "Total Brands",
      value: brands.length,
      icon: Tags,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Active Brands",
      value: brands.filter((item) => item.status === "Active").length,
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Inactive Brands",
      value: brands.filter((item) => item.status === "Inactive").length,
      icon: XCircle,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="bg-amber-100 p-2 rounded-lg">
              <Package size={23} className="text-amber-700" />
            </div>

            <h1 className="text-2xl font-bold text-gray-800">
              Brand Master
            </h1>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Manage your bakery product brands.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm"
        >
          <Plus size={19} />
          Add Brand
        </button>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {stat.title}
                  </p>

                  <h2 className="text-2xl font-bold text-gray-800 mt-2">
                    {stat.value}
                  </h2>
                </div>

                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* BRAND TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">

        {/* SEARCH */}
        <div className="p-4 md:p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Brand List
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              View and manage all product brands.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-4 font-semibold">#</th>
                <th className="px-5 py-4 font-semibold">Logo</th>
                <th className="px-5 py-4 font-semibold">Category</th>
                <th className="px-5 py-4 font-semibold">Brand Name</th>
                <th className="px-5 py-4 font-semibold">Description</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-gray-500"
                  >
                    Loading brands...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-amber-50/30"
                  >
                    <td className="px-5 py-4 text-gray-500">
                      {index + 1}
                    </td>

                   
                    <td className="px-5 py-4">
                      {item.brand_logo ? (
                        <img
                          src={getImageUrl(item.brand_logo)}
                          alt={item.brand_name}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-100">
                          <Tags size={20} className="text-amber-500" />
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {item.category?.category_name || "-"}
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-semibold text-gray-800">
                        {item.brand_name}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-500 max-w-[200px]">
                      <p className="truncate">
                        {item.description || "-"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => openViewModal(item)}
                          title="View"
                          className="p-2 rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          title="Edit"
                          className="p-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteBrand(item.id)}
                          title="Delete"
                          className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-gray-500"
                  >
                    <Tags
                      size={30}
                      className="mx-auto mb-2 text-gray-300"
                    />
                    No brands found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="px-5 py-4 border-t text-sm text-gray-500">
          Showing {filteredData.length} of {brands.length} brands
        </div>
      </div>

      {/* VIEW BRAND MODAL */}
      {viewModal && selectedBrand && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden">

            <div className="flex justify-between items-center p-5 border-b">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Brand Details
                </h3>

               
              </div>

              <button
                type="button"
                onClick={() => setViewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">

              {/* BRAND LOGO */}
              <div className="flex justify-center">
                {selectedBrand.brand_logo ? (
                  <img
                    src={getImageUrl(selectedBrand.brand_logo)}
                    alt={selectedBrand.brand_name}
                    className="w-28 h-28 rounded-xl object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
                    <Tags size={38} className="text-amber-500" />
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Category
                </p>
                <p className="font-medium text-gray-800">
                  {selectedBrand.category?.category_name || "Category not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Brand Name
                </p>
                <p className="font-semibold text-gray-800">
                  {selectedBrand.brand_name}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Description
                </p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedBrand.description || "No description available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Status
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    selectedBrand.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedBrand.status}
                </span>
              </div>

            </div>

            <div className="px-5 py-3 bg-gray-50 border-t flex justify-end">
              <button
                type="button"
                onClick={() => setViewModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-xl rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">

            {/* MODAL HEADER */}
            <div className="flex justify-between items-center p-5 border-b">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {editId !== null ? "Edit Brand" : "Add New Brand"}
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Enter brand information below.
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-5 space-y-5"
            >

              {/* CATEGORY */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>

                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  disabled={categoriesLoading}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100"
                >
                  <option value="">
                    {categoriesLoading ? "Loading categories..." : "Select Category"}
                  </option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.category_name}
                      {category.status === "Inactive" ? " (Inactive)" : ""}
                    </option>
                  ))}
                </select>

                {!categoriesLoading && categories.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    No categories found. Please create a category first.
                  </p>
                )}
              </div>

              {/* BRAND LOGO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Logo
                </label>

                <div className="flex flex-col sm:flex-row items-start gap-4">

                  {/* IMAGE PREVIEW */}
                  <div className="w-28 h-28 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Brand preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <ImagePlus size={28} className="mx-auto mb-1" />
                        <span className="text-xs">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="inline-flex items-center gap-2 cursor-pointer bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-4 py-2 rounded-lg text-sm font-medium">
                      <Upload size={16} />
                      Choose Logo

                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>

                    <p className="text-xs text-gray-500">
                      JPG, JPEG, PNG, WEBP. Maximum 2MB.
                    </p>

                    {logoPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                        Remove Logo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* BRAND NAME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Name *
                </label>

                <input
                  type="text"
                  placeholder="Enter brand name"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  required
                  maxLength={150}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  placeholder="Enter brand description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* STATUS */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "Active" | "Inactive")
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || categoriesLoading || categories.length === 0}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg font-medium"
                >
                  {saving
                    ? "Saving..."
                    : editId !== null
                      ? "Update Brand"
                      : "Save Brand"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
