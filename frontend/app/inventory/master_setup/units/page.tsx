
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
  Package,
  CheckCircle,
  XCircle,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import { toast } from "sonner";

interface Unit {
  id: number;
  unit_name: string;
  short_name: string;
  status: "Active" | "Inactive";
}

type UnitFormData = Omit<Unit, "id">;

const emptyForm: UnitFormData = {
  unit_name: "",
  short_name: "",
  status: "Active",
};

export default function UnitMasterPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [form, setForm] = useState<UnitFormData>(emptyForm);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  const [modalType, setModalType] = useState<
    "add" | "edit" | "view" | "delete" | null
  >(null);

  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  // GET UNIT LIST
  const fetchUnits = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        ProjectApiList.unitList
      );

      setUnits(response.data.data || []);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Unit list load nahi hui"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  // SEARCH
  const filteredUnits = useMemo(() => {
    const value = search.toLowerCase().trim();

    return units.filter((unit) =>
      [
        unit.unit_name,
        unit.short_name,
        unit.status,
      ].some((item) =>
        String(item || "").toLowerCase().includes(value)
      )
    );
  }, [units, search]);

  // PAGINATION
  const totalPages = Math.max(
    1,
    Math.ceil(filteredUnits.length / perPage)
  );

  const paginatedUnits = filteredUnits.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // STATISTICS
  const totalUnits = units.length;
  const activeUnits = units.filter(
    (unit) => unit.status === "Active"
  ).length;
  const inactiveUnits = units.filter(
    (unit) => unit.status === "Inactive"
  ).length;

  // OPEN ADD MODAL
  const openAddModal = () => {
    setForm(emptyForm);
    setSelectedUnit(null);
    setModalType("add");
  };

  // OPEN EDIT MODAL
  const openEditModal = (unit: Unit) => {
    setSelectedUnit(unit);

    setForm({
      unit_name: unit.unit_name || "",
      short_name: unit.short_name || "",
      status: unit.status || "Active",
    });

    setModalType("edit");
  };

  // OPEN VIEW MODAL
  const openViewModal = (unit: Unit) => {
    setSelectedUnit(unit);
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

  // ADD / UPDATE UNIT
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!form.unit_name.trim()) {
      toast.error("Unit name required hai");
      return;
    }

    if (!form.short_name.trim()) {
      toast.error("Short name required hai");
      return;
    }

    const payload: UnitFormData = {
      unit_name: form.unit_name.trim(),
      short_name: form.short_name.trim().toUpperCase(),
      status: form.status,
    };

    try {
      setSaving(true);

      if (modalType === "edit" && selectedUnit) {
        await axiosInstance.put(
          ProjectApiList.unitUpdate(selectedUnit.id),
          payload
        );

        toast.success("Unit successfully updated");
      } else {
        await axiosInstance.post(
          ProjectApiList.unitCreate,
          payload
        );

        toast.success("Unit successfully added");
      }

      setModalType(null);
      setForm(emptyForm);
      setSelectedUnit(null);

      await fetchUnits();
    } catch (error: any) {
      console.error(error);

      const errors = error.response?.data?.errors;

      if (errors) {
        Object.values(errors).forEach((messages: any) => {
          toast.error(messages[0]);
        });
      } else {
        toast.error(
          error.response?.data?.message || "Something went wrong"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // DELETE UNIT
  const handleDelete = async () => {
    if (!selectedUnit) return;

   
try {
  setSaving(true);

  await axiosInstance.delete(
    ProjectApiList.unitDelete(selectedUnit.id)
  );

  toast.success("Unit deleted successfully.");

  setModalType(null);
  setSelectedUnit(null);

  await fetchUnits();

} catch (error: any) {
  console.error("Unit Delete Error:", error);

  const status = error.response?.status;
  const errorMessage = error.response?.data?.message;

 let message = "Unable to delete unit. Please try again.";

if (!error.response) {
  message =
    "Unable to connect to the server. Please check your internet connection and try again.";
} else if (status === 400) {
  message =
    "Invalid request. Please refresh the page and try again.";
} else if (status === 401) {
  message =
    "Your session has expired. Please log in again to continue.";
} else if (status === 403) {
  message =
    "Access denied. You do not have permission to delete this unit.";
} else if (status === 404) {
  message =
    "This unit could not be found. It may have already been deleted.";
} else if (status === 409) {
  message =
    "This unit is currently in use and cannot be deleted. Please check the associated records.";
} else if (status === 422) {
  const products = error.response?.data?.used_in || [];

  if (products.length > 0) {
    const productNames = products
      .map((product: any) => product.product_name)
      .join(", ");

    message = `Unable to delete this unit. It is currently used in the following products: ${productNames}.`;
  } else {
    message =
      errorMessage ||
      "This unit is already assigned to existing products. Remove or change the unit from those products before deleting it.";
  }
} else if (status === 500) {
  message =
    "Something went wrong while deleting this unit. Please try again later. If the problem continues, contact support.";
} else if (errorMessage) {
  message = errorMessage;
}

toast.error(message);

  toast.error(message);

} finally {
  setSaving(false);
}

  };

  // CLOSE MODAL
  const closeModal = () => {
    setModalType(null);
    setSelectedUnit(null);
    setForm(emptyForm);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* HEADER */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Unit Master
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your inventory measurement units
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add New Unit
        </button>
      </div>

      {/* STATISTICS */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Units"
          value={totalUnits}
          icon={<Layers size={22} />}
          color="blue"
        />

        <StatCard
          title="Active Units"
          value={activeUnits}
          icon={<CheckCircle size={22} />}
          color="green"
        />

        <StatCard
          title="Inactive Units"
          value={inactiveUnits}
          icon={<XCircle size={22} />}
          color="red"
        />
      </div>

      {/* TABLE CARD */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* SEARCH HEADER */}
        <div className="flex flex-col justify-between gap-3 border-b border-gray-200 p-4 md:flex-row md:items-center">
          <div>
            <h2 className="font-semibold text-gray-800">
              Unit List
            </h2>

            <p className="text-xs text-gray-500">
              Total {filteredUnits.length} records found
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search unit..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 sm:w-64"
              />
            </div>

            <button
              onClick={fetchUnits}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
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
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-5 py-4">#</th>
                <th className="px-5 py-4">Unit Name</th>
                <th className="px-5 py-4">Short Name</th>
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
                    Loading units...
                  </td>
                </tr>
              ) : paginatedUnits.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-gray-500"
                  >
                    <Package
                      size={35}
                      className="mx-auto mb-2 text-gray-300"
                    />

                    <p>No units found</p>
                  </td>
                </tr>
              ) : (
                paginatedUnits.map((unit, index) => (
                  <tr
                    key={unit.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-5 py-4 text-gray-500">
                      {(currentPage - 1) * perPage + index + 1}
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-800">
                      {unit.unit_name}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-md bg-blue-50 px-3 py-1 font-semibold text-blue-700">
                        {unit.short_name}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={unit.status} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">
                        <ActionButton
                          title="View"
                          onClick={() => openViewModal(unit)}
                          color="blue"
                        >
                          <Eye size={16} />
                        </ActionButton>

                        <ActionButton
                          title="Edit"
                          onClick={() => openEditModal(unit)}
                          color="green"
                        >
                          <Pencil size={16} />
                        </ActionButton>

                        <ActionButton
                          title="Delete"
                          onClick={() => {
                            setSelectedUnit(unit);
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
            {filteredUnits.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to{" "}
            {Math.min(currentPage * perPage, filteredUnits.length)}{" "}
            of {filteredUnits.length} entries
          </p>

          <div className="flex items-center gap-2">
            <button
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
          title={modalType === "add" ? "Add New Unit" : "Edit Unit"}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Unit Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="unit_name"
                value={form.unit_name}
                onChange={handleChange}
                placeholder="Enter unit name"
                maxLength={100}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Short Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="short_name"
                value={form.short_name}
                onChange={handleChange}
                placeholder="Example: KG, PCS, LTR"
                maxLength={20}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm uppercase outline-none focus:border-blue-500"
              />
            </div>

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
                    ? "Save Unit"
                    : "Update Unit"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* VIEW MODAL */}
      {modalType === "view" && selectedUnit && (
        <Modal title="Unit Details" onClose={closeModal}>
          <div className="space-y-4">
            <Detail
              label="Unit ID"
              value={selectedUnit.id}
            />

            <Detail
              label="Unit Name"
              value={selectedUnit.unit_name}
            />

            <Detail
              label="Short Name"
              value={selectedUnit.short_name}
            />

            <div className="flex items-center justify-between border-b border-gray-100 py-3">
              <span className="text-sm text-gray-500">
                Status
              </span>

              <StatusBadge status={selectedUnit.status} />
            </div>

            <button
              onClick={closeModal}
              className="mt-3 w-full rounded-lg bg-gray-100 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* DELETE MODAL */}
      {modalType === "delete" && selectedUnit && (
        <Modal title="Delete Unit" onClose={closeModal}>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Trash2 size={28} />
            </div>

            <h3 className="text-lg font-semibold text-gray-800">
              Are you sure?
            </h3>



            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete the{" "}
              <strong><strong>{selectedUnit.unit_name}</strong></strong>{" "}
              Unit
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm text-gray-700"
              >
                Cancel
              </button>

              <button
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
      className={`rounded-full px-3 py-1 text-xs font-semibold ${status === "Active"
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
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">{children}</div>
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
      <span className="text-sm text-gray-500">{label}</span>

      <span className="text-sm font-semibold text-gray-800">
        {value}
      </span>
    </div>
  );
}
