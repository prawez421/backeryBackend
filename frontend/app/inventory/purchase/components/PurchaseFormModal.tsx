"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  X,
  ArrowLeft,
  ShoppingBag,
  Receipt,
  Wallet,
  Package,
  Pencil,
  Check,
  Tag,
  AlertCircle,
} from "lucide-react";

// ==========================================
// INTERFACES
// ==========================================

export interface SelectOption {
  id: number;
  name: string;
}

export interface PurchaseAttributeValue {
  id?: number;
  attribute_value?: string;
  value?: string;
  name?: string;
}

export interface PurchaseAttribute {
  id: number;
  attribute_name?: string;
  name?: string;
  values?: Array<string | PurchaseAttributeValue>;
  attribute_values?: Array<string | PurchaseAttributeValue>;
}

export interface PurchaseProduct {
  id: number;
  product_name: string;
  category_id?: number;
  sku?: string;
  attributes?: PurchaseAttribute[];
  category?: {
    id?: number;
    category_name?: string;
    attributes?: PurchaseAttribute[];
  };
}



export interface PurchaseItemForm {
    rowId: number;
    product_id: string;
    quantity: string;
    purchase_price: string;
    mrp: string;
    selling_price: string;
    discount: string;
    tax: string;
    selected_attributes?: Record<string, string>;
}

type NewPurchaseItem = Omit<PurchaseItemForm, "rowId">;

interface Props {
  mode: "create" | "edit" | "view";
  open: boolean;
  saving: boolean;

  vendors: SelectOption[];
  products: PurchaseProduct[];

  vendorId: string;
  invoiceNumber: string;
  purchaseDate: string;
  paidAmount: string;
  discount: string;
  tax: string;
  remarks: string;

  items: PurchaseItemForm[];

  subtotal: number;
  grandTotal: number;
  dueAmount: number;

  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;

  setVendorId: (value: string) => void;
  setInvoiceNumber: (value: string) => void;
  setPurchaseDate: (value: string) => void;
  setPaidAmount: (value: string) => void;
  setDiscount: (value: string) => void;
  setTax: (value: string) => void;
  setRemarks: (value: string) => void;

  onAddItem: (item: NewPurchaseItem) => void;
  onUpdateItem: (id: number, item: NewPurchaseItem) => void;
  onRemoveItem: (id: number) => void;
}

// ==========================================
// DEFAULT PRODUCT
// ==========================================

const emptyDraft: NewPurchaseItem = {
  product_id: "",
  quantity: "1",
  purchase_price: "",
  mrp: "",
  selling_price: "",
  discount: "0",
  tax: "0",
  selected_attributes: {},
};

// ==========================================
// COMMON STYLES
// ==========================================

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

const labelClass = "block text-sm font-semibold text-slate-700";

// ==========================================
// CURRENCY FORMAT
// ==========================================

const money = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// ==========================================
// NORMALIZE PRODUCT ATTRIBUTES
// ==========================================

const getProductAttributes = (
  product?: PurchaseProduct
): Array<{
  id: number;
  attribute_name: string;
  values: string[];
}> => {
  if (!product) return [];

  const rawAttributes = Array.isArray(product.category?.attributes)
    ? product.category.attributes
    : Array.isArray(product.attributes)
      ? product.attributes
      : [];

  return rawAttributes
    .map((attribute) => {
      const rawValues = Array.isArray(attribute.values)
        ? attribute.values
        : Array.isArray(attribute.attribute_values)
          ? attribute.attribute_values
          : [];

      const values = rawValues
        .map((value) => {
          if (
            typeof value === "string" ||
            typeof value === "number"
          ) {
            return String(value);
          }

          return String(
            value?.attribute_value ??
            value?.value ??
            value?.name ??
            ""
          );
        })
        .filter((value) => value.trim() !== "");

      return {
        id: Number(attribute.id),
        attribute_name:
          attribute.attribute_name ||
          attribute.name ||
          `Attribute ${attribute.id}`,
        values,
      };
    })
    .filter(
      (attribute) =>
        Number.isFinite(attribute.id) && attribute.id > 0
    );
};

// ==========================================
// COMPONENT
// ==========================================

