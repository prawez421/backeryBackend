"use client";

import {
  ArrowRight,
  BadgePercent,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

import PriceRow from "./PriceRow";

/* =====================================================
   PROPS
===================================================== */

type CartSummaryProps = {
  subtotal: number;

  // Optional
  deliveryCharge?: number;
  discount?: number;

  // Checkout button click
  onCheckout?: () => void;
};

/* =====================================================
   CART SUMMARY
===================================================== */

export default function CartSummary({
  subtotal,
  deliveryCharge = 0,
  discount = 0,
  onCheckout,
}: CartSummaryProps) {
  /* ===================================================
     CALCULATIONS
  =================================================== */

  const safeSubtotal = Math.max(0, subtotal);

  const safeDelivery = Math.max(
    0,
    deliveryCharge
  );

  const safeDiscount = Math.max(
    0,
    discount
  );

  const grandTotal = Math.max(
    0,
    safeSubtotal +
      safeDelivery -
      safeDiscount
  );

  /* ===================================================
     CHECKOUT
  =================================================== */

  const handleCheckout = () => {
    if (safeSubtotal <= 0) {
      return;
    }

    if (onCheckout) {
      onCheckout();
      return;
    }

    console.log("Proceed to checkout");
  };

  return (
    <aside
      className="
        overflow-hidden
        rounded-[24px]
        border
        border-[#e7d5cf]
        bg-white
        shadow-[0_12px_40px_rgba(67,32,27,0.07)]
      "
    >
      {/* =================================================
          HEADER
      ================================================== */}

      <div
        className="
          flex
          items-center
          gap-3
          border-b
          border-[#eadbd5]
          bg-[#F5E9E5]
          px-5
          py-5

          sm:px-6
        "
      >
        {/* ICON */}

        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#9a1e2f]
            text-white
          "
        >
          <ShoppingBag
            size={16}
            strokeWidth={1.8}
          />
        </div>

        {/* TEXT */}

        <div>
          <h2
            className="
              font-serif
              text-[20px]
              font-semibold
              text-[#30211d]
            "
          >
            Order Summary
          </h2>

          <p
            className="
              mt-0.5
              text-[11px]
              text-[#89736c]
            "
          >
            Review your order total
          </p>
        </div>
      </div>

      {/* =================================================
          SUMMARY CONTENT
      ================================================== */}

      <div
        className="
          px-5
          py-5

          sm:px-6
        "
      >
        {/* =================================================
            PRICE ROWS
        ================================================== */}

        <div className="space-y-1">
          {/* SUBTOTAL */}

          <PriceRow
            label="Subtotal"
            value={safeSubtotal}
            icon={
              <PackageCheck
                size={13}
                strokeWidth={1.8}
              />
            }
          />

          {/* DELIVERY */}

          <PriceRow
            label="Delivery"
            value={safeDelivery}
            showFree
            icon={
              <Truck
                size={13}
                strokeWidth={1.8}
              />
            }
          />

          {/* DISCOUNT */}

          {safeDiscount > 0 && (
            <PriceRow
              label="Discount"
              value={safeDiscount}
              isDiscount
              icon={
                <BadgePercent
                  size={13}
                  strokeWidth={1.8}
                />
              }
            />
          )}
        </div>

        {/* =================================================
            DIVIDER
        ================================================== */}

        <div
          className="
            my-5
            h-px
            bg-[#eadbd5]
          "
        />

        {/* =================================================
            GRAND TOTAL
        ================================================== */}

        <PriceRow
          label="Grand Total"
          value={grandTotal}
          isTotal
        />

        {/* =================================================
            CHECKOUT BUTTON
        ================================================== */}

        <button
          type="button"
          onClick={handleCheckout}
          disabled={safeSubtotal <= 0}
          className="
            group
            mt-6
            flex
            h-[52px]
            w-full
            items-center
            justify-center
            gap-2.5
            rounded-full
            bg-[#9a1e2f]
            px-5

            text-[13px]
            font-semibold
            text-white

            shadow-[0_10px_25px_rgba(154,30,47,0.18)]

            transition-all
            duration-300

            hover:-translate-y-0.5
            hover:bg-[#801827]
            hover:shadow-[0_14px_30px_rgba(154,30,47,0.24)]

            disabled:cursor-not-allowed
            disabled:opacity-50
            disabled:hover:translate-y-0
          "
        >
          Proceed to Checkout

          <ArrowRight
            size={15}
            strokeWidth={1.8}
            className="
              transition-transform
              duration-300

              group-hover:translate-x-1
            "
          />
        </button>

        {/* =================================================
            SECURE CHECKOUT
        ================================================== */}

        <div
          className="
            mt-4
            flex
            items-center
            justify-center
            gap-2
          "
        >
          <ShieldCheck
            size={13}
            strokeWidth={1.7}
            className="text-[#67806d]"
          />

          <p
            className="
              text-[10px]
              text-[#8d7a74]
            "
          >
            Secure &amp; safe checkout
          </p>
        </div>

        {/* =================================================
            SMALL NOTE
        ================================================== */}

        <div
          className="
            mt-5
            rounded-[16px]
            border
            border-[#eadbd5]
            bg-[#fffaf8]
            px-4
            py-3.5
          "
        >
          <div
            className="
              flex
              items-start
              gap-2.5
            "
          >
            <Truck
              size={15}
              strokeWidth={1.7}
              className="
                mt-0.5
                shrink-0
                text-[#9a1e2f]
              "
            />

            <div>
              <p
                className="
                  text-[11px]
                  font-semibold
                  text-[#493630]
                "
              >
                Delivery Information
              </p>

              <p
                className="
                  mt-1
                  text-[10px]
                  leading-[1.6]
                  text-[#8d7973]
                "
              >
                Delivery availability and timing
                will be confirmed during checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}