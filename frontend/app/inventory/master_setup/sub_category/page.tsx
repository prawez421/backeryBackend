"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";

import {
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  Eye,
  X,
  Layers,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import { toast } from "sonner";

/* =========================
   TYPES
========================= */

interface Category {
  id: number;
  category_name: string;
  status: "Active" | "Inactive";
}

interface SubCategory {
  id: number;
  category_id: number;
  sub_category_name: string;
  status: "Active" | "Inactive";
  category?: Category | null;
}

interface SubCategoryFormData {
  category_id: string;
  sub_category_name: string;
  status: "Active" | "Inactive";
}

const emptyForm: SubCategoryFormData = {
  category_id: "",
  sub_category_name: "",
  status: "Active",
};

/* =========================
   MAIN COMPONENT
========================= */

export default function SubCategoryMasterPage() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState<SubCategoryFormData>(emptyForm);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const [modalType, setModalType] = useState<
    "add" | "edit" | "view" | "delete" | null
  >(null);

  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategory | null>(null);

  /* =========================
     FETCH SUB CATEGORIES
     SINGLE API
  ========================= */

  const fetchSubCategories = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        ProjectApiList.subCategoryList
      );

      const rows = response.data?.data;
      const categoryRows: Category[] = [];
      const extractedSubCategories: SubCategory[] = [];

      if (Array.isArray(rows)) {
        rows.forEach((catItem: any) => {
          // Push to Categories list
          const categoryObj: Category = {
            id: catItem.id,
            category_name: catItem.category_name,
            status: catItem.status,
          };
          categoryRows.push(categoryObj);

          // If sub_categories exist inside the category object
          if (Array.isArray(catItem.sub_categories)) {
            catItem.sub_categories.forEach((subItem: any) => {
              extractedSubCategories.push({
                id: subItem.id,
                category_id: subItem.category_id || catItem.id,
                sub_category_name: subItem.sub_category_name,
                status: subItem.status,
                category: categoryObj,
              });
            });
          }
        });
      }

      setCategories(categoryRows);
      setSubCategories(extractedSubCategories);
    } catch (error: any) {
      console.error("Sub Category Fetch Error:", error);

      toast.error(
        error.response?.data?.message ||
        "Sub Category list load nahi hui"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    fetchSubCategories();
  }, [fetchSubCategories]);

  /* =========================
     REFRESH
  ========================= */

  const refreshAll = async () => {
    await fetchSubCategories();
  };

  /* =========================
     GET CATEGORY NAME
  ========================= */

  const getCategoryName = (item: SubCategory): string => {
    return item.category?.category_name || "Category not found";
  };

  /* =========================
     SEARCH AND FILTER
  ========================= */

  const filteredSubCategories = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return subCategories.filter((item) => {
      const categoryName = getCategoryName(item);

      const matchesSearch = [
        item.sub_category_name,
        categoryName,
        item.status,
      ].some((field) =>
        String(field || "").toLowerCase().includes(searchValue)
      );

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        String(item.category_id) === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [
    subCategories,
    search,
    statusFilter,
    categoryFilter,
  ]);

  /* =========================
     PAGINATION
  ========================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSubCategories.length / perPage)
  );

  const paginatedSubCategories = filteredSubCategories.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, categoryFilter]);

  /* =========================
     STATISTICS
  ========================= */

  const totalSubCategories = filteredSubCategories.length;

  const activeSubCategories = filteredSubCategories.filter(
    (item) => item.status === "Active"
  ).length;

  const inactiveSubCategories = filteredSubCategories.filter(
    (item) => item.status === "Inactive"
  ).length;

  /* =========================
     ADD MODAL
  ========================= */

  const openAddModal = () => {
    if (categories.length === 0) {
      toast.error(
        "Sub Category API se koi Category nahi mili"
      );
      return;
    }

    setForm(emptyForm);
    setSelectedSubCategory(null);
    setModalType("add");
  };

  /* =========================
     EDIT MODAL
  ========================= */

  const openEditModal = (item: SubCategory) => {
    setSelectedSubCategory(item);

    setForm({
      category_id: String(item.category_id),
      sub_category_name: item.sub_category_name,
      status: item.status,
    });

    setModalType("edit");
  };

  /* =========================
     VIEW MODAL
  ========================= */

  const openViewModal = (item: SubCategory) => {
    setSelectedSubCategory(item);
    setModalType("view");
  };

  /* =========================
     FORM CHANGE
  ========================= */

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================
     CLOSE MODAL
  ========================= */

  const closeModal = () => {
    setModalType(null);
    setSelectedSubCategory(null);
    setForm(emptyForm);
  };

  /* =========================
     ADD / UPDATE SUB CATEGORY
  ========================= */

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.category_id) {
      toast.error("Category select karein");
      return;
    }

    if (!form.sub_category_name.trim()) {
      toast.error("Sub Category Name required hai");
      return;
    }

    const selectedCategory = categories.find(
      (category) => category.id === Number(form.category_id)
    );

    if (!selectedCategory) {
      toast.error("Valid Category select karein");
      return;
    }

    const payload = {
      category_id: Number(form.category_id),
      sub_category_name: form.sub_category_name.trim(),
      status: form.status,
    };

    try {
      setSaving(true);

      if (modalType === "edit" && selectedSubCategory) {
        await axiosInstance.put(
          ProjectApiList.subCategoryUpdate(selectedSubCategory.id),
          payload
        );

        toast.success("Sub Category successfully updated");
      } else {
        await axiosInstance.post(
          ProjectApiList.subCategoryCreate,
          payload
        );

        toast.success("Sub Category successfully added");
      }

      closeModal();

      await fetchSubCategories();
    } catch (error: any) {
      console.error("Sub Category Save Error:", error);

      const errors = error.response?.data?.errors;

      if (errors) {
        Object.values(errors).forEach((messages: any) => {
          toast.error(
            Array.isArray(messages)
              ? messages[0]
              : String(messages)
          );
        });
      } else {
        toast.error(
          error.response?.data?.message ||
          "Something went wrong"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     DELETE SUB CATEGORY
  ========================= */

  const handleDelete = async () => {
    if (!selectedSubCategory) return;


    try {
      setSaving(true);

      await axiosInstance.delete(
        ProjectApiList.subCategoryDelete(selectedSubCategory.id)
      );

      toast.success("Subcategory deleted successfully.");

      closeModal();

      await fetchSubCategories();

    } catch (error: any) {
      console.error("Subcategory Delete Error:", error);

      const status = error.response?.status;
      const errorMessage = error.response?.data?.message;

      let message = "Unable to delete subcategory. Please try again.";

      if (!error.response) {
        message = "Network error. Please check your internet connection and try again.";
      } else if (status === 401) {
        message = "Your session has expired. Please log in again.";
      } else if (status === 403) {
        message = "You do not have permission to delete this subcategory.";
      } else if (status === 404) {
        message = "Subcategory not found. It may have already been deleted.";
      } else if (status === 422) {
        message =
          errorMessage ||
          "This subcategory cannot be deleted because it is being used by existing products.";
      } else if (status === 500) {
        message = "A server error occurred while deleting the subcategory. Please contact support.";
      } else if (errorMessage) {
        message = errorMessage;
      }
      toast.error(message);

    } finally {
      setSaving(false);
    }

  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* HEADER */}

      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Sub Category Master
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage all sub categories
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add New Sub Category
        </button>
      </div>

      {/* STAT CARDS */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Sub Categories"
          value={totalSubCategories}
          icon={<Layers size={22} />}
          color="blue"
        />

        <StatCard
          title="Active Sub Categories"
          value={activeSubCategories}
          icon={<CheckCircle size={22} />}
          color="green"
        />

        <StatCard
          title="Inactive Sub Categories"
          value={inactiveSubCategories}
          icon={<XCircle size={22} />}
          color="red"
        />
      </div>

      {/* TABLE CONTAINER */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* SEARCH AND FILTER */}

        <div className="flex flex-col justify-between gap-3 border-b border-gray-200 p-4 md:flex-row md:items-center">
          <div>
            <h2 className="font-semibold text-gray-800">
              Sub Category List
            </h2>

            <p className="text-xs text-gray-500">
              Total {filteredSubCategories.length} records found
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">

            {/* SEARCH */}

            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search sub category..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 sm:w-56"
              />
            </div>

            {/* CATEGORY FILTER */}

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value)
              }
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Categories</option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={String(category.id)}
                >
                  {category.category_name}
                </option>
              ))}
            </select>

            {/* STATUS FILTER */}

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            {/* REFRESH */}

            <button
              type="button"
              onClick={refreshAll}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">

            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-5 py-4">#</th>
                <th className="px-5 py-4">Sub Category Name</th>
                <th className="px-5 py-4">Category Name</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-gray-500"
                  >
                    Loading sub categories...
                  </td>
                </tr>
              ) : paginatedSubCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-gray-500"
                  >
                    <Layers
                      size={35}
                      className="mx-auto mb-2 text-gray-300"
                    />

                    No sub categories found
                  </td>
                </tr>
              ) : (
                paginatedSubCategories.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-5 py-4 text-gray-500">
                      {(currentPage - 1) * perPage + index + 1}
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-800">
                      {item.sub_category_name}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {getCategoryName(item)}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">

                        <ActionButton
                          title="View"
                          onClick={() => openViewModal(item)}
                          color="blue"
                        >
                          <Eye size={16} />
                        </ActionButton>

                        <ActionButton
                          title="Edit"
                          onClick={() => openEditModal(item)}
                          color="green"
                        >
                          <Pencil size={16} />
                        </ActionButton>

                        <ActionButton
                          title="Delete"
                          onClick={() => {
                            setSelectedSubCategory(item);
                            setModalType("delete");
                          }}
                          color="red"
                        >
                          <Trash2 size={16} />
                        </ActionButton>

                      </div>
                    </td>
                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row">

          <p className="text-xs text-gray-500">
            Showing{" "}
            {filteredSubCategories.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to{" "}
            {Math.min(
              currentPage * perPage,
              filteredSubCategories.length
            )}{" "}
            of {filteredSubCategories.length} entries
          </p>

          <div className="flex items-center gap-2">

            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((previous) =>
                  Math.max(1, previous - 1)
                )
              }
              className="rounded-lg border border-gray-300 p-2 disabled:opacity-40"
            >
              <ChevronLeft size={17} />
            </button>

            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setCurrentPage((previous) =>
                  Math.min(totalPages, previous + 1)
                )
              }
              className="rounded-lg border border-gray-300 p-2 disabled:opacity-40"
            >
              <ChevronRight size={17} />
            </button>

          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}

      {(modalType === "add" || modalType === "edit") && (
        <Modal
          title={
            modalType === "add"
              ? "Add New Sub Category"
              : "Edit Sub Category"
          }
          onClose={closeModal}
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* CATEGORY */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>

              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="">Select Category</option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={String(category.id)}
                  >
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>

            {/* SUB CATEGORY NAME */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Sub Category Name{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="sub_category_name"
                value={form.sub_category_name}
                onChange={handleChange}
                placeholder="Enter sub category name"
                maxLength={100}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            {/* STATUS */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* BUTTONS */}

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : modalType === "add"
                    ? "Save Sub Category"
                    : "Update Sub Category"}
              </button>

            </div>
          </form>
        </Modal>
      )}

      {/* VIEW MODAL */}

      {modalType === "view" && selectedSubCategory && (
        <Modal
          title="Sub Category Details"
          onClose={closeModal}
        >
          <div className="space-y-4">

            <Detail
              label="Sub Category ID"
              value={selectedSubCategory.id}
            />

            <Detail
              label="Category Name"
              value={getCategoryName(selectedSubCategory)}
            />

            <Detail
              label="Sub Category Name"
              value={selectedSubCategory.sub_category_name}
            />

            <div className="flex items-center justify-between border-b border-gray-100 py-3">
              <span className="text-sm text-gray-500">
                Status
              </span>

              <StatusBadge
                status={selectedSubCategory.status}
              />
            </div>

            <button
              type="button"
              onClick={closeModal}
              className="mt-3 w-full rounded-lg bg-gray-100 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200"
            >
              Close
            </button>

          </div>
        </Modal>
      )}

      {/* DELETE MODAL */}

      {modalType === "delete" && selectedSubCategory && (
        <Modal
          title="Delete Sub Category"
          onClose={closeModal}
        >
          <div className="text-center">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Trash2 size={28} />
            </div>

            <h3 className="text-lg font-semibold text-gray-800">
              Are you sure?
            </h3>


            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete the{" "}
              <strong> {selectedSubCategory.sub_category_name}</strong>{" "}
              sub category?
            </p>

            <div className="mt-6 flex justify-center gap-3">

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm text-gray-700"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {saving ? "Deleting..." : "Yes, Delete"}
              </button>

            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}

/* =========================
   STAT CARD
========================= */

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: ReactNode;
  color: "blue" | "green" | "red";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-gray-800">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors[color]}`}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}

/* =========================
   STATUS BADGE
========================= */

function StatusBadge({
  status,
}: {
  status: "Active" | "Inactive";
}) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${status === "Active"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
        }`}
    >
      {status}
    </span>
  );
}

/* =========================
   ACTION BUTTON
========================= */

function ActionButton({
  children,
  title,
  onClick,
  color,
}: {
  children: ReactNode;
  title: string;
  onClick: () => void;
  color: "blue" | "green" | "red";
}) {
  const colors = {
    blue: "text-blue-600 hover:bg-blue-50",
    green: "text-green-600 hover:bg-green-50",
    red: "text-red-600 hover:bg-red-50",
  };

  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded-lg p-2 transition ${colors[color]}`}
    >
      {children}
    </button>
  );
}

/* =========================
   MODAL
========================= */

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          {children}
        </div>

      </div>
    </div>
  );
}

/* =========================
   DETAIL ROW
========================= */

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-3">

      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="text-sm font-semibold text-gray-800">
        {value}
      </span>

    </div>
  );
}