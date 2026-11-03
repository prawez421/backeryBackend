"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* =====================================================
   BAKERY CATEGORIES DATA
===================================================== */
const categories = [
  // ============================
  // 1-4 LOCAL IMAGES
  // ============================

  {
    id: 1,
    name: "Cupcakes",
    description: "Chocolate, vanilla, red velvet & custom cupcakes",
    image: "/images/home/cupcakes.webp",
    href: "/menu?category=cupcakes",
  },
  {
    id: 2,
    name: "Pastries",
    description: "Chocolate, black forest, red velvet & creamy pastries",
    image: "/images/home/pastries.webp",
    href: "/menu?category=pastries",
  },
  {
    id: 3,
    name: "Cakes",
    description: "Birthday, anniversary, wedding & celebration cakes",
    image: "/images/home/baked-cakes.webp",
    href: "/cakes",
  },
  {
    id: 4,
    name: "Custom Cakes",
    description: "Beautiful cakes designed specially for your celebrations",
    image: "/images/home/chocolate-cake.webp",
    href: "/custom-cakes",
  },

  // ============================
  // 5-8 ONLINE IMAGE URLs
  // ============================

  {
    id: 5,
    name: "Cookies",
    description: "Chocolate chip, butter, almond & oatmeal cookies",
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=80",
    href: "/menu?category=cookies",
  },
  {
    id: 6,
    name: "Breads",
    description: "White, brown, garlic & multigrain fresh breads",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",
    href: "/menu?category=breads",
  },
  {
    id: 7,
    name: "Desserts",
    description: "Brownies, cheesecakes, mousse, jar cakes & donuts",
    image:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80",
    href: "/menu?category=desserts",
  },
  {
    id: 8,
    name: "Snacks",
    description: "Puffs, patties, sandwiches, pizza & garlic bread",
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80",
    href: "/menu?category=snacks",
  },
];

/* =====================================================
   ANIMATION VARIANTS
===================================================== */

const containerVariants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.55,
      ease: "easeOut" as const,
    },
  },
};

/* =====================================================
   BAKERY CATEGORIES COMPONENT
===================================================== */

