"use client";

import type { ReactNode } from "react";

/* =====================================================
   PROPS
===================================================== */

type PriceRowProps = {
  label: string;
  value: number;

  // Discount jaise negative amount ke liye
  isDiscount?: boolean;

  // Grand Total ko highlight karne ke liye
  isTotal?: boolean;

  // ₹0 hone par "Free" show karna ho
  showFree?: boolean;

  // Optional icon / extra text
  icon?: ReactNode;
};

/* =====================================================
   PRICE ROW
===================================================== */

export default function PriceRow({
  label,
  value,
  isDiscount = false,
  isTotal = false,
  showFree = false,
  icon,
}: PriceRowProps) {
  /* ===================================================
     FORMAT PRICE
  =================================================== */

  const formattedPrice = Math.abs(value).toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  );

  /* ===================================================
     VALUE TEXT
  =================================================== */

  const getValueText = () => {
    // Delivery = 0
    if (showFree && value === 0) {
      return "Free";
    }

    // Discount
    if (isDiscount) {
      return `- ₹${formattedPrice}`;
    }

    // Normal price
    return `₹${formattedPrice}`;
  };

  /* ===================================================
     GRAND TOTAL ROW
  =================================================== */

  if (isTotal) {
    return (
      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          border-t
          border-[#e5d2cc]
          pt-5
        "
      >
        {/* LABEL */}

        <div>
          <p
            className="
              font-serif
              text-[19px]
              font-semibold
              text-[#30211d]

              sm:text-[20px]
            "
          >
            {label}
          </p>

          <p
            className="
              mt-1
              text-[10px]
              text-[#9a8780]
            "
          >
            Final payable amount
          </p>
        </div>

        {/* TOTAL */}

        <p
          className="
            font-serif
            text-[24px]
            font-semibold
            text-[#9a1e2f]

            sm:text-[27px]
          "
        >
          ₹{formattedPrice}
        </p>
      </div>
    );
  }

  /* ===================================================
     NORMAL PRICE ROW
  =================================================== */

  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        py-2
      "
    >
      {/* LEFT */}

      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        {icon && (
          <span
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
            {icon}
          </span>
        )}

        <span
          className="
            text-[12px]
            font-medium
            text-[#75625c]

            sm:text-[13px]
          "
        >
          {label}
        </span>
      </div>

      {/* RIGHT */}

      <span
        className={`
          text-[12px]
          font-semibold

          sm:text-[13px]

          ${
            isDiscount
              ? "text-[#2f8a59]"
              : showFree && value === 0
                ? "text-[#2f8a59]"
                : "text-[#30211d]"
          }
        `}
      >
        {getValueText()}
      </span>
    </div>
  );
}