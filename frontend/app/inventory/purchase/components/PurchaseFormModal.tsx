import { Plus, Trash2, X } from "lucide-react";
import type { PurchaseItemForm, PurchaseProduct, SelectOption } from "../page";

const money = (value: number) => `₹${value.toFixed(2)}`;

interface Props {
  open: boolean; saving: boolean;
  suppliers: SelectOption[]; warehouses: SelectOption[]; products: PurchaseProduct[];
  supplierId: string; warehouseId: string; purchaseDate: string; invoiceNumber: string;
  paymentType: string; paidAmount: string; shippingCharge: string; notes: string;
  items: PurchaseItemForm[];
  subtotal: number; totalDiscount: number; totalTax: number; grandTotal: number; dueAmount: number;
  onClose: () => void; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setSupplierId: (v: string) => void; setWarehouseId: (v: string) => void;
  setPurchaseDate: (v: string) => void; setInvoiceNumber: (v: string) => void;
  setPaymentType: (v: string) => void; setPaidAmount: (v: string) => void;
  setShippingCharge: (v: string) => void; setNotes: (v: string) => void;
  onAddItem: () => void; onRemoveItem: (id: number) => void;
  onUpdateItem: (id: number, field: keyof PurchaseItemForm, value: string) => void;
}

export default function PurchaseFormModal(props: Props) {
  if (!props.open) return null;
  const paid = Number(props.paidAmount || 0);
  const paymentStatus = paid === 0 ? "Unpaid" : paid >= props.grandTotal ? "Paid" : "Partial";
  return <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-5">
    <div className="bg-white w-full max-w-6xl rounded-xl shadow-xl max-h-[94vh] overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white flex justify-between items-center p-5 border-b">
        <div><h2 className="text-lg font-bold text-gray-800">Create New Purchase</h2><p className="text-xs text-gray-500 mt-1">Select supplier, warehouse and purchased products.</p></div>
        <button type="button" onClick={props.onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
      </div>
      <form onSubmit={props.onSubmit} className="p-5 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <label className="text-sm font-medium text-gray-700">Supplier *
            <select required value={props.supplierId} onChange={e => props.setSupplierId(e.target.value)} className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2.5">
              <option value="">Select Supplier</option>{props.suppliers.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-gray-700">Warehouse *
            <select required value={props.warehouseId} onChange={e => props.setWarehouseId(e.target.value)} className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2.5">
              <option value="">Select Warehouse</option>{props.warehouses.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-gray-700">Purchase Date *
            <input required type="date" value={props.purchaseDate} onChange={e => props.setPurchaseDate(e.target.value)} className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2.5" />
          </label>
          <label className="text-sm font-medium text-gray-700">Supplier Invoice Number
            <input value={props.invoiceNumber} onChange={e => props.setInvoiceNumber(e.target.value)} placeholder="Invoice number" className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2.5" />
          </label>
          <label className="text-sm font-medium text-gray-700">Payment Type
            <select value={props.paymentType} onChange={e => props.setPaymentType(e.target.value)} className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2.5">
              {["Cash", "UPI", "Bank Transfer", "Cheque", "Credit"].map(x => <option key={x}>{x}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-gray-700">Paid Amount
            <input type="number" min="0" step="0.01" value={props.paidAmount} onChange={e => props.setPaidAmount(e.target.value)} placeholder="0.00" className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2.5" />
          </label>
        </div>

        <section className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 border-b">
            <div><h3 className="font-semibold text-gray-800">Purchase Products</h3><p className="text-xs text-gray-500 mt-1">Add multiple products in one purchase.</p></div>
            <button type="button" onClick={props.onAddItem} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm"><Plus size={16} /> Add Product</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-sm text-left">
              <thead className="bg-white text-gray-600"><tr>{["Product", "Quantity", "Purchase Price", "Discount", "Tax Amount", "Total", "Action"].map(x => <th key={x} className="px-4 py-3">{x}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-100">
                {props.items.map(row => {
                  const total = Math.max(0, Number(row.quantity || 0) * Number(row.purchase_price || 0) - Number(row.discount || 0) + Number(row.tax_amount || 0));
                  return <tr key={row.rowId}>
                    <td className="px-4 py-3"><select required value={row.product_id} onChange={e => props.onUpdateItem(row.rowId, "product_id", e.target.value)} className="w-56 border border-gray-300 rounded-lg px-3 py-2"><option value="">Select Product</option>{props.products.map(p => <option key={p.id} value={p.id}>{p.product_name}{p.sku ? ` (${p.sku})` : ""}</option>)}</select></td>
                    <td className="px-4 py-3"><input required type="number" min="0.001" step="0.001" value={row.quantity} onChange={e => props.onUpdateItem(row.rowId, "quantity", e.target.value)} className="w-24 border border-gray-300 rounded-lg px-3 py-2" /></td>
                    <td className="px-4 py-3"><input required type="number" min="0" step="0.01" value={row.purchase_price} onChange={e => props.onUpdateItem(row.rowId, "purchase_price", e.target.value)} className="w-28 border border-gray-300 rounded-lg px-3 py-2" /></td>
                    <td className="px-4 py-3"><input type="number" min="0" step="0.01" value={row.discount} onChange={e => props.onUpdateItem(row.rowId, "discount", e.target.value)} className="w-24 border border-gray-300 rounded-lg px-3 py-2" /></td>
                    <td className="px-4 py-3"><input type="number" min="0" step="0.01" value={row.tax_amount} onChange={e => props.onUpdateItem(row.rowId, "tax_amount", e.target.value)} className="w-24 border border-gray-300 rounded-lg px-3 py-2" /></td>
                    <td className="px-4 py-3 font-semibold">{money(total)}</td>
                    <td className="px-4 py-3"><button type="button" onClick={() => props.onRemoveItem(row.rowId)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button></td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes / Remarks</label>
            <textarea rows={4} value={props.notes} onChange={e => props.setNotes(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none" placeholder="Purchase notes..." />
            <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">Shipping Charge</label>
            <input type="number" min="0" step="0.01" value={props.shippingCharge} onChange={e => props.setShippingCharge(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5" />
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><strong>{money(props.subtotal)}</strong></div>
            <div className="flex justify-between"><span>Discount</span><strong>{money(props.totalDiscount)}</strong></div>
            <div className="flex justify-between"><span>Tax</span><strong>{money(props.totalTax)}</strong></div>
            <div className="flex justify-between"><span>Shipping</span><strong>{money(Number(props.shippingCharge || 0))}</strong></div>
            <div className="border-t pt-3 flex justify-between"><span className="font-semibold">Grand Total</span><strong className="text-lg">{money(props.grandTotal)}</strong></div>
            <div className="flex justify-between"><span>Paid Amount</span><strong className="text-green-700">{money(paid)}</strong></div>
            <div className="flex justify-between"><span>Due Amount</span><strong className="text-red-600">{money(props.dueAmount)}</strong></div>
            <p className="text-xs text-gray-500">Payment Status: <strong>{paymentStatus}</strong></p>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
          <button type="button" onClick={props.onClose} className="px-5 py-2.5 border rounded-lg text-gray-700">Cancel</button>
          <button type="submit" disabled={props.saving || !props.products.length || !props.suppliers.length || !props.warehouses.length} className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white rounded-lg font-medium">{props.saving ? "Saving..." : "Save Purchase"}</button>
        </div>
      </form>
    </div>
  </div>;
}
