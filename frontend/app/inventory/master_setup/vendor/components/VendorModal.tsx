
"use client";

import { useEffect, useState } from "react";
import {
  X,
  Save,
  Truck,
  Trash2,
  AlertTriangle,
  User,
  Phone,
  MapPin,
  CreditCard,
} from "lucide-react";

import type { ChangeEvent, FormEvent } from "react";

// Vendor Interface
export interface Vendor {
  id: number;
  vendor_code: string;
  vendor_name: string;
  company_name: string;
  category: string;
  contact_person: string;
  mobile: string;
  email: string;
  gst_number: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  payment_terms: string;
  opening_balance: number;
  status: "Active" | "Inactive";
  remarks: string;
}

export type VendorFormData = Omit<Vendor, "id">;

type ModalMode = "add" | "edit" | "view" | "delete";

interface VendorModalProps {
  mode: ModalMode | null;
  vendor: Vendor | null;
  onClose: () => void;
  onSubmit: (data: VendorFormData) => void;
  onDelete: (vendor: Vendor) => void;
}

// Default Form
const emptyForm: VendorFormData = {
  vendor_code: "",
  vendor_name: "",
  company_name: "",
  category: "",
  contact_person: "",
  mobile: "",
  email: "",
  gst_number: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  payment_terms: "Cash",
  opening_balance: 0,
  status: "Active",
  remarks: "",
};

// Input Configuration
const sections = [
  {
    title: "Basic Information",
    description: "Enter vendor and company details",
    icon: User,
    fields: [
      { label: "Vendor Code", name: "vendor_code", required: true },
      { label: "Vendor Name", name: "vendor_name", required: true },
      { label: "Company Name", name: "company_name" },
    ],
  },
  {
    title: "Contact Information",
    description: "Vendor contact and GST details",
    icon: Phone,
    fields: [
      { label: "Contact Person", name: "contact_person" },
      { label: "Mobile Number", name: "mobile", required: true, type: "tel" },
      { label: "Email Address", name: "email", type: "email" },
      { label: "GST Number", name: "gst_number" },
    ],
  },
  {
    title: "Address Information",
    description: "Vendor's business location",
    icon: MapPin,
    fields: [
      { label: "City", name: "city" },
      { label: "State", name: "state" },
      { label: "Pincode", name: "pincode" },
    ],
  },
] as const;

const categories = [
  "Raw Material Supplier",
  "Flour Supplier",
  "Sugar Supplier",
  "Dairy Supplier",
  "Bakery Ingredients",
  "Packaging Supplier",
  "Equipment Supplier",
  "Other",
];

const paymentOptions = [
  "Cash",
  "Immediate",
  "7 Days",
  "15 Days",
  "30 Days",
  "45 Days",
  "60 Days",
];

