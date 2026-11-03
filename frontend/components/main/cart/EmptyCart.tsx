"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CakeSlice,
  ShoppingBag,
} from "lucide-react";

/* =====================================================
   EMPTY CART
===================================================== */

export default function EmptyCart() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-[#eadbd5]
        bg-white
        px-5
        py-14
        text-center

        shadow-[0_12px_40px_rgba(67,32,27,0.05)]

        sm:px-8
        sm:py-16

        lg:py-20
      "
    >
      {/* =================================================
          BACKGROUND DECORATION
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-[100px]
          -top-[100px]
          h-[230px]
          w-[230px]
          rounded-full
          bg-[#F5E9E5]/60
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-[120px]
          -right-[100px]
          h-[250px]
          w-[250px]
          rounded-full
          border
          border-[#9a1e2f]/10
        "
      />

      {/* =================================================
          CONTENT
      ================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[520px]
        "
      >
        {/* =================================================
            ICON
        ================================================== */}

        <div
          className="
            relative
            mx-auto
            flex
            h-[100px]
            w-[100px]
            items-center
            justify-center
            rounded-full
            bg-[#F5E9E5]

            sm:h-[110px]
            sm:w-[110px]
          "
        >
          {/* OUTER CIRCLE */}

          <div
            className="
              absolute
              inset-[8px]
              rounded-full
              border
              border-dashed
              border-[#9a1e2f]/20
            "
          />

          {/* BAG */}

          <ShoppingBag
            size={36}
            strokeWidth={1.4}
            className="
              relative
              z-10
              text-[#9a1e2f]
            "
          />

          {/* SMALL CAKE ICON */}

          <div
            className="
              absolute
              -bottom-1
              -right-1
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border-[4px]
              border-white
              bg-[#9a1e2f]
              text-white
            "
          >
            <CakeSlice
              size={14}
              strokeWidth={1.8}
            />
          </div>
        </div>

        {/* =================================================
            SMALL LABEL
        ================================================== */}

        <p
          className="
            mt-7
            text-[10px]
            font-bold
            uppercase
            tracking-[2.5px]
            text-[#9a1e2f]
          "
        >
          Your Cart
        </p>

        {/* =================================================
            HEADING
        ================================================== */}

        <h2
          className="
            mt-2
            font-serif
            text-[30px]
            font-semibold
            leading-[1.15]
            tracking-[-0.6px]
            text-[#30211d]

            sm:text-[36px]
          "
        >
          Your cart is{" "}

          <span className="italic text-[#9a1e2f]">
            empty.
          </span>
        </h2>

        {/* =================================================
            DESCRIPTION
        ================================================== */}

        <p
          className="
            mx-auto
            mt-4
            max-w-[420px]
            text-[12px]
            leading-6
            text-[#806d67]

            sm:text-[13px]
          "
        >
          Looks like you haven&apos;t added anything
          yet. Explore our cakes, pastries and other
          freshly baked favourites.
        </p>

        {/* =================================================
            BUTTON
        ================================================== */}

        <Link
          href="/menu"
          className="
            group
            mt-7
            inline-flex
            h-[50px]
            items-center
            justify-center
            gap-2.5
            rounded-full
            bg-[#9a1e2f]
            px-7

            text-[12px]
            font-semibold
            text-white

            shadow-[0_10px_25px_rgba(154,30,47,0.18)]

            transition-all
            duration-300

            hover:-translate-y-0.5
            hover:bg-[#801827]
            hover:shadow-[0_14px_30px_rgba(154,30,47,0.23)]
          "
        >
          Browse Our Menu

          <ArrowRight
            size={15}
            strokeWidth={1.8}
            className="
              transition-transform
              duration-300

              group-hover:translate-x-1
            "
          />
        </Link>

        {/* =================================================
            SMALL TEXT
        ================================================== */}

        <p
          className="
            mt-5
            text-[10px]
            text-[#a18e88]
          "
        >
          Freshly baked with care at Alibros Bakery.
        </p>
      </div>
    </motion.div>
  );
}