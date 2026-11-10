
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
  Layers,
  Package,
} from "lucide-react";
import { toast } from "sonner";

interface Attribute {
  id: number;
  name: string;
  values: string[];
  status: "Active" | "Inactive";
}

export default function AttributePage() {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [values, setValues] = useState<string[]>([]);

  const [status, setStatus] =
    useState<"Active" | "Inactive">("Active");

  // BACKEND RESPONSE KO UI FORMAT MEIN CONVERT KARNA
  const normalizeAttribute = (item: any): Attribute => ({
    id: Number(item.id),
    name: item.attribute_name || item.name || "",
    values: Array.isArray(item.values)
      ? item.values.map((value: any) =>
          typeof value === "string" ? value : value.value
        ).filter(Boolean)
      : [],
    status: item.status === "Inactive" ? "Inactive" : "Active",
  });

  // GET ATTRIBUTE LIST
  const fetchAttributes = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(ProjectApiList.attributeList, {
        params: { per_page: 1000 },
      });

      const result = response.data?.data;
      const rows = Array.isArray(result) ? result : result?.data || [];

      setAttributes(rows.map(normalizeAttribute));
    } catch (error: any) {
      console.error("Attribute List Error:", error);
      toast.error(
        error.response?.data?.message || "Attribute list load nahi hui"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  // RESET FORM
  const resetForm = () => {
    setName("");
    setValueInput("");
    setValues([]);
    setStatus("Active");
    setEditId(null);
    setShowModal(false);
  };

  // OPEN ADD MODAL
  const openAddModal = () => {
    setName("");
    setValueInput("");
    setValues([]);
    setStatus("Active");
    setEditId(null);
    setShowModal(true);
  };

  // ADD ATTRIBUTE VALUE
  const addValue = () => {
    const value = valueInput.trim();

    if (!value) {
      toast.error("Please enter attribute value");
      return;
    }

    const exists = values.some(
      (item) => item.toLowerCase() === value.toLowerCase()
    );

    if (exists) {
      toast.error("This attribute value already exists");
      return;
    }

    setValues((prev) => [...prev, value]);
    setValueInput("");

    toast.success("Attribute value added successfully");
  };

  // REMOVE ATTRIBUTE VALUE
  const removeValue = (index: number) => {
    setValues((prev) =>
      prev.filter((_, i) => i !== index)
    );

    toast.success("Attribute value removed");
  };

  // EDIT ATTRIBUTE
  const openEditModal = (item: Attribute) => {
    setEditId(item.id);
    setName(item.name);
    setValues([...item.values]);
    setValueInput("");
    setStatus(item.status);
    setShowModal(true);
  };

  // ADD / UPDATE ATTRIBUTE
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanValues = values.map((v) => v.trim()).filter(Boolean);

    if (!cleanName) {
      toast.error("Attribute name is required");
      return;
    }

    if (cleanValues.length === 0) {
      toast.error("Please add at least one attribute value");
      return;
    }

    const duplicate = attributes.some(
      (item) =>
        item.name.toLowerCase() === cleanName.toLowerCase() &&
        item.id !== editId
    );

    if (duplicate) {
      toast.error("Attribute name already exists");
      return;
    }

    const payload = {
      attribute_name: cleanName,
      values: cleanValues,
      status,
    };

    try {
      setSaving(true);

      if (editId !== null) {
        await axiosInstance.put(
          ProjectApiList.attributeUpdate(editId),
          payload
        );
        toast.success("Attribute successfully updated");
      } else {
        await axiosInstance.post(ProjectApiList.attributeCreate, payload);
        toast.success("Attribute successfully added");
      }

      resetForm();
      await fetchAttributes();
    } catch (error: any) {
      console.error("Save Attribute Error:", error);
      const validationMessage = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()[0]
        : null;
      toast.error(
        String(validationMessage || error.response?.data?.message || "Attribute save nahi hua")
      );
    } finally {
      setSaving(false);
    }
  };

  // DELETE ATTRIBUTE
  const deleteAttribute = async (id: number) => {
    const item = attributes.find((a) => a.id === id);
    if (!item) return;

    if (!window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      return;
    }

    try {
      await axiosInstance.delete(ProjectApiList.attributeDelete(id));
      toast.success("Attribute successfully deleted");
      await fetchAttributes();
    } catch (error: any) {
      console.error("Delete Attribute Error:", error);
      toast.error(
        error.response?.data?.message || "Attribute delete nahi hua"
      );
    }
  };

  // SEARCH
  const filteredData = attributes.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.values.some((value) =>
        value.toLowerCase().includes(search.toLowerCase())
      )
  );

  // STATISTICS
  const totalValues = attributes.reduce(
    (sum, item) => sum + item.values.length,
    0
  );

  const stats = [
    {
      title: "Total Attributes",
      value: attributes.length,
      icon: Tags,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Active Attributes",
      value: attributes.filter(
        (item) => item.status === "Active"
      ).length,
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Inactive Attributes",
      value: attributes.filter(
        (item) => item.status === "Inactive"
      ).length,
      icon: XCircle,
      color: "bg-red-50 text-red-600",
    },
    {
      title: "Total Values",
      value: totalValues,
      icon: Layers,
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
              Attribute Master
            </h1>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Manage bakery product attributes and values.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm"
        >
          <Plus size={19} />
          Add Attribute
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

      {/* ATTRIBUTE TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">

        {/* SEARCH */}
        <div className="p-4 md:p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Attribute List
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              View and manage all product attributes.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search attribute or value..."
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
                <th className="px-5 py-4 font-semibold">
                  Attribute Name
                </th>
                <th className="px-5 py-4 font-semibold">
                  Attribute Values
                </th>
                <th className="px-5 py-4 font-semibold">
                  Total Values
                </th>
                <th className="px-5 py-4 font-semibold">
                  Status
                </th>
                <th className="px-5 py-4 font-semibold text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    Loading attributes...
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
                      <span className="font-semibold text-gray-800">
                        {item.name}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5 min-w-48">
                        {item.values.map((value, i) => (
                          <span
                            key={i}
                            className="bg-amber-50 text-amber-800 border border-amber-100 px-2.5 py-1 rounded-md text-xs"
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                        {item.values.length}
                      </span>
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
                          onClick={() => openEditModal(item)}
                          title="Edit"
                          className="p-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteAttribute(item.id)}
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
                    colSpan={6}
                    className="text-center py-12 text-gray-500"
                  >
                    <Tags
                      size={30}
                      className="mx-auto mb-2 text-gray-300"
                    />
                    No attributes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="px-5 py-4 border-t text-sm text-gray-500">
          Showing {filteredData.length} of {attributes.length} attributes
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">

            {/* MODAL HEADER */}
            <div className="flex justify-between items-center p-5 border-b">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {editId !== null
                    ? "Edit Attribute"
                    : "Add New Attribute"}
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Enter attribute name and add multiple values.
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

              {/* ATTRIBUTE NAME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attribute Name *
                </label>

                <input
                  type="text"
                  placeholder="Enter attribute name (e.g. Flavour)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* ATTRIBUTE VALUES */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attribute Values *
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter attribute value"
                    value={valueInput}
                    onChange={(e) => setValueInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addValue();
                      }
                    }}
                    className="flex-1 min-w-0 border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-400"
                  />

                  <button
                    type="button"
                    onClick={addValue}
                    className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg"
                  >
                    <Plus size={18} />
                    Add
                  </button>
                </div>

                {/* ADDED VALUES */}
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    Added Values ({values.length})
                  </p>

                  {values.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {values.map((value, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-2 rounded-lg text-sm"
                        >
                          {value}

                          <button
                            type="button"
                            onClick={() => removeValue(index)}
                            className="text-red-500 hover:text-red-700"
                            title="Remove value"
                          >
                            <X size={15} />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 border border-dashed rounded-lg p-4 text-center">
                      No values added yet
                    </p>
                  )}
                </div>
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
                  disabled={saving}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg font-medium"
                >
                  {saving
                    ? "Saving..."
                    : editId !== null
                      ? "Update Attribute"
                      : "Save Attribute"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
