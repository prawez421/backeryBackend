
"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";

// ==========================================
// INTERFACES
// ==========================================

export interface SelectOption {
  id: number;
  name: string;
}

export interface PurchaseProduct {
  id: number;
  product_name: string;
  sku?: string;
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
};

// ==========================================
// COMMON STYLES
// ==========================================

const inputClass =
  "mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:bg-gray-100 disabled:text-gray-600";

const labelClass = "block text-sm font-medium text-gray-700";

// ==========================================
// CURRENCY FORMAT
// ==========================================

const money = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

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

  // Currently editing product row ID
  const [editingRowId, setEditingRowId] = useState<number | null>(null);

  // ==========================================
  // RESET FORM WHEN MODAL OPENS
  // ==========================================

  useEffect(() => {
    if (props.open) {
      setDraft({ ...emptyDraft });
      setEditingRowId(null);
    }
  }, [props.open]);

  if (!props.open) return null;

  // ==========================================
  // UPDATE PRODUCT DRAFT
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
  // CANCEL PRODUCT EDIT
  // ==========================================

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setDraft({ ...emptyDraft });
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
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // ADD / UPDATE PRODUCT
  // ==========================================

  const handleAddProduct = () => {
    if (!draft.product_id) {
      alert("Please select a product.");
      return;
    }

    const quantity = Number(draft.quantity);
    const purchasePrice = Number(draft.purchase_price);
    const mrp = Number(draft.mrp || 0);
    const sellingPrice = Number(draft.selling_price || 0);
    const discount = Number(draft.discount || 0);
    const tax = Number(draft.tax || 0);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (
      draft.purchase_price === "" ||
      !Number.isFinite(purchasePrice) ||
      purchasePrice < 0
    ) {
      alert("Please enter a valid purchase price.");
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
      alert("Please enter valid price, discount and tax.");
      return;
    }

    if (editingRowId !== null) {
      // Update existing row
      props.onUpdateItem(editingRowId, { ...draft });

      setEditingRowId(null);
    } else {
      // Add new row
      props.onAddItem({ ...draft });
    }

    // Reset product form
    setDraft({ ...emptyDraft });
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

  const totalTax =
    itemTax + Number(props.tax || 0);

  const paid = Number(props.paidAmount || 0);

  const paymentStatus =
    paid <= 0
      ? "Unpaid"
      : paid >= props.grandTotal
        ? "Paid"
        : "Partial";

  const paymentColor =
    paymentStatus === "Paid"
      ? "bg-green-50 text-green-700"
      : paymentStatus === "Partial"
        ? "bg-amber-50 text-amber-700"
        : "bg-red-50 text-red-700";

  // ==========================================
  // PRODUCT ROW TOTAL
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
          ? "w-full min-h-[calc(100vh-80px)] bg-slate-50"
          : "fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-2 backdrop-blur-sm sm:p-5"
      }
    >
      <div
        className={
          isCreate
            ? "mx-auto flex min-h-[calc(100vh-80px)] w-full flex-col overflow-hidden bg-slate-50"
            : "flex max-h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        }
      >
        {/* HEADER */}

        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <ShoppingBag size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {isView
                  ? "View Purchase"
                  : isEdit
                    ? "Edit Purchase"
                    : "Create Purchase"}
              </h2>

              <p className="text-xs text-gray-500">
                {isView
                  ? "Purchase details and payment information."
                  : isEdit
                    ? "Update vendor invoice and purchased products."
                    : "Create a new purchase with vendor and products."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={props.onClose}
            disabled={props.saving}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
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

            props.onSubmit(e);
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-6 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-7">

            {/* PURCHASE INFORMATION */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-2 border-b pb-3">
                <Receipt size={18} className="text-amber-600" />

                <h3 className="font-semibold text-gray-800">
                  Purchase Information
                </h3>
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

            {/* ADD / EDIT PRODUCT FORM */}

            {!isView && (
              <section className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">

                <div className="mb-5 flex items-center gap-3 border-b pb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    {editingRowId !== null ? (
                      <Pencil size={20} />
                    ) : (
                      <Package size={20} />
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {editingRowId !== null
                        ? "Edit Purchase Product"
                        : "Add Purchase Product"}
                    </h3>

                    <p className="text-xs text-gray-500">
                      {editingRowId !== null
                        ? "Update the selected product details."
                        : "Enter product details and click Add Product."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                  {/* PRODUCT */}

                  <label className={labelClass}>
                    Product *

                    <select
                      required
                      disabled={props.saving}
                      value={draft.product_id}
                      onChange={(e) =>
                        updateDraft("product_id", e.target.value)
                      }
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
                        updateDraft("purchase_price", e.target.value)
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
                      className={inputClass}
                    />
                  </label>

                  {/* ACTION BUTTONS */}

                  <div className="flex items-end gap-2">
                    <button
                      type="button"
                      onClick={handleAddProduct}
                      disabled={
                        props.saving ||
                        !props.products.length
                      }
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:opacity-50"
                    >
                      {editingRowId !== null ? (
                        <>
                          <Pencil size={17} />
                          Update Product
                        </>
                      ) : (
                        <>
                          <Plus size={17} />
                          Add Product
                        </>
                      )}
                    </button>

                    {editingRowId !== null && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={props.saving}
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                </div>

                {!props.products.length && (
                  <p className="mt-3 text-xs text-red-500">
                    No active products available.
                  </p>
                )}
              </section>
            )}

            {/* ADDED PRODUCTS */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="flex items-center justify-between border-b p-5">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Added Products
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Products added to this purchase.
                  </p>
                </div>

                <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                  {props.items.length} Products
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] text-left text-sm">

                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      {[
                        "S.No",
                        "Product",
                        "Quantity",
                        "Purchase Price",
                        "MRP",
                        "Selling Price",
                        "Discount",
                        "Tax",
                        "Total",
                        ...(!isView ? ["Action"] : []),
                      ].map((heading) => (
                        <th key={heading} className="px-3 py-4">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">

                    {props.items.map((item, index) => {
                      const product = props.products.find(
                        (p) => p.id === Number(item.product_id)
                      );

                      return (
                        <tr
                          key={item.rowId}
                          className="hover:bg-amber-50/30"
                        >
                          <td className="px-3 py-4 text-gray-500">
                            {index + 1}
                          </td>

                          <td className="px-3 py-4 font-medium text-gray-800">
                            {product?.product_name ||
                              `Product #${item.product_id}`}
                          </td>

                          <td className="px-3 py-4">
                            {item.quantity}
                          </td>

                          <td className="px-3 py-4">
                            {money(Number(item.purchase_price))}
                          </td>

                          <td className="px-3 py-4">
                            {money(Number(item.mrp))}
                          </td>

                          <td className="px-3 py-4">
                            {money(Number(item.selling_price))}
                          </td>

                          <td className="px-3 py-4 text-red-600">
                            {money(Number(item.discount))}
                          </td>

                          <td className="px-3 py-4">
                            {money(Number(item.tax))}
                          </td>

                          <td className="px-3 py-4 font-semibold">
                            {money(getItemTotal(item))}
                          </td>

                          {/* EDIT AND DELETE */}

                          {!isView && (
                            <td className="px-3 py-4">
                              <div className="flex items-center gap-2">

                                <button
                                  type="button"
                                  disabled={props.saving}
                                  onClick={() =>
                                    handleEditProduct(item)
                                  }
                                  className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 disabled:opacity-50"
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
                                  className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
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
                          colSpan={isView ? 9 : 10}
                          className="px-4 py-14 text-center"
                        >
                          <Package
                            size={35}
                            className="mx-auto mb-3 text-gray-300"
                          />

                          <p className="font-medium text-gray-600">
                            No products added yet
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Add your first product using the form above.
                          </p>
                        </td>
                      </tr>
                    )}

                  </tbody>
                </table>
              </div>
            </section>

            {/* REMARKS AND PAYMENT SUMMARY */}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

              {/* REMARKS */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 font-semibold text-gray-800">
                  Additional Information
                </h3>

                <label className={labelClass}>
                  Remarks

                  <textarea
                    rows={5}
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

                <div className="mb-5 flex items-center gap-2 border-b pb-3">
                  <Wallet size={19} className="text-amber-600" />

                  <h3 className="font-semibold text-gray-800">
                    Payment Summary
                  </h3>
                </div>

                <div className="space-y-4 text-sm">

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Subtotal
                    </span>

                    <strong>{money(props.subtotal)}</strong>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="purchase-discount">
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
                      className="w-28 rounded-lg border px-3 py-2 text-right disabled:bg-gray-100"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="purchase-tax">
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
                      className="w-28 rounded-lg border px-3 py-2 text-right disabled:bg-gray-100"
                    />
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Total Discount
                    </span>

                    <strong className="text-red-600">
                      - {money(totalDiscount)}
                    </strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Total Tax
                    </span>

                    <strong>{money(totalTax)}</strong>
                  </div>

                  <div className="flex justify-between border-t pt-4">
                    <span className="font-semibold">
                      Grand Total
                    </span>

                    <strong className="text-xl text-amber-600">
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
                    <span className="text-gray-500">
                      Due Amount
                    </span>

                    <strong className="text-red-600">
                      {money(props.dueAmount)}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                    <span>Payment Status</span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${paymentColor}`}
                    >
                      {paymentStatus}
                    </span>
                  </div>

                </div>
              </section>
            </div>
          </div>

          {/* FOOTER */}

          <div className="flex shrink-0 flex-col-reverse justify-end gap-3 border-t border-slate-200 bg-white px-5 py-4 shadow-[0_-4px_16px_rgba(15,23,42,0.04)] sm:flex-row sm:px-7">

            <button
              type="button"
              onClick={props.onClose}
              disabled={props.saving}
              className="rounded-lg border px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
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
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-7 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
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
