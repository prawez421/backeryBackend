"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

import {
  Heart,
  Plus,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import type { Product } from "./ProductsGrid";

/* =====================================================
   PROPS
===================================================== */

type ProductCardProps = {
  product: Product;
};

/* =====================================================
   CART ITEM TYPE
===================================================== */

type CartItem = Product & {
  quantity: number;
};

/* =====================================================
   PRODUCT CARD
===================================================== */

export default function ProductCard({
  product,
}: ProductCardProps) {
  const router = useRouter();

  const [liked, setLiked] = useState(false);
  const [adding, setAdding] = useState(false);

  /* ===================================================
     DISCOUNT
  =================================================== */

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) /
            product.oldPrice) *
            100
        )
      : 0;

  /* ===================================================
     CATEGORY NAME
  =================================================== */

  const categoryName = product.subcategory
    ? formatName(product.subcategory)
    : formatName(product.category);

  /* ===================================================
     ADD TO CART

     1. Existing cart localStorage se read hoga
     2. Product already hai to quantity +1
     3. Naya product hai to quantity 1
     4. Cart save hoga
     5. /cart page open hoga
  =================================================== */

  const handleAddToCart = () => {
    try {
      setAdding(true);

      const savedCart =
        localStorage.getItem("alibros-cart");

      let cart: CartItem[] = [];

      if (savedCart) {
        try {
          cart = JSON.parse(savedCart);
        } catch {
          cart = [];
        }
      }

      /* ===============================================
         CHECK PRODUCT ALREADY EXISTS
      ================================================ */

      const existingProductIndex =
        cart.findIndex(
          (item) => item.id === product.id
        );

      if (existingProductIndex !== -1) {
        /* =============================================
           PRODUCT ALREADY IN CART
           QUANTITY + 1
        ============================================== */

        cart[existingProductIndex] = {
          ...cart[existingProductIndex],
          quantity:
            (cart[existingProductIndex].quantity || 1) +
            1,
        };
      } else {
        /* =============================================
           NEW PRODUCT
        ============================================== */

        cart.push({
          ...product,
          quantity: 1,
        });
      }

      /* ===============================================
         SAVE CART
      ================================================ */

      localStorage.setItem(
        "alibros-cart",
        JSON.stringify(cart)
      );

      /* ===============================================
         UPDATE NAVBAR CART COUNT

         Navbar same event listen kar sakta hai.
      ================================================ */

      window.dispatchEvent(
        new Event("cart-updated")
      );

      /* ===============================================
         GO TO CART
      ================================================ */

      router.push("/cart");
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      setAdding(false);
    }
  };

  return (
    <motion.article
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-[24px]
        border
        border-[#eadbd5]
        bg-white
        shadow-[0_8px_30px_rgba(65,30,25,0.05)]
        transition-shadow
        duration-300

        hover:shadow-[0_20px_45px_rgba(65,30,25,0.11)]
      "
    >
      {/* =================================================
          IMAGE
      ================================================== */}

      <div
        className="
          relative
          h-[270px]
          overflow-hidden
          bg-[#f7efeb]

          sm:h-[285px]
          xl:h-[265px]
        "
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="
            (max-width: 640px) 100vw,
            (max-width: 1280px) 50vw,
            33vw
          "
          className="
            object-cover
            transition-transform
            duration-[800ms]
            ease-out

            group-hover:scale-[1.07]
          "
        />

        {/* IMAGE OVERLAY */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-black/25
            via-transparent
            to-black/[0.03]
          "
        />

        {/* =================================================
            LEFT BADGES
        ================================================== */}

        <div
          className="
            absolute
            left-4
            top-4
            flex
            flex-col
            items-start
            gap-2
          "
        >
          {/* PRODUCT BADGE */}

          {product.badge && (
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-[#9a1e2f]
                px-3
                py-1.5
                text-[7px]
                font-bold
                uppercase
                tracking-[1px]
                text-white
                shadow-md
              "
            >
              <Sparkles size={8} />

              {product.badge}
            </span>
          )}

          {/* DISCOUNT */}

          {discount > 0 && (
            <span
              className="
                rounded-full
                bg-white
                px-3
                py-1.5
                text-[8px]
                font-bold
                text-[#9a1e2f]
                shadow-md
              "
            >
              {discount}% OFF
            </span>
          )}
        </div>

        {/* =================================================
            WISHLIST
        ================================================== */}

        <motion.button
          type="button"
          whileTap={{
            scale: 0.88,
          }}
          onClick={() =>
            setLiked((prev) => !prev)
          }
          aria-label={
            liked
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          className={`
            absolute
            right-4
            top-4

            flex
            h-10
            w-10
            items-center
            justify-center

            rounded-full

            border
            border-white/60

            shadow-[0_6px_20px_rgba(0,0,0,0.12)]

            backdrop-blur-md

            transition-all
            duration-300

            ${
              liked
                ? `
                    bg-[#9a1e2f]
                    text-white
                  `
                : `
                    bg-white/90
                    text-[#5e4741]

                    hover:bg-[#9a1e2f]
                    hover:text-white
                  `
            }
          `}
        >
          <Heart
            size={15}
            fill={
              liked
                ? "currentColor"
                : "none"
            }
          />
        </motion.button>

        {/* =================================================
            CATEGORY BADGE
        ================================================== */}

        <div
          className="
            absolute
            bottom-4
            left-4
          "
        >
          <span
            className="
              rounded-full
              border
              border-white/30
              bg-black/20
              px-3
              py-1.5
              text-[7px]
              font-bold
              uppercase
              tracking-[1.3px]
              text-white
              backdrop-blur-md
            "
          >
            {categoryName}
          </span>
        </div>

        {/* =================================================
            QUICK ADD BUTTON - DESKTOP
        ================================================== */}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={adding}
          className="
            absolute
            bottom-4
            right-4

            hidden
            h-10
            w-10
            translate-y-3
            items-center
            justify-center

            rounded-full

            bg-white
            text-[#9a1e2f]

            opacity-0

            shadow-lg

            transition-all
            duration-300

            hover:bg-[#9a1e2f]
            hover:text-white

            disabled:cursor-not-allowed
            disabled:opacity-60

            group-hover:translate-y-0
            group-hover:opacity-100

            sm:flex
          "
          aria-label={`Add ${product.name} to cart`}
        >
          {adding ? (
            <span
              className="
                h-4
                w-4
                animate-spin
                rounded-full
                border-2
                border-[#9a1e2f]/30
                border-t-[#9a1e2f]
              "
            />
          ) : (
            <Plus size={16} />
          )}
        </button>
      </div>

      {/* =================================================
          PRODUCT CONTENT
      ================================================== */}

      <div className="p-5">
        {/* SMALL LABEL */}

        <div
          className="
            mb-2
            flex
            items-center
            gap-2
          "
        >
          <span
            className="
              h-[5px]
              w-[5px]
              rounded-full
              bg-[#9a1e2f]
            "
          />

          <p
            className="
              text-[7px]
              font-bold
              uppercase
              tracking-[1.5px]
              text-[#9a1e2f]
            "
          >
            Alibros Bakery
          </p>
        </div>

        {/* =================================================
            PRODUCT NAME
        ================================================== */}

        <h3
          className="
            font-serif
            text-[19px]
            font-semibold
            leading-[1.25]
            tracking-[-0.2px]
            text-[#30211d]

            transition-colors
            duration-300

            group-hover:text-[#9a1e2f]
          "
        >
          {product.name}
        </h3>

        {/* =================================================
            DESCRIPTION
        ================================================== */}

        <p
          className="
            mt-2
            line-clamp-2
            min-h-[38px]
            text-[9px]
            leading-[1.7]
            text-[#8a7771]
          "
        >
          {product.description}
        </p>

        {/* DIVIDER */}

        <div
          className="
            my-4
            h-px
            bg-[#eee2dd]
          "
        />

        {/* =================================================
            PRICE + ADD BUTTON
        ================================================== */}

        <div
          className="
            flex
            items-end
            justify-between
            gap-3
          "
        >
          {/* =================================================
              PRICE
          ================================================== */}

          <div>
            <p
              className="
                mb-1
                text-[7px]
                font-medium
                uppercase
                tracking-[1px]
                text-[#a08c85]
              "
            >
              Starting From
            </p>

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              {/* CURRENT PRICE */}

              <span
                className="
                  font-serif
                  text-[22px]
                  font-semibold
                  leading-none
                  text-[#9a1e2f]
                "
              >
                ₹
                {product.price.toLocaleString(
                  "en-IN"
                )}
              </span>

              {/* OLD PRICE */}

              {product.oldPrice && (
                <span
                  className="
                    text-[9px]
                    text-[#a9958e]
                    line-through
                  "
                >
                  ₹
                  {product.oldPrice.toLocaleString(
                    "en-IN"
                  )}
                </span>
              )}
            </div>
          </div>

          {/* =================================================
              ADD TO CART BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={adding}
            className="
              group/button

              inline-flex
              h-11
              items-center
              justify-center
              gap-2

              rounded-full

              bg-[#281916]

              px-4

              text-[8px]
              font-bold
              text-white

              transition-all
              duration-300

              hover:bg-[#9a1e2f]

              disabled:cursor-not-allowed
              disabled:opacity-60

              sm:px-5
            "
          >
            {adding ? (
              <>
                {/* LOADER */}

                <span
                  className="
                    h-3.5
                    w-3.5
                    animate-spin
                    rounded-full
                    border-2
                    border-white/30
                    border-t-white
                  "
                />

                <span>Adding...</span>
              </>
            ) : (
              <>
                <ShoppingBag
                  size={13}
                  className="
                    transition-transform
                    duration-300

                    group-hover/button:-rotate-6
                  "
                />

                <span>Add</span>

                <Plus
                  size={11}
                  className="
                    transition-transform
                    duration-300

                    group-hover/button:rotate-90
                  "
                />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* =====================================================
   FORMAT CATEGORY NAME

   birthday -> Birthday
   chocolate -> Chocolate
===================================================== */

function formatName(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}