export default function VendorModal({
  mode,
  vendor,
  onClose,
  onSubmit,
  onDelete,
}: VendorModalProps) {
  const [form, setForm] = useState<VendorFormData>(emptyForm);

  const isForm = mode === "add" || mode === "edit";

  useEffect(() => {
    if (mode === "edit" && vendor) {
      setForm({
        ...emptyForm,
        ...vendor,
        gst_number: vendor.gst_number?.toUpperCase() ?? "",
      });
    } else if (mode === "add") {
      setForm({
        ...emptyForm,
        vendor_code: `VEN-${Date.now().toString().slice(-6)}`,
      });
    }
  }, [mode, vendor]);

  if (!mode) return null;

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  const labelClass =
    "mb-2 block text-sm font-semibold text-gray-700";

  // Handle Input Change
  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    let updatedValue: string | number = value;

    if (name === "opening_balance") {
      updatedValue = Number(value);
    }

    // GST automatically uppercase and maximum 15 characters
    if (name === "gst_number") {
      updatedValue = value
        .toUpperCase()
        .replace(/[^0-9A-Z]/g, "")
        .slice(0, 15);
    }

    setForm((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  // Form Validation
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const gstNumber = form.gst_number.trim().toUpperCase();

    // Mobile Validation
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) {
      alert("Please enter a valid 10 digit mobile number.");
      return;
    }

    // Email Validation
    if (
      form.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      alert("Please enter a valid email address.");
      return;
    }

    // GST Validation
    // Format: 22AAAAA0000A1Z5
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

    if (gstNumber && !gstRegex.test(gstNumber)) {
      alert("Please enter a valid 15 character GST number. Example: 22AAAAA0000A1Z5");
      return;
    }

    // Pincode Validation
    if (form.pincode && !/^\d{6}$/.test(form.pincode.trim())) {
      alert("Please enter a valid 6 digit pincode.");
      return;
    }

    // Submit Form
    onSubmit({
      ...form,
      mobile: form.mobile.trim(),
      email: form.email.trim(),
      gst_number: gstNumber,
      pincode: form.pincode.trim(),
    });
  };

  // View Details
  const viewFields = vendor
    ? [
        ["Vendor Code", vendor.vendor_code],
        ["Vendor Name", vendor.vendor_name],
        ["Company Name", vendor.company_name],
        ["Category", vendor.category],
        ["Contact Person", vendor.contact_person],
        ["Mobile Number", vendor.mobile],
        ["Email", vendor.email],
        ["GST Number", vendor.gst_number],
        ["Address", vendor.address],
        ["City", vendor.city],
        ["State", vendor.state],
        ["Pincode", vendor.pincode],
        ["Payment Terms", vendor.payment_terms],
        [
          "Opening Balance",
          `₹${Number(vendor.opening_balance).toLocaleString("en-IN")}`,
        ],
        ["Status", vendor.status],
        ["Remarks", vendor.remarks],
      ]
    : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-5">
      <div className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-orange-50 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange-500 p-3 text-white">
              {mode === "delete" ? (
                <Trash2 size={22} />
              ) : (
                <Truck size={22} />
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {mode === "add" && "Add New Vendor"}
                {mode === "edit" && "Edit Vendor"}
                {mode === "view" && "Vendor Details"}
                {mode === "delete" && "Delete Vendor"}
              </h2>

              <p className="text-xs text-gray-500">
                Bakery Inventory Management
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-white hover:text-gray-800"
          >
            <X size={22} />
          </button>
        </div>

        {/* ADD / EDIT FORM */}
        {isForm && (
          <form
            onSubmit={handleSubmit}
            className="space-y-5 overflow-y-auto p-5 sm:p-7"
          >
            {/* Form Sections */}
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <div
                  key={section.title}
                  className="rounded-2xl border border-gray-100 bg-white p-5"
                >
                  <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4">
                    <div className="rounded-xl bg-orange-50 p-2.5">
                      <Icon className="h-5 w-5 text-orange-600" />
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-800">
                        {section.title}
                      </h3>

                      <p className="text-xs text-gray-400">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {section.fields.map((field) => (
                      <div key={field.name}>
                        <label className={labelClass}>
                          {field.label}

                          {"required" in field && field.required && (
                            <span className="ml-1 text-red-500">*</span>
                          )}
                        </label>

                        <input
                          name={field.name}
                          type={
                            field.name === "gst_number"
                              ? "text"
                              : "type" in field
                                ? field.type
                                : "text"
                          }
                          value={String(form[field.name] ?? "")}
                          onChange={handleChange}
                          required={
                            "required" in field && field.required
                          }
                          readOnly={
                            field.name === "vendor_code" &&
                            mode === "edit"
                          }
                          maxLength={
                            field.name === "gst_number" ? 15 : undefined
                          }
                          autoCapitalize={
                            field.name === "gst_number" ? "characters" : undefined
                          }
                          placeholder={
                            field.name === "gst_number"
                              ? "Example: 22AAAAA0000A1Z5"
                              : `Enter ${field.label}`
                          }
                          className={`${inputClass} ${
                            field.name === "vendor_code" &&
                            mode === "edit"
                              ? "bg-gray-50"
                              : ""
                          }`}
                        />

                        {field.name === "gst_number" && (
                          <p className="mt-1 text-xs text-gray-400">
                            Enter 15-character GSTIN. Letters will
                            automatically become uppercase.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Category */}
                  {section.title === "Basic Information" && (
                    <div className="mt-4">
                      <label className={labelClass}>
                        Vendor Category{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      >
                        <option value="">Select Vendor Category</option>

                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Address */}
            <div className="rounded-2xl border border-gray-100 p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-orange-50 p-2.5">
                  <MapPin className="h-5 w-5 text-orange-600" />
                </div>

                <h3 className="font-bold text-gray-800">
                  Complete Address
                </h3>
              </div>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                placeholder="Enter complete vendor address..."
                className={inputClass}
              />
            </div>

            {/* Payment */}
            <div className="rounded-2xl border border-gray-100 p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-orange-50 p-2.5">
                  <CreditCard className="h-5 w-5 text-orange-600" />
                </div>

                <h3 className="font-bold text-gray-800">
                  Payment Details
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    Payment Terms
                  </label>

                  <select
                    name="payment_terms"
                    value={form.payment_terms}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {paymentOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    Opening Balance (₹)
                  </label>

                  <input
                    type="number"
                    name="opening_balance"
                    min="0"
                    value={form.opening_balance}
                    onChange={handleChange}
                    placeholder="Enter opening balance"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Vendor Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className={labelClass}>
                Remarks (Optional)
              </label>

              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                rows={2}
                placeholder="Enter any additional information..."
                className={inputClass}
              />
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-100 pt-5 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
              >
                <Save size={18} />
                {mode === "edit" ? "Update Vendor" : "Save Vendor"}
              </button>
            </div>
          </form>
        )}

        {/* VIEW VENDOR */}
        {mode === "view" && vendor && (
          <div className="overflow-y-auto p-5 sm:p-7">
            <div className="mb-5 rounded-2xl bg-orange-50 p-5">
              <h3 className="text-xl font-bold text-gray-800">
                {vendor.vendor_name}
              </h3>

              <p className="mt-1 text-sm text-orange-600">
                {vendor.vendor_code}
              </p>

              <span
                className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                  vendor.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {vendor.status}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {viewFields.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-gray-100 p-4"
                >
                  <p className="text-xs text-gray-400">{label}</p>

                  <p className="mt-1 break-words text-sm font-semibold text-gray-800">
                    {value || "-"}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-orange-500 px-7 py-3 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* DELETE VENDOR */}
        {mode === "delete" && vendor && (
          <div className="p-6 sm:p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle size={34} className="text-red-500" />
            </div>

            <h3 className="mt-4 text-center text-xl font-bold text-gray-800">
              Delete Vendor?
            </h3>

            <p className="mt-2 text-center text-sm text-gray-500">
              Are you sure you want to delete this vendor?
            </p>

            <div className="mt-5 rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-400">Vendor Code</p>

              <p className="font-semibold text-orange-600">
                {vendor.vendor_code}
              </p>

              <p className="mt-3 text-xs text-gray-400">
                Vendor Name
              </p>

              <p className="font-semibold text-gray-800">
                {vendor.vendor_name}
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => onDelete(vendor)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700"
              >
                <Trash2 size={18} />
                Confirm Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
