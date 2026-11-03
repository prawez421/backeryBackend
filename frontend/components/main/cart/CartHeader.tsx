"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

type CartHeaderProps = {
  totalItems: number;
};

export default function CartHeader({
  totalItems,
}: CartHeaderProps) {
  return (
    <div
      className="
        mb-6
        flex
        flex-col
        gap-4
        border-b
        border-[#eadbd5]
        pb-5

        sm:flex-row
        sm:items-end
        sm:justify-between
      "
    >
      {/* =========================================
          LEFT SIDE
      ========================================== */}

      <div>
        {/* SMALL LABEL */}

        <div
          className="
            mb-2
            flex
            items-center
            gap-2
          "
        >
          <div
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              bg-[#F5E9E5]
              text-[#9a1e2f]
            "
          >
            <ShoppingBag
              size={13}
              strokeWidth={1.8}
            />
          </div>

          <span
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[2px]
              text-[#9a1e2f]
            "
          >
            Your Order
          </span>
        </div>

        {/* TITLE */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <h1
            className="
              font-serif
              text-[32px]
              font-semibold
              leading-none
              tracking-[-0.8px]
              text-[#2f211d]

              sm:text-[38px]
              lg:text-[42px]
            "
          >
            My Cart
          </h1>

          {/* ITEM COUNT */}

          {totalItems > 0 && (
            <span
              className="
                flex
                h-7
                min-w-7
                items-center
                justify-center
                rounded-full
                bg-[#9a1e2f]
                px-2
                text-[10px]
                font-bold
                text-white
              "
            >
              {totalItems}
            </span>
          )}
        </div>

        {/* DESCRIPTION */}

        <p
          className="
            mt-2
            text-[12px]
            text-[#806d67]

            sm:text-[13px]
          "
        >
          {totalItems > 0
            ? `${totalItems} ${
                totalItems === 1 ? "item" : "items"
              } in your shopping cart.`
            : "Your shopping cart is currently empty."}
        </p>
      </div>

      {/* =========================================
          CONTINUE SHOPPING
      ========================================== */}

      <Link
        href="/menu"
        className="
          group
          inline-flex
          w-fit
          items-center
          justify-center
          gap-2.5
          rounded-full
          border
          border-[#dfcbc5]
          bg-white
          px-5
          py-3

          text-[12px]
          font-semibold
          text-[#3c2b26]

          transition-all
          duration-300

          hover:border-[#9a1e2f]
          hover:bg-[#9a1e2f]
          hover:text-white
        "
      >
        <ArrowLeft
          size={15}
          strokeWidth={1.8}
          className="
            transition-transform
            duration-300
            group-hover:-translate-x-1
          "
        />

        Continue Shopping
      </Link>
    </div>
  );
}