"use client";

import Image from "next/image";

import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

/* =====================================================
   CART ITEM TYPE
===================================================== */

export type CartProduct = {
  id: number | string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  category?: string;
  subcategory?: string;
  description?: string;
  quantity: number;
};

/* =====================================================
   PROPS
===================================================== */

type CartItemProps = {
  item: CartProduct;

  onIncrease: (id: number | string) => void;

  onDecrease: (id: number | string) => void;

  onRemove: (id: number | string) => void;
};

/* =====================================================
   CART ITEM
===================================================== */

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  /* ===================================================
     ITEM TOTAL
  =================================================== */

  const itemTotal =
    item.price * item.quantity;

  /* ===================================================
     CATEGORY
  =================================================== */

  const category =
    item.subcategory ||
    item.category ||
    "Bakery";

  return (
    <div
      className="
        group
        relative
        rounded-[22px]
        border
        border-[#eadbd5]
        bg-white
        p-3

        shadow-[0_5px_20px_rgba(70,35,30,0.04)]

        transition-all
        duration-300

        hover:border-[#ddc6c0]
        hover:shadow-[0_12px_35px_rgba(70,35,30,0.07)]

        sm:p-4
      "
    >
      <div
        className="
          flex
          flex-col
          gap-4

          sm:flex-row
          sm:items-center
        "
      >
        {/* =================================================
            PRODUCT IMAGE
        ================================================== */}

        <div
          className="
            relative
            h-[170px]
            w-full
            shrink-0
            overflow-hidden
            rounded-[18px]
            bg-[#F5E9E5]

            sm:h-[125px]
            sm:w-[125px]

            lg:h-[135px]
            lg:w-[135px]
          "
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="
              (max-width: 640px) 100vw,
              135px
            "
            className="
              object-cover
              transition-transform
              duration-500

              group-hover:scale-105
            "
          />

          {/* QUANTITY BADGE */}

          <div
            className="
              absolute
              right-2
              top-2

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

              shadow-md
            "
          >
            {item.quantity}
          </div>
        </div>

        {/* =================================================
            PRODUCT DETAILS
        ================================================== */}

        <div
          className="
            min-w-0
            flex-1
          "
        >
          {/* CATEGORY */}

          <p
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-[1.6px]
              text-[#9a1e2f]
            "
          >
            {formatName(category)}
          </p>

          {/* PRODUCT NAME */}

          <h3
            className="
              mt-1.5
              font-serif
              text-[20px]
              font-semibold
              leading-[1.2]
              text-[#30211d]

              sm:text-[21px]
            "
          >
            {item.name}
          </h3>

          {/* DESCRIPTION */}

          {item.description && (
            <p
              className="
                mt-2
                line-clamp-2
                max-w-[460px]
                text-[11px]
                leading-[1.7]
                text-[#8a7771]

                sm:text-[12px]
              "
            >
              {item.description}
            </p>
          )}

          {/* PRICE */}

          <div
            className="
              mt-3
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            <span
              className="
                font-serif
                text-[19px]
                font-semibold
                text-[#9a1e2f]
              "
            >
              ₹
              {item.price.toLocaleString(
                "en-IN"
              )}
            </span>

            {item.oldPrice &&
              item.oldPrice > item.price && (
                <span
                  className="
                    text-[11px]
                    text-[#aa9690]
                    line-through
                  "
                >
                  ₹
                  {item.oldPrice.toLocaleString(
                    "en-IN"
                  )}
                </span>
              )}

            <span
              className="
                text-[10px]
                text-[#9c8983]
              "
            >
              each
            </span>
          </div>

          {/* =================================================
              MOBILE ACTIONS
          ================================================== */}

          <div
            className="
              mt-4
              flex
              items-center
              justify-between
              gap-3

              sm:hidden
            "
          >
            <QuantityControl
              quantity={item.quantity}
              onDecrease={() =>
                onDecrease(item.id)
              }
              onIncrease={() =>
                onIncrease(item.id)
              }
            />

            <button
              type="button"
              onClick={() =>
                onRemove(item.id)
              }
              className="
                flex
                h-10
                w-10
                items-center
                justify-center

                rounded-full

                border
                border-[#eadbd5]

                text-[#9a1e2f]

                transition-all
                duration-300

                hover:border-[#9a1e2f]
                hover:bg-[#9a1e2f]
                hover:text-white
              "
              aria-label={`Remove ${item.name}`}
            >
              <Trash2
                size={15}
                strokeWidth={1.7}
              />
            </button>
          </div>
        </div>

        {/* =================================================
            DESKTOP QUANTITY
        ================================================== */}

        <div
          className="
            hidden
            shrink-0

            sm:block
          "
        >
          <p
            className="
              mb-2
              text-center
              text-[9px]
              font-semibold
              uppercase
              tracking-[1.2px]
              text-[#9c8983]
            "
          >
            Quantity
          </p>

          <QuantityControl
            quantity={item.quantity}
            onDecrease={() =>
              onDecrease(item.id)
            }
            onIncrease={() =>
              onIncrease(item.id)
            }
          />
        </div>

        {/* =================================================
            DESKTOP TOTAL
        ================================================== */}

        <div
          className="
            hidden
            min-w-[110px]
            shrink-0
            text-right

            sm:block
          "
        >
          <p
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[1.2px]
              text-[#9c8983]
            "
          >
            Total
          </p>

          <p
            className="
              mt-2
              font-serif
              text-[21px]
              font-semibold
              text-[#30211d]
            "
          >
            ₹
            {itemTotal.toLocaleString(
              "en-IN"
            )}
          </p>
        </div>

        {/* =================================================
            DESKTOP REMOVE
        ================================================== */}

        <button
          type="button"
          onClick={() =>
            onRemove(item.id)
          }
          aria-label={`Remove ${item.name}`}
          title="Remove item"
          className="
            hidden
            h-10
            w-10
            shrink-0
            items-center
            justify-center

            rounded-full

            border
            border-[#eadbd5]

            text-[#9a1e2f]

            transition-all
            duration-300

            hover:border-[#9a1e2f]
            hover:bg-[#9a1e2f]
            hover:text-white

            sm:flex
          "
        >
          <Trash2
            size={15}
            strokeWidth={1.7}
          />
        </button>
      </div>

      {/* =================================================
          MOBILE ITEM TOTAL
      ================================================== */}

      <div
        className="
          mt-4
          flex
          items-center
          justify-between

          border-t
          border-[#eee2dd]

          pt-3

          sm:hidden
        "
      >
        <span
          className="
            text-[11px]
            font-medium
            text-[#8a7771]
          "
        >
          Item Total
        </span>

        <span
          className="
            font-serif
            text-[20px]
            font-semibold
            text-[#30211d]
          "
        >
          ₹
          {itemTotal.toLocaleString(
            "en-IN"
          )}
        </span>
      </div>
    </div>
  );
}

/* =====================================================
   QUANTITY CONTROL
===================================================== */

function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
}: {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <div
      className="
        inline-flex
        h-11
        items-center

        rounded-full

        border
        border-[#e4d2cd]

        bg-[#fffaf8]

        p-1
      "
    >
      {/* MINUS */}

      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
        className="
          flex
          h-8
          w-8
          items-center
          justify-center

          rounded-full

          text-[#6f5953]

          transition-all
          duration-200

          hover:bg-[#F5E9E5]
          hover:text-[#9a1e2f]

          disabled:cursor-not-allowed
          disabled:opacity-30
        "
      >
        <Minus
          size={13}
          strokeWidth={2}
        />
      </button>

      {/* QUANTITY */}

    <span
  className="
    min-w-[34px]
    text-center
    text-[12px]
    font-bold
    text-[#30211d]
  "
>
  {quantity}
</span>

      {/* PLUS */}

      <button
        type="button"
        onClick={onIncrease}
        aria-label="Increase quantity"
        className="
          flex
          h-8
          w-8
          items-center
          justify-center

          rounded-full

          bg-[#9a1e2f]
          text-white

          transition-all
          duration-200

          hover:bg-[#7f1625]
        "
      >
        <Plus
          size={13}
          strokeWidth={2}
        />
      </button>
    </div>
  );
}

/* =====================================================
   FORMAT CATEGORY
===================================================== */

function formatName(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}