"use client";

import CartItem, {
  type CartProduct,
} from "./CartItem";

/* =====================================================
   PROPS
===================================================== */

type CartListProps = {
  items: CartProduct[];

  onIncrease: (id: number | string) => void;

  onDecrease: (id: number | string) => void;

  onRemove: (id: number | string) => void;
};

/* =====================================================
   CART LIST
===================================================== */

export default function CartList({
  items,
  onIncrease,
  onDecrease,
  onRemove,
}: CartListProps) {
  return (
    <div className="w-full">
      {/* ===============================================
          TOP INFO
      ================================================ */}

      <div
        className="
          mb-4
          hidden
          items-center
          justify-between
          rounded-[16px]
          border
          border-[#eadbd5]
          bg-[#F5E9E5]
          px-5
          py-3

          sm:flex
        "
      >
        <p
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-[1.4px]
            text-[#6e5751]
          "
        >
          Cart Items
        </p>

        <p
          className="
            text-[11px]
            font-medium
            text-[#8b746e]
          "
        >
          {items.length}{" "}
          {items.length === 1
            ? "Product"
            : "Products"}
        </p>
      </div>

      {/* ===============================================
          PRODUCTS
      ================================================ */}

      <div className="space-y-4">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}