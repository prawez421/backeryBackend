
"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
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
  Building2,
} from "lucide-react";
import { toast } from "sonner";

interface SubCategory {
  id: number;
  unique_id?: string;
  category_id: number;
  sub_category_name: string;
  status: "Active" | "Inactive";
}

interface Category {
  id: number;
  unique_id?: string;
  branch_code?: string;
  category_name: string;
  status: "Active" | "Inactive";
  sub_categories?: SubCategory[];
}

interface Brand {
  id: number;
  unique_id?: string;
  category_id: number;
  category?: Category;
  brand_name: string;
  description: string | null;
  status: "Active" | "Inactive";
}

export default function BrandPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] =
    useState<Brand | null>(null);

  // FORM STATES
  const [categoryId, setCategoryId] = useState("");
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] =
    useState<"Active" | "Inactive">("Active");

  // NORMALIZE BRAND RESPONSE
  const normalizeBrand = (item: any): Brand => ({
    id: Number(item.id),
    unique_id: item.unique_id || "",
    category_id: Number(item.category_id),
    category: item.category || undefined,
    brand_name: item.brand_name || "",
    description: item.description || "",
    status: item.status === "Inactive" ? "Inactive" : "Active",
  });

  // FETCH BRANDS + CATEGORIES FROM BRAND CONTROLLER
  const fetchBrands = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        ProjectApiList.brandList,
        {
          params: { per_page: 1000 },
        }
      );

      const responseData = response.data;
      const result = responseData?.data;

      /*
        Supported response formats:

        1. Combined BrandController response:
           data: {
             brands: { data: [...] },
             categories: [...]
           }

        2. Direct category response:
           data: [
             { id, category_name, status, sub_categories: [...] }
           ]
      */

      const brandPayload =
        result?.brands ?? responseData?.brands ?? [];

      const brandRows = Array.isArray(brandPayload?.data)
        ? brandPayload.data
        : Array.isArray(brandPayload)
          ? brandPayload
          : [];

      const categoryPayload =
        result?.categories ??
        responseData?.categories ??
        (Array.isArray(result) ? result : []);

      const categoryRows = Array.isArray(categoryPayload?.data)
        ? categoryPayload.data
        : Array.isArray(categoryPayload)
          ? categoryPayload
          : [];

      setBrands(brandRows.map(normalizeBrand));

      setCategories(
        categoryRows
          .filter(
            (item: any) => item.status === "Active"
          )
          .map((item: any) => ({
            id: Number(item.id),
            unique_id: item.unique_id || "",
            branch_code: item.branch_code || "",
            category_name: item.category_name || "",
            status: item.status,
            sub_categories: Array.isArray(item.sub_categories)
              ? item.sub_categories
              : [],
          }))
      );
    } catch (error: any) {
      console.error("Brand List Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Brand aur category data load nahi hua"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // RESET FORM
  const resetForm = () => {
    setCategoryId("");
    setBrandName("");
    setDescription("");
    setStatus("Active");
    setEditId(null);
    setShowModal(false);
  };

  // OPEN ADD MODAL
  const openAddModal = () => {
    setCategoryId("");
    setBrandName("");
    setDescription("");
    setStatus("Active");
    setEditId(null);
    setShowModal(true);
  };

  // OPEN EDIT MODAL
  const openEditModal = (item: Brand) => {
    setEditId(item.id);
    setCategoryId(String(item.category_id));
    setBrandName(item.brand_name);
    setDescription(item.description || "");
    setStatus(item.status);
    setShowModal(true);
  };

  // OPEN VIEW MODAL
  const openViewModal = (item: Brand) => {
    setSelectedBrand(item);
    setViewModal(true);
  };

  // ADD / UPDATE BRAND
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const cleanName = brandName.trim();

    if (!categoryId) {
      toast.error("Please select category");
      return;
    }

    if (!cleanName) {
      toast.error("Brand name is required");
      return;
    }

    // Frontend duplicate check within category
    const duplicate = brands.some(
      (item) =>
        item.category_id === Number(categoryId) &&
        item.brand_name.toLowerCase() === cleanName.toLowerCase() &&
        item.id !== editId
    );

    if (duplicate) {
      toast.error("Brand already exists in this category");
      return;
    }

    const payload = {
      category_id: Number(categoryId),
      brand_name: cleanName,
      description: description.trim() || null,
      status,
    };

    try {
      setSaving(true);

      if (editId !== null) {
        await axiosInstance.put(
          ProjectApiList.brandUpdate(editId),
          payload
        );

        toast.success("Brand updated successfully");
      } else {
        await axiosInstance.post(
          ProjectApiList.brandCreate,
          payload
        );

        toast.success("Brand added successfully");
      }

      resetForm();
      await fetchBrands();

    } catch (error: any) {
      console.error("Save Brand Error:", error);

      const validationMessage = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()[0]
        : null;

      toast.error(
        String(
          validationMessage ||
            error.response?.data?.message ||
            "Brand save nahi hua"
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
        error.response?.data?.message ||
          "Brand delete nahi hua"
      );
    }
  };

  // SEARCH
  const filteredData = brands.filter((item) => {
    const searchText = search.toLowerCase();

    return (
      item.brand_name.toLowerCase().includes(searchText) ||
      item.category?.category_name
        ?.toLowerCase()
        .includes(searchText) ||
      item.unique_id?.toLowerCase().includes(searchText)
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
      value: brands.filter(
        (item) => item.status === "Active"
      ).length,
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Inactive Brands",
      value: brands.filter(
        (item) => item.status === "Inactive"
      ).length,
      icon: XCircle,
      color: "bg-red-50 text-red-600",
    },
    {
      title: "Categories Used",
      value: new Set(brands.map((item) => item.category_id)).size,
      icon: Building2,
      color: "bg-amber-50 text-amber-600",
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
            Manage bakery product brands and categories.
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
              placeholder="Search brand or category..."
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
                <th className="px-5 py-4 font-semibold">Brand ID</th>
                <th className="px-5 py-4 font-semibold">Brand Name</th>
                <th className="px-5 py-4 font-semibold">Category</th>
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

                    <td className="px-5 py-4 text-xs font-medium text-gray-500">
                      {item.unique_id || "-"}
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-semibold text-gray-800">
                        {item.brand_name}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-medium">
                        {item.category?.category_name ||
                          categories.find(
                            (cat) => cat.id === item.category_id
                          )?.category_name ||
                          "-"}
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

                <p className="text-xs text-gray-500 mt-1">
                  {selectedBrand.unique_id}
                </p>
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

              <div>
                <p className="text-xs text-gray-500 mb-1">Brand Name</p>
                <p className="font-semibold text-gray-800">
                  {selectedBrand.brand_name}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Category</p>
                <p className="font-medium text-gray-800">
                  {selectedBrand.category?.category_name ||
                    categories.find(
                      (cat) => cat.id === selectedBrand.category_id
                    )?.category_name ||
                    "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedBrand.description || "No description available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">Select Category</option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.category_name}
                    </option>
                  ))}
                </select>

                {categories.length === 0 && (
                  <p className="text-xs text-red-500 mt-2">
                    No active categories available.
                  </p>
                )}
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
                    setStatus(
                      e.target.value as "Active" | "Inactive"
                    )
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
                  disabled={saving || categories.length === 0}
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
