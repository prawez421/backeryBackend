
import { Plus, ShoppingCart } from "lucide-react";

interface PurchaseHeaderProps {
  onAdd: () => void;
}

export default function PurchaseHeader({
  onAdd,
}: PurchaseHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

      <div>
        <div className="flex items-center gap-2">
          <div className="bg-amber-100 p-2 rounded-lg">
            <ShoppingCart
              size={23}
              className="text-amber-700"
            />
          </div>

          <h1 className="text-2xl font-bold text-gray-800">
            Purchase Master
          </h1>
        </div>

        <p className="text-sm text-gray-500 mt-2">
          Manage vendor purchases and stock inward.
        </p>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition"
      >
        <Plus size={19} />
        Add Purchase
      </button>

    </div>
  );
}