export default function BakeryCategories() {
  return (
    <section
      className="
        overflow-hidden
        bg-[#fff9f6]
        py-10
        sm:py-12
        lg:py-14
      "
    >
      <div
        className="
          mx-auto
          max-w-[1400px]
          px-5
          sm:px-8
          lg:px-12
        "
      >
        {/* =================================================
            SECTION HEADING
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="
            mx-auto
            mb-9
            max-w-[650px]
            text-center
            sm:mb-10
          "
        >
          {/* SMALL HEADING */}

          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-px w-7 bg-[#a71930]" />

            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[3px]
                text-[#a71930]
                sm:text-[11px]
              "
            >
              Explore Our Bakery
            </p>

            <span className="h-px w-7 bg-[#a71930]" />
          </div>

          {/* MAIN HEADING */}

          <h2
            className="
              font-serif
              text-[31px]
              font-semibold
              leading-tight
              tracking-[-1px]
              text-[#241a17]
              sm:text-[38px]
              lg:text-[43px]
            "
          >
            Our Bakery{" "}
            <span className="italic text-[#a71930]">
              Categories
            </span>
          </h2>

          {/* DESCRIPTION */}

          <p
            className="
              mx-auto
              mt-3
              max-w-[550px]
              text-[12px]
              leading-6
              text-[#766863]
              sm:text-[13px]
            "
          >
            From celebration cakes and creamy pastries to fresh breads,
            cookies and savoury snacks — discover something delicious
            for every craving.
          </p>
        </motion.div>

        {/* =================================================
            CATEGORY GRID
        ================================================== */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.08,
          }}
          className="
            grid
            grid-cols-1
            gap-4
            min-[500px]:grid-cols-2
            lg:grid-cols-4
            xl:gap-5
          "
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={cardVariants}
              whileHover={{
                y: -6,
              }}
              transition={{
                duration: 0.25,
              }}
              className="h-full"
            >
              <Link
                href={category.href}
                className="
                  group
                  relative
                  flex
                  h-full
                  flex-col
                  overflow-hidden
                  rounded-[20px]
                  border
                  border-[#eee0da]
                  bg-white
                  shadow-[0_7px_25px_rgba(70,30,30,0.05)]
                  transition-all
                  duration-300

                  hover:border-[#e3c9c3]
                  hover:shadow-[0_18px_40px_rgba(70,30,30,0.10)]
                "
              >
                {/* =========================================
                    CATEGORY IMAGE
                ========================================== */}

                <div
                  className="
                    relative
                    h-[210px]
                    w-full
                    overflow-hidden
                    sm:h-[220px]
                    lg:h-[205px]
                    xl:h-[225px]
                  "
                >
                  <Image
                    src={category.image}
                    alt={`${category.name} - Alibros Bakery`}
                    fill
                    sizes="
                      (max-width: 499px) 100vw,
                      (max-width: 1023px) 50vw,
                      25vw
                    "
                    className="
                      object-cover
                      transition-transform
                      duration-700
                      ease-out
                      group-hover:scale-[1.07]
                    "
                  />

                  {/* IMAGE GRADIENT */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/30
                      via-transparent
                      to-transparent
                    "
                  />

                  {/* CATEGORY NUMBER */}

                  <div
                    className="
                      absolute
                      left-4
                      top-4
                      z-10

                      flex
                      h-8
                      w-8
                      items-center
                      justify-center

                      rounded-full
                      border
                      border-white/60
                      bg-white/90

                      text-[10px]
                      font-bold
                      text-[#a71930]

                      shadow-sm
                      backdrop-blur-md
                    "
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* IMAGE TOP ARROW */}

                  <div
                    className="
                      absolute
                      right-4
                      top-4
                      z-10

                      flex
                      h-9
                      w-9
                      translate-y-2
                      items-center
                      justify-center

                      rounded-full
                      bg-white
                      text-[#a71930]

                      opacity-0

                      shadow-[0_8px_25px_rgba(0,0,0,0.12)]

                      transition-all
                      duration-300

                      group-hover:translate-y-0
                      group-hover:opacity-100
                    "
                  >
                    <ArrowRight size={16} />
                  </div>
                </div>

                {/* =========================================
                    CARD CONTENT
                ========================================== */}

                <div
                  className="
                    flex
                    min-h-[105px]
                    flex-1
                    items-center
                    justify-between
                    gap-4
                    px-4
                    py-4
                    xl:px-5
                  "
                >
                  {/* TEXT */}

                  <div className="min-w-0 flex-1">
                    <h3
                      className="
                        font-serif
                        text-[18px]
                        font-semibold
                        text-[#261b18]

                        transition-colors
                        duration-300

                        group-hover:text-[#a71930]

                        xl:text-[19px]
                      "
                    >
                      {category.name}
                    </h3>

                    <p
                      className="
                        mt-1
                        line-clamp-2
                        text-[10px]
                        leading-[17px]
                        text-[#8b7c76]
                        xl:text-[11px]
                      "
                    >
                      {category.description}
                    </p>
                  </div>

                  {/* ARROW BUTTON */}

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center

                      rounded-full
                      border
                      border-[#eadbd5]

                      text-[#a71930]

                      transition-all
                      duration-300

                      group-hover:border-[#a71930]
                      group-hover:bg-[#a71930]
                      group-hover:text-white
                    "
                  >
                    <ArrowRight
                      size={14}
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-[2px]
                      "
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* =================================================
            EXPLORE FULL MENU BUTTON
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
            delay: 0.15,
          }}
          className="
            mt-9
            flex
            justify-center
            sm:mt-10
          "
        >
          <Link
            href="/menu"
            className="
              group
              inline-flex
              items-center
              justify-center
              gap-2

              rounded-full
              bg-[#a71930]

              px-7
              py-3

              text-[12px]
              font-semibold
              text-white

              shadow-[0_8px_22px_rgba(167,25,48,0.18)]

              transition-all
              duration-300

              hover:-translate-y-[2px]
              hover:bg-[#851326]
              hover:shadow-[0_12px_30px_rgba(167,25,48,0.25)]

              sm:text-[13px]
            "
          >
            Explore Full Menu

            <ArrowRight
              size={15}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}