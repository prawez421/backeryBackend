
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  Eye,
  X,
  FolderTree,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import { toast } from "sonner";

interface Category {
  id: number;
  category_name: string;
  category_code: string;
  status: "Active" | "Inactive";
}

interface CategoryFormData {
  category_name: string;
  category_code: string;
  status: "Active" | "Inactive";
}

const emptyForm: CategoryFormData = {
  category_name: "",
  category_code: "",
  status: "Active",
};

export default function CategoryMasterPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CategoryFormData>(emptyForm);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 10;

  const [modalType, setModalType] = useState<
    "add" | "edit" | "view" | "delete" | null
  >(null);

  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  // GET CATEGORY LIST
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        ProjectApiList.categoryList
      );

      setCategories(response.data.data || []);
    } catch (error: any) {
      console.error("Category List Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Category list load nahi hui"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // SEARCH AND FILTER
  const filteredCategories = useMemo(() => {
    const value = search.toLowerCase().trim();

    return categories.filter((category) => {
      const matchesSearch = [
        category.category_name,
        category.category_code,
        category.status,
      ].some((item) =>
        String(item || "").toLowerCase().includes(value)
      );

      const matchesStatus =
        statusFilter === "All" ||
        category.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  // PAGINATION
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / perPage)
  );

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // STATISTICS
  const totalCategories = categories.length;

  const activeCategories = categories.filter(
    (category) => category.status === "Active"
  ).length;

  const inactiveCategories = categories.filter(
    (category) => category.status === "Inactive"
  ).length;

  // ADD MODAL
  const openAddModal = () => {
    setForm(emptyForm);
    setSelectedCategory(null);
    setModalType("add");
  };

  // EDIT MODAL
  const openEditModal = (category: Category) => {
    setSelectedCategory(category);

    setForm({
      category_name: category.category_name || "",
      category_code: category.category_code || "",
      status: category.status || "Active",
    });

    setModalType("edit");
  };

  // VIEW MODAL
  const openViewModal = (category: Category) => {
    setSelectedCategory(category);
    setModalType("view");
  };

  // FORM INPUT
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ADD / UPDATE CATEGORY
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!form.category_name.trim()) {
      toast.error("Category name required hai");
      return;
    }

    const payload = {
      category_name: form.category_name.trim(),
      status: form.status,
    };

    try {
      setSaving(true);

      if (modalType === "edit" && selectedCategory) {
        await axiosInstance.put(
          ProjectApiList.categoryUpdate(selectedCategory.id),
          payload
        );

        toast.success("Category successfully updated");
      } else {
        await axiosInstance.post(
          ProjectApiList.categoryCreate,
          payload
        );

        toast.success("Category successfully added");
      }

      closeModal();
      await fetchCategories();
    } catch (error: any) {
      console.error("Category Save Error:", error);

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

  // DELETE CATEGORY
  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      setSaving(true);

      await axiosInstance.delete(
        ProjectApiList.categoryDelete(selectedCategory.id)
      );

      toast.success("Category successfully deleted");

      closeModal();
      await fetchCategories();
    } catch (error: any) {
      console.error("Category Delete Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Category delete nahi hui"
      );
    } finally {
      setSaving(false);
    }
  };

  // CLOSE MODAL
  const closeModal = () => {
    setModalType(null);
    setSelectedCategory(null);
    setForm(emptyForm);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* HEADER */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Category Master
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your bakery inventory categories
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add New Category
        </button>
      </div>

      {/* STATISTICS */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

        <StatCard
          title="Total Categories"
          value={totalCategories}
          icon={<FolderTree size={22} />}
          color="blue"
        />

        <StatCard
          title="Active Categories"
          value={activeCategories}
          icon={<CheckCircle size={22} />}
          color="green"
        />

        <StatCard
          title="Inactive Categories"
          value={inactiveCategories}
          icon={<XCircle size={22} />}
          color="red"
        />

      </div>

      {/* CATEGORY TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* SEARCH AND FILTER */}
        <div className="flex flex-col justify-between gap-3 border-b border-gray-200 p-4 md:flex-row md:items-center">

          <div>
            <h2 className="font-semibold text-gray-800">
              Category List
            </h2>

            <p className="text-xs text-gray-500">
              Total {filteredCategories.length} records found
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">

            {/* SEARCH */}
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 sm:w-64"
              />
            </div>

            {/* STATUS FILTER */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            {/* REFRESH */}
            <button
              type="button"
              onClick={fetchCategories}
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
                    Loading categories...
                  </td>
                </tr>
              ) : paginatedCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-gray-500"
                  >
                    <FolderTree
                      size={35}
                      className="mx-auto mb-2 text-gray-300"
                    />
                    No categories found
                  </td>
                </tr>
              ) : (
                paginatedCategories.map((category, index) => (
                  <tr
                    key={category.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-5 py-4 text-gray-500">
                      {(currentPage - 1) * perPage + index + 1}
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-800">
                      {category.category_name}
                    </td>


                    <td className="px-5 py-4">
                      <StatusBadge status={category.status} />
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">

                        <ActionButton
                          title="View"
                          onClick={() => openViewModal(category)}
                          color="blue"
                        >
                          <Eye size={16} />
                        </ActionButton>

                        <ActionButton
                          title="Edit"
                          onClick={() => openEditModal(category)}
                          color="green"
                        >
                          <Pencil size={16} />
                        </ActionButton>

                        <ActionButton
                          title="Delete"
                          onClick={() => {
                            setSelectedCategory(category);
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
            {filteredCategories.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to{" "}
            {Math.min(
              currentPage * perPage,
              filteredCategories.length
            )}{" "}
            of {filteredCategories.length} entries
          </p>

          <div className="flex items-center gap-2">

            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((prev) => Math.max(1, prev - 1))
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
                setCurrentPage((prev) =>
                  Math.min(totalPages, prev + 1)
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
              ? "Add New Category"
              : "Edit Category"
          }
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* CATEGORY NAME */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="category_name"
                value={form.category_name}
                onChange={handleChange}
                placeholder="Enter category name"
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
                    ? "Save Category"
                    : "Update Category"}
              </button>

            </div>
          </form>
        </Modal>
      )}

      {/* VIEW MODAL */}
      {modalType === "view" && selectedCategory && (
        <Modal
          title="Category Details"
          onClose={closeModal}
        >
          <div className="space-y-4">

            <Detail
              label="Category ID"
              value={selectedCategory.id}
            />

            <Detail
              label="Category Name"
              value={selectedCategory.category_name}
            />

           

            <div className="flex items-center justify-between border-b border-gray-100 py-3">
              <span className="text-sm text-gray-500">
                Status
              </span>

              <StatusBadge status={selectedCategory.status} />
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
      {modalType === "delete" && selectedCategory && (
        <Modal
          title="Delete Category"
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
              Kya aap{" "}
              <strong>{selectedCategory.category_name}</strong>{" "}
              category delete karna chahte hain?
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

// STAT CARD
function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
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
          <p className="text-sm text-gray-500">{title}</p>
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

// STATUS BADGE
function StatusBadge({
  status,
}: {
  status: "Active" | "Inactive";
}) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        status === "Active"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {status}
    </span>
  );
}

// ACTION BUTTON
function ActionButton({
  children,
  title,
  onClick,
  color,
}: {
  children: React.ReactNode;
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

// MODAL
function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
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

// DETAIL ROW
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
