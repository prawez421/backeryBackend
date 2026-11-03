"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

/* =====================================================
   PRODUCTS
===================================================== */

const products = [
  // =====================================================
  // 1 - 4 LOCAL IMAGES
  // =====================================================

  {
    id: 1,
    name: "Cupcakes",
    image: "/images/home/cupcakes.webp",
  },

  {
    id: 2,
    name: "Pastries",
    image: "/images/home/pastries.webp",
  },

  {
    id: 3,
    name: "Baked Cakes",
    image: "/images/home/baked-cakes.webp",
  },

  {
    id: 4,
    name: "Chocolate Cake",
    image: "/images/home/chocolate-cake.webp",
  },

  // =====================================================
  // 5 - 8 ONLINE IMAGE URLs
  // =====================================================

  {
    id: 5,
    name: "Fresh Cookies",
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=80",
  },

  {
    id: 6,
    name: "Fresh Breads",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",
  },

  {
    id: 7,
    name: "Sweet Desserts",
    image:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80",
  },

  {
    id: 8,
    name: "Bakery Snacks",
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80",
  },
];

/* =====================================================
   IMAGE ANIMATION
===================================================== */

const imageVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 25,
  },

  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,

    transition: {
      delay: index * 0.08,
      duration: 0.55,
      ease: "easeOut" as const,
    },
  }),
};

/* =====================================================
   BEST SELLERS SECTION
===================================================== */

export default function BestSellersSection() {
  return (
    <section className="overflow-hidden bg-[#fff9f6] py-6 lg:py-8">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">

        {/* =================================================
            MAIN CONTAINER
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-[#f1dfe3]
            bg-[#fcecef]
          "
        >
          {/* =================================================
              BACKGROUND DECORATION
          ================================================== */}

          <div
            className="
              absolute
              -left-[100px]
              -top-[100px]
              h-[320px]
              w-[320px]
              rounded-full
              bg-[#f8dce2]
            "
          />

          <div
            className="
              absolute
              -bottom-[150px]
              left-[35%]
              h-[350px]
              w-[350px]
              rounded-full
              bg-white/30
              blur-[20px]
            "
          />

          {/* =================================================
              CONTENT GRID
          ================================================== */}

          <div
            className="
              relative
              z-10
              grid
              grid-cols-1
              lg:grid-cols-[0.72fr_1.28fr]
            "
          >
            {/* =================================================
                LEFT CONTENT
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                x: -60,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                flex
                flex-col
                justify-center

                px-7
                py-12

                sm:px-12

                lg:px-12
                lg:py-14

                xl:px-16
              "
            >
              {/* SMALL TITLE */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: 0.2,
                  duration: 0.5,
                }}
                className="
                  mb-4
                  flex
                  items-center
                  gap-2

                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[2.5px]
                  text-[#9a1e2f]
                "
              >
                <Sparkles size={14} />

                Best Sellers
              </motion.div>

              {/* HEADING */}

              <h2
                className="
                  max-w-[480px]

                  font-serif
                  text-[36px]
                  font-semibold
                  leading-[1.1]
                  tracking-[-1px]
                  text-[#261b18]

                  sm:text-[43px]

                  lg:text-[46px]

                  xl:text-[50px]
                "
              >
                Delicious
                <br />

                <span className="italic text-[#9a1e2f]">
                  Bakery Favourites
                </span>
              </h2>

              {/* DESCRIPTION */}

              <p
                className="
                  mt-5
                  max-w-[440px]

                  text-[13px]
                  leading-7
                  text-[#74635e]

                  sm:text-[14px]
                "
              >
                From creamy cupcakes and delicious cakes to fresh
                cookies, breads, desserts and savoury bakery treats —
                discover something delicious for everyone.
              </p>

              {/* =================================================
                  FEATURES
              ================================================== */}

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Fresh Daily",
                  "Premium Ingredients",
                  "Made With Love",
                ].map((item) => (
                  <span
                    key={item}
                    className="
                      rounded-full
                      border
                      border-[#e7cbd1]
                      bg-white/60

                      px-4
                      py-2

                      text-[10px]
                      font-semibold
                      text-[#76555c]
                    "
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* =================================================
                  BUTTON
              ================================================== */}

              <div className="mt-8">
                <Link
                  href="/menu"
                  className="
                    group

                    inline-flex
                    items-center
                    gap-2

                    rounded-full
                    bg-[#8f1728]

                    px-7
                    py-3.5

                    text-[13px]
                    font-semibold
                    text-white

                    shadow-[0_10px_25px_rgba(143,23,40,0.18)]

                    transition-all
                    duration-300

                    hover:-translate-y-1
                    hover:bg-[#761221]
                  "
                >
                  Explore Now

                  <ArrowRight
                    size={15}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </Link>
              </div>
            </motion.div>

            {/* =================================================
                RIGHT PRODUCT GRID
            ================================================== */}

            <div className="p-5 sm:p-7 lg:p-8">
              <div
                className="
                  grid
                  grid-cols-2
                  gap-3

                  sm:gap-4

                  xl:grid-cols-4
                "
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    custom={index}
                    variants={imageVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                      once: true,
                      amount: 0.15,
                    }}
                    whileHover={{
                      y: -5,
                    }}
                    className="
                      group
                      relative

                      h-[190px]
                      overflow-hidden

                      rounded-[18px]
                      bg-white

                      shadow-[0_8px_25px_rgba(70,30,30,0.08)]

                      sm:h-[230px]

                      lg:h-[215px]

                      xl:h-[245px]
                    "
                  >
                    {/* =========================================
                        IMAGE
                    ========================================== */}

                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="
                        (max-width: 640px) 50vw,
                        (max-width: 1279px) 25vw,
                        20vw
                      "
                      className="
                        object-cover

                        transition-transform
                        duration-700
                        ease-out

                        group-hover:scale-110
                      "
                    />

                    {/* =========================================
                        OVERLAY
                    ========================================== */}

                    <div
                      className="
                        absolute
                        inset-0

                        bg-gradient-to-t
                        from-black/60
                        via-black/5
                        to-transparent
                      "
                    />

                    {/* =========================================
                        PRODUCT NAME
                    ========================================== */}

                    <div
                      className="
                        absolute
                        bottom-0
                        left-0
                        right-0

                        p-4
                      "
                    >
                      <p
                        className="
                          font-serif

                          text-[15px]
                          font-semibold
                          text-white

                          drop-shadow

                          sm:text-[16px]
                        "
                      >
                        {product.name}
                      </p>
                    </div>

                    {/* =========================================
                        HOVER ARROW
                    ========================================== */}

                    <div
                      className="
                        absolute
                        right-3
                        top-3

                        flex
                        h-8
                        w-8

                        translate-y-2

                        items-center
                        justify-center

                        rounded-full
                        bg-white

                        text-[#8f1728]

                        opacity-0

                        shadow-lg

                        transition-all
                        duration-300

                        group-hover:translate-y-0
                        group-hover:opacity-100
                      "
                    >
                      <ArrowRight size={14} />
                    </div>

                    {/* =========================================
                        PRODUCT NUMBER
                    ========================================== */}

                    <div
                      className="
                        absolute
                        left-3
                        top-3

                        flex
                        h-7
                        min-w-7

                        items-center
                        justify-center

                        rounded-full

                        border
                        border-white/30

                        bg-black/20

                        px-2

                        text-[9px]
                        font-semibold
                        text-white

                        backdrop-blur-md
                      "
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}