export default function PurchaseFormModal(props: Props) {
  const isView = props.mode === "view";
  const isEdit = props.mode === "edit";
  const isCreate = props.mode === "create";

  const [draft, setDraft] = useState<NewPurchaseItem>({
    ...emptyDraft,
  });

  const [editingRowId, setEditingRowId] = useState<number | null>(
    null
  );

  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================
  // SELECTED PRODUCT
  // ==========================================

  const selectedProduct = useMemo(
    () =>
      props.products.find(
        (product) => product.id === Number(draft.product_id)
      ),
    [props.products, draft.product_id]
  );

  const productAttributes = useMemo(
    () => getProductAttributes(selectedProduct),
    [selectedProduct]
  );

  // ==========================================
  // RESET WHEN MODAL OPENS
  // ==========================================

  useEffect(() => {
    if (props.open) {
      setDraft({ ...emptyDraft });
      setEditingRowId(null);
      setErrorMessage("");
    }
  }, [props.open]);

  if (!props.open) return null;

  // ==========================================
  // UPDATE DRAFT
  // ==========================================

  const updateDraft = (
    field: keyof NewPurchaseItem,
    value: string
  ) => {
    setDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setDraft({ ...emptyDraft });
    setErrorMessage("");
  };

  // ==========================================
  // EDIT PRODUCT
  // ==========================================

  const handleEditProduct = (item: PurchaseItemForm) => {
    setEditingRowId(item.rowId);

    setDraft({
      product_id: item.product_id,
      quantity: item.quantity,
      purchase_price: item.purchase_price,
      mrp: item.mrp,
      selling_price: item.selling_price,
      discount: item.discount,
      tax: item.tax,
      selected_attributes: item.selected_attributes || {},
    });

    setErrorMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // SELECT ATTRIBUTE VALUE
  // ==========================================

  const handleSelectAttribute = (
    attributeName: string,
    value: string
  ) => {
    setDraft((prev) => ({
      ...prev,
      selected_attributes: {
        ...(prev.selected_attributes || {}),
        [attributeName]: value,
      },
    }));
  };

  // ==========================================
  // ADD / UPDATE PRODUCT
  // ==========================================

  const handleAddProduct = () => {
    setErrorMessage("");

    if (!draft.product_id) {
      setErrorMessage("Please select a product.");
      return;
    }

    const quantity = Number(draft.quantity);
    const purchasePrice = Number(draft.purchase_price);
    const mrp = Number(draft.mrp || 0);
    const sellingPrice = Number(draft.selling_price || 0);
    const discount = Number(draft.discount || 0);
    const tax = Number(draft.tax || 0);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      setErrorMessage("Please enter a valid quantity.");
      return;
    }

    if (
      draft.purchase_price === "" ||
      !Number.isFinite(purchasePrice) ||
      purchasePrice < 0
    ) {
      setErrorMessage("Please enter a valid purchase price.");
      return;
    }

    if (
      !Number.isFinite(mrp) ||
      !Number.isFinite(sellingPrice) ||
      !Number.isFinite(discount) ||
      !Number.isFinite(tax) ||
      mrp < 0 ||
      sellingPrice < 0 ||
      discount < 0 ||
      tax < 0
    ) {
      setErrorMessage(
        "Please enter valid price, discount, and tax values."
      );
      return;
    }

    // Validate attribute selection
    const missingAttribute = productAttributes.find(
      (attribute) =>
        !draft.selected_attributes?.[attribute.attribute_name]
    );

    if (missingAttribute) {
      setErrorMessage(
        `Please select ${missingAttribute.attribute_name}.`
      );
      return;
    }

    if (editingRowId !== null) {
      props.onUpdateItem(editingRowId, { ...draft });
      setEditingRowId(null);
    } else {
      props.onAddItem({ ...draft });
    }

    setDraft({ ...emptyDraft });
    setErrorMessage("");
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDeleteProduct = (rowId: number) => {
    if (editingRowId === rowId) {
      handleCancelEdit();
    }

    props.onRemoveItem(rowId);
  };

  // ==========================================
  // PAYMENT CALCULATIONS
  // ==========================================

  const itemDiscount = props.items.reduce(
    (sum, item) => sum + Number(item.discount || 0),
    0
  );

  const itemTax = props.items.reduce(
    (sum, item) => sum + Number(item.tax || 0),
    0
  );

  const totalDiscount =
    itemDiscount + Number(props.discount || 0);

  const totalTax = itemTax + Number(props.tax || 0);

  const paid = Number(props.paidAmount || 0);

  const paymentStatus =
    paid <= 0
      ? "Unpaid"
      : paid >= props.grandTotal
        ? "Paid"
        : "Partial";

  const paymentColor =
    paymentStatus === "Paid"
      ? "bg-emerald-50 text-emerald-700"
      : paymentStatus === "Partial"
        ? "bg-amber-50 text-amber-700"
        : "bg-red-50 text-red-700";

  // ==========================================
  // PRODUCT TOTAL
  // ==========================================

  const getItemTotal = (item: PurchaseItemForm) => {
    const base =
      Number(item.quantity || 0) *
      Number(item.purchase_price || 0);

    return Math.max(
      0,
      base -
      Number(item.discount || 0) +
      Number(item.tax || 0)
    );
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      className={
        isCreate
          ? "min-h-[calc(100vh-80px)] w-full bg-slate-50"
          : "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-2 backdrop-blur-sm sm:p-5"
      }
    >
      <div
        className={
          isCreate
            ? "mx-auto flex min-h-[calc(100vh-80px)] w-full flex-col overflow-hidden bg-slate-50"
            : "flex max-h-[96vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-slate-50 shadow-2xl"
        }
      >
        {/* HEADER */}

        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <ShoppingBag size={23} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isView
                  ? "View Purchase"
                  : isEdit
                    ? "Edit Purchase"
                    : "Create Purchase"}
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {isView
                  ? "Review purchase and payment details."
                  : isEdit
                    ? "Update purchase information and products."
                    : "Add vendor details and purchased products."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={props.onClose}
            disabled={props.saving}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-50"
            title={isCreate ? "Back to purchases" : "Close"}
          >
            {isCreate ? (
              <>
                <ArrowLeft size={17} />
                <span>Back</span>
              </>
            ) : (
              <X size={20} />
            )}
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={(e) => {
            if (isView) {
              e.preventDefault();
              return;
            }

            if (editingRowId !== null) {
              e.preventDefault();
              setErrorMessage(
                "Please update or cancel the product currently being edited."
              );
              return;
            }

            props.onSubmit(e);
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6 lg:p-7">

            {/* PURCHASE INFORMATION */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <Receipt size={19} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-800">
                    Purchase Information
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enter vendor and invoice information.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <label className={labelClass}>
                  Vendor *

                  <select
                    required
                    disabled={isView || props.saving}
                    value={props.vendorId}
                    onChange={(e) =>
                      props.setVendorId(e.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">Select Vendor</option>

                    {props.vendors.map((vendor) => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={labelClass}>
                  Invoice Number *

                  <input
                    required
                    disabled={isView || props.saving}
                    value={props.invoiceNumber}
                    onChange={(e) =>
                      props.setInvoiceNumber(e.target.value)
                    }
                    placeholder="Enter invoice number"
                    className={inputClass}
                  />
                </label>

                <label className={labelClass}>
                  Purchase Date *

                  <input
                    required
                    disabled={isView || props.saving}
                    type="date"
                    value={props.purchaseDate}
                    onChange={(e) =>
                      props.setPurchaseDate(e.target.value)
                    }
                    className={inputClass}
                  />
                </label>
              </div>
            </section>

            {/* PRODUCT FORM */}

            {!isView && (
              <section className="overflow-visible rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-xl bg-amber-100 p-2.5 text-amber-700">
                    {editingRowId !== null ? (
                      <Pencil size={21} />
                    ) : (
                      <Package size={21} />
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800">
                      {editingRowId !== null
                        ? "Edit Purchase Product"
                        : "Add Purchase Product"}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Select a product, choose its attributes, and enter pricing.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

                  {/* PRODUCT */}

                  <label className={labelClass}>
                    Product *

                    <select
                      required
                      disabled={props.saving}
                      value={draft.product_id}
                      onChange={(e) => {
                        setDraft((prev) => ({
                          ...prev,
                          product_id: e.target.value,
                          selected_attributes: {},
                        }));

                        setErrorMessage("");
                      }}
                      className={inputClass}
                    >
                      <option value="">Select Product</option>

                      {props.products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.product_name}
                        </option>
                      ))}
                    </select>
                  </label>

                  {/* CLICKABLE ATTRIBUTE FIELDS */}

                  {productAttributes.map((attribute) => {
                    const attributeId = String(attribute.id);

                    const selectedValue =
                      draft.selected_attributes?.[attribute.attribute_name] || "";

                    return (
                      <div
                        key={attribute.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <label className="mb-3 block text-sm font-bold text-slate-700">
                          {attribute.attribute_name}
                          <span className="ml-1 text-red-500">*</span>
                        </label>

                        <div className="flex flex-wrap gap-2">
                          {attribute.values.length ? (
                            attribute.values.map((value, index) => {
                              const isSelected =
                                draft.selected_attributes?.[attribute.attribute_name] === value;

                              return (
                                <button
                                  key={`${attribute.id}-${index}`}
                                  type="button"
                                  disabled={props.saving}
                                  onClick={() =>
                                    handleSelectAttribute(
                                      attribute.attribute_name,
                                      value
                                    )
                                  }
                                  className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${isSelected
                                    ? "border-amber-600 bg-amber-600 text-white shadow-sm"
                                    : "border-slate-200 bg-white text-slate-700 hover:border-amber-400 hover:bg-amber-50"
                                    }`}
                                >
                                  {value}

                                  {isSelected && (
                                    <Check
                                      size={15}
                                      className="ml-2 inline-block"
                                    />
                                  )}
                                </button>
                              );
                            })
                          ) : (
                            <p className="text-xs text-slate-400">
                              No values available.
                            </p>
                          )}
                        </div>

                        <p className="mt-3 text-xs text-slate-500">
                          Selected: {selectedValue || "Not selected"}
                        </p>
                      </div>
                    );
                  })}

                  {/* QUANTITY */}

                  <label className={labelClass}>
                    Quantity *

                    <input
                      type="number"
                      min="0.001"
                      step="0.001"
                      disabled={props.saving}
                      value={draft.quantity}
                      onChange={(e) =>
                        updateDraft("quantity", e.target.value)
                      }
                      placeholder="Enter quantity"
                      className={inputClass}
                    />
                  </label>

                  {/* PURCHASE PRICE */}

                  <label className={labelClass}>
                    Purchase Price *

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={props.saving}
                      value={draft.purchase_price}
                      onChange={(e) =>
                        updateDraft(
                          "purchase_price",
                          e.target.value
                        )
                      }
                      placeholder="0.00"
                      className={inputClass}
                    />
                  </label>

                  {/* MRP */}

                  <label className={labelClass}>
                    MRP

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={props.saving}
                      value={draft.mrp}
                      onChange={(e) =>
                        updateDraft("mrp", e.target.value)
                      }
                      placeholder="0.00"
                      className={inputClass}
                    />
                  </label>

                  {/* SELLING PRICE */}

                  <label className={labelClass}>
                    Selling Price

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={props.saving}
                      value={draft.selling_price}
                      onChange={(e) =>
                        updateDraft("selling_price", e.target.value)
                      }
                      placeholder="0.00"
                      className={inputClass}
                    />
                  </label>

                  {/* DISCOUNT */}

                  <label className={labelClass}>
                    Discount

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={props.saving}
                      value={draft.discount}
                      onChange={(e) =>
                        updateDraft("discount", e.target.value)
                      }
                      placeholder="0.00"
                      className={inputClass}
                    />
                  </label>

                  {/* TAX */}

                  <label className={labelClass}>
                    Tax

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={props.saving}
                      value={draft.tax}
                      onChange={(e) =>
                        updateDraft("tax", e.target.value)
                      }
                      placeholder="0.00"
                      className={inputClass}
                    />
                  </label>
                </div>

                {/* SELECTED ATTRIBUTES */}

                {productAttributes.length > 0 && (
                  <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50/50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Tag
                        size={16}
                        className="text-amber-700"
                      />

                      <p className="text-xs font-bold uppercase tracking-wide text-amber-800">
                        Selected Product Attributes
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {productAttributes.map((attribute) => {
                        const value =
                          draft.selected_attributes?.[attribute.attribute_name];
                        return (
                          <span
                            key={attribute.id}
                            className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs font-medium text-slate-700"
                          >
                            <span className="text-slate-400">
                              {attribute.attribute_name}:
                            </span>{" "}
                            {value || "Not selected"}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ERROR MESSAGE */}

                {errorMessage && (
                  <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle
                      size={18}
                      className="mt-0.5 shrink-0"
                    />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* NO PRODUCTS */}

                {!props.products.length && (
                  <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                    No active products are available. Please check your product list.
                  </div>
                )}

                {/* NO ATTRIBUTES */}

                {selectedProduct &&
                  productAttributes.length === 0 && (
                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                      No attributes are available for this product.
                    </div>
                  )}

                {/* ACTION BUTTONS */}

                <div className="mt-6 flex flex-col justify-end gap-3 border-t border-slate-100 pt-5 sm:flex-row">
                  {editingRowId !== null && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={props.saving}
                      className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleAddProduct}
                    disabled={
                      props.saving || !props.products.length
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {editingRowId !== null ? (
                      <>
                        <Check size={18} />
                        Update Product
                      </>
                    ) : (
                      <>
                        <Plus size={19} />
                        Add Product
                      </>
                    )}
                  </button>
                </div>
              </section>
            )}

            {/* ADDED PRODUCTS */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-bold text-slate-800">
                    Added Products
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Review all products included in this purchase.
                  </p>
                </div>

                <span className="w-fit rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700">
                  {props.items.length} Products
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      {[
                        "S.No",
                        "Product",
                        "Attributes",
                        "Quantity",
                        "Purchase Price",
                        "MRP",
                        "Selling Price",
                        "Discount",
                        "Tax",
                        "Total",
                        ...(!isView ? ["Action"] : []),
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="whitespace-nowrap px-4 py-4 font-bold"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {props.items.map((item, index) => {
                      const product = props.products.find(
                        (p) =>
                          p.id === Number(item.product_id)
                      );

                      const attributes = getProductAttributes(product);

                     const savedAttributes = item.selected_attributes || {};

                      return (
                        <tr
                          key={item.rowId}
                          className="transition hover:bg-amber-50/30"
                        >
                          <td className="px-4 py-4 text-slate-500">
                            {index + 1}
                          </td>

                          <td className="px-4 py-4 font-semibold text-slate-800">
                            {product?.product_name ||
                              `Product #${item.product_id}`}
                          </td>

                         <td className="px-4 py-4">
    {Object.keys(savedAttributes).length > 0 ? (
        <div className="flex min-w-[150px] flex-wrap gap-1.5">
            {Object.entries(savedAttributes).map(
                ([attributeName, value]) => (
                    <span
                        key={attributeName}
                        className="rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800"
                    >
                        {attributeName}: {value}
                    </span>
                )
            )}
        </div>
    ) : (
        <span className="text-slate-400">—</span>
    )}
</td>

                          <td className="px-4 py-4 text-slate-700">
                            {item.quantity}
                          </td>

                          <td className="px-4 py-4 text-slate-700">
                            {money(Number(item.purchase_price))}
                          </td>

                          <td className="px-4 py-4 text-slate-700">
                            {money(Number(item.mrp))}
                          </td>

                          <td className="px-4 py-4 text-slate-700">
                            {money(Number(item.selling_price))}
                          </td>

                          <td className="px-4 py-4 text-red-600">
                            {money(Number(item.discount))}
                          </td>

                          <td className="px-4 py-4 text-slate-700">
                            {money(Number(item.tax))}
                          </td>

                          <td className="px-4 py-4 font-bold text-slate-900">
                            {money(getItemTotal(item))}
                          </td>

                          {!isView && (
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  disabled={props.saving}
                                  onClick={() =>
                                    handleEditProduct(item)
                                  }
                                  className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 disabled:opacity-50"
                                  title="Edit product"
                                >
                                  <Pencil size={17} />
                                </button>

                                <button
                                  type="button"
                                  disabled={props.saving}
                                  onClick={() =>
                                    handleDeleteProduct(item.rowId)
                                  }
                                  className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                                  title="Remove product"
                                >
                                  <Trash2 size={17} />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}

                    {props.items.length === 0 && (
                      <tr>
                        <td
                          colSpan={isView ? 10 : 11}
                          className="px-4 py-16 text-center"
                        >
                          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                            <Package size={27} />
                          </div>

                          <p className="font-semibold text-slate-600">
                            No Products Added
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Select a product and click Add Product to get started.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* REMARKS AND PAYMENT */}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

              {/* REMARKS */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 border-b border-slate-100 pb-4">
                  <h3 className="font-bold text-slate-800">
                    Additional Information
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Add any notes related to this purchase.
                  </p>
                </div>

                <label className={labelClass}>
                  Remarks

                  <textarea
                    rows={6}
                    disabled={isView || props.saving}
                    value={props.remarks}
                    onChange={(e) =>
                      props.setRemarks(e.target.value)
                    }
                    placeholder="Enter purchase remarks..."
                    className={`${inputClass} resize-none`}
                  />
                </label>
              </section>

              {/* PAYMENT SUMMARY */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                    <Wallet size={19} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800">
                      Payment Summary
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Review purchase totals and payment details.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Subtotal
                    </span>

                    <strong className="text-slate-800">
                      {money(props.subtotal)}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="purchase-discount"
                      className="text-slate-600"
                    >
                      Overall Discount
                    </label>

                    <input
                      id="purchase-discount"
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={isView || props.saving}
                      value={props.discount}
                      onChange={(e) =>
                        props.setDiscount(e.target.value)
                      }
                      className="w-32 rounded-lg border border-slate-200 px-3 py-2 text-right outline-none focus:border-amber-500 disabled:bg-slate-100"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="purchase-tax"
                      className="text-slate-600"
                    >
                      Overall Tax
                    </label>

                    <input
                      id="purchase-tax"
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={isView || props.saving}
                      value={props.tax}
                      onChange={(e) =>
                        props.setTax(e.target.value)
                      }
                      className="w-32 rounded-lg border border-slate-200 px-3 py-2 text-right outline-none focus:border-amber-500 disabled:bg-slate-100"
                    />
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Total Discount
                    </span>

                    <strong className="text-red-600">
                      - {money(totalDiscount)}
                    </strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Total Tax
                    </span>

                    <strong className="text-slate-800">
                      {money(totalTax)}
                    </strong>
                  </div>

                  <div className="flex justify-between border-t border-slate-100 pt-4">
                    <span className="font-bold text-slate-800">
                      Grand Total
                    </span>

                    <strong className="text-xl font-bold text-amber-600">
                      {money(props.grandTotal)}
                    </strong>
                  </div>

                  <label className={labelClass}>
                    Paid Amount

                    <input
                      type="number"
                      min="0"
                      max={props.grandTotal}
                      step="0.01"
                      disabled={isView || props.saving}
                      value={props.paidAmount}
                      onChange={(e) =>
                        props.setPaidAmount(e.target.value)
                      }
                      className={inputClass}
                    />
                  </label>

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Due Amount
                    </span>

                    <strong className="font-bold text-red-600">
                      {money(props.dueAmount)}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                    <span className="font-semibold text-slate-600">
                      Payment Status
                    </span>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ${paymentColor}`}
                    >
                      {paymentStatus}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* FOOTER */}

          <div className="flex shrink-0 flex-col-reverse justify-end gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:px-7">
            <button
              type="button"
              onClick={props.onClose}
              disabled={props.saving}
              className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              {isView ? "Close" : "Cancel"}
            </button>

            {!isView && (
              <button
                type="submit"
                disabled={
                  props.saving ||
                  editingRowId !== null ||
                  !props.vendors.length ||
                  !props.items.length ||
                  !props.products.length
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {props.saving
                  ? "Saving Purchase..."
                  : isEdit
                    ? "Update Purchase"
                    : "Save Purchase"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}