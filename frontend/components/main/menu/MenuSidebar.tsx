"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import {
  CakeSlice,
  ChevronDown,
  ChevronRight,
  Cookie,
  Croissant,
  Grid2X2,
  IceCreamBowl,
  Sandwich,
  Sparkles,
  X,
} from "lucide-react";

/* =====================================================
   TYPES
===================================================== */

type SubCategory = {
  name: string;
  value: string;
};

type Category = {
  id: number;
  name: string;
  value: string;
  count?: number;
  icon: React.ReactNode;
  children?: SubCategory[];
};

/* =====================================================
   MENU CATEGORIES
===================================================== */

const menuCategories: Category[] = [
  {
    id: 1,
    name: "All Products",
    value: "all",
    count: 120,
    icon: <Grid2X2 size={16} />,
  },

  {
    id: 2,
    name: "Cakes",
    value: "cakes",
    count: 50,
    icon: <CakeSlice size={16} />,

    children: [
      {
        name: "All Cakes",
        value: "cakes",
      },
      {
        name: "Birthday Cakes",
        value: "birthday",
      },
      {
        name: "Anniversary Cakes",
        value: "anniversary",
      },
      {
        name: "Wedding Cakes",
        value: "wedding",
      },
      {
        name: "Chocolate Cakes",
        value: "chocolate",
      },
      {
        name: "Photo Cakes",
        value: "photo",
      },
      {
        name: "Designer Cakes",
        value: "designer",
      },
      {
        name: "Bento Cakes",
        value: "bento",
      },
    ],
  },

  {
    id: 3,
    name: "Pastries",
    value: "pastries",
    count: 18,
    icon: <Croissant size={16} />,
  },

  {
    id: 4,
    name: "Cupcakes",
    value: "cupcakes",
    count: 15,
    icon: <CakeSlice size={16} />,
  },

  {
    id: 5,
    name: "Cookies",
    value: "cookies",
    count: 20,
    icon: <Cookie size={16} />,
  },

  {
    id: 6,
    name: "Breads",
    value: "breads",
    count: 12,
    icon: <Croissant size={16} />,
  },

  {
    id: 7,
    name: "Desserts",
    value: "desserts",
    count: 16,
    icon: <IceCreamBowl size={16} />,
  },

  {
    id: 8,
    name: "Snacks",
    value: "snacks",
    count: 14,
    icon: <Sandwich size={16} />,
  },
];

/* =====================================================
   CAKE VALUES
===================================================== */

const cakeValues = [
  "cakes",
  "birthday",
  "anniversary",
  "wedding",
  "chocolate",
  "photo",
  "designer",
  "bento",
];

/* =====================================================
   PROPS
===================================================== */

type MenuSidebarProps = {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function MenuSidebar({
  mobileOpen = false,
  onMobileClose,
}: MenuSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ===================================================
     ACTIVE CATEGORY
  =================================================== */

  const activeCategory =
    searchParams.get("category") || "all";

  const isCakeCategory =
    cakeValues.includes(activeCategory);

  /* ===================================================
     CAKES DROPDOWN STATE
  =================================================== */

  const [cakesOpen, setCakesOpen] = useState(false);

  /* ===================================================
     CHANGE CATEGORY
  =================================================== */

  const changeCategory = (value: string) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }

    // Reset pagination when category changes
    params.delete("page");

    const query = params.toString();

    router.push(
      query ? `/menu?${query}` : "/menu",
      {
        scroll: false,
      }
    );

    // Mobile drawer close
    onMobileClose?.();
  };

  /* ===================================================
     CAKES DROPDOWN TOGGLE
  =================================================== */

  const toggleCakesDropdown = () => {
    setCakesOpen((previous) => !previous);
  };

  /* =====================================================
     SIDEBAR CONTENT
  ===================================================== */

  const sidebarContent = (
    <div
      className="
        w-full
        max-w-full
        overflow-x-hidden
        rounded-[24px]
        border
        border-[#eadbd5]
        bg-[#fffdfb]
        shadow-[0_12px_35px_rgba(65,30,25,0.05)]
      "
    >
      {/* =================================================
          HEADER
      ================================================== */}

      <div
        className="
          border-b
          border-[#eee1dc]
          px-5
          py-5
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-3
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-[13px]
                bg-[#9a1e2f]
                text-white
              "
            >
              <CakeSlice size={17} />
            </div>

            <div>
              <p
                className="
                  text-[7px]
                  font-bold
                  uppercase
                  tracking-[2px]
                  text-[#9a1e2f]
                "
              >
                Explore
              </p>

              <h2
                className="
                  mt-1
                  font-serif
                  text-[18px]
                  font-semibold
                  text-[#34231f]
                "
              >
                Our Menu
              </h2>
            </div>
          </div>

          {/* MOBILE CLOSE */}

          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close categories"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-[#eadbd5]
              text-[#604b45]
              transition-colors
              hover:bg-[#f8efeb]
              lg:hidden
            "
          >
            <X size={15} />
          </button>
        </div>

        <p
          className="
            mt-4
            text-[9px]
            leading-[1.7]
            text-[#8a7771]
          "
        >
          Browse our freshly baked collection by category.
        </p>
      </div>

      {/* =================================================
          CATEGORY LIST
      ================================================== */}

      <div className="p-3">
        {menuCategories.map((category) => {
          const hasChildren =
            category.children &&
            category.children.length > 0;

          const isActive =
            category.value === "cakes"
              ? isCakeCategory
              : activeCategory === category.value;

          return (
            <div
              key={category.id}
              className="mb-1 last:mb-0"
            >
              {/* =========================================
                  NORMAL CATEGORY
              ========================================== */}

              {!hasChildren && (
                <button
                  type="button"
                  onClick={() =>
                    changeCategory(category.value)
                  }
                  className={`
                    group
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-[14px]
                    px-3
                    py-3
                    text-left
                    transition-all
                    duration-300

                    ${
                      isActive
                        ? `
                          bg-[#9a1e2f]
                          text-white
                          shadow-[0_7px_18px_rgba(154,30,47,0.15)]
                        `
                        : `
                          text-[#5d4943]
                          hover:bg-[#faf1ed]
                          hover:text-[#9a1e2f]
                        `
                    }
                  `}
                >
                  {/* ICON */}

                  <span
                    className={`
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-[11px]
                      transition-colors
                      duration-300

                      ${
                        isActive
                          ? "bg-white/15 text-white"
                          : "bg-[#f6e9e5] text-[#9a1e2f]"
                      }
                    `}
                  >
                    {category.icon}
                  </span>

                  {/* NAME */}

                  <span
                    className="
                      min-w-0
                      flex-1
                      text-[10px]
                      font-semibold
                    "
                  >
                    {category.name}
                  </span>

                  {/* COUNT */}

                  {category.count !== undefined && (
                    <span
                      className={`
                        rounded-full
                        px-2
                        py-1
                        text-[7px]
                        font-bold

                        ${
                          isActive
                            ? "bg-white/10 text-white/80"
                            : "bg-[#f7eeea] text-[#9a1e2f]"
                        }
                      `}
                    >
                      {category.count}
                    </span>
                  )}

                  <ChevronRight
                    size={13}
                    className={`
                      shrink-0
                      transition-transform
                      duration-300

                      ${
                        isActive
                          ? "translate-x-0.5"
                          : "opacity-40 group-hover:translate-x-0.5"
                      }
                    `}
                  />
                </button>
              )}

              {/* =========================================
                  CATEGORY WITH DROPDOWN - CAKES
              ========================================== */}

              {hasChildren && (
                <>
                  {/* =====================================
                      CAKES MAIN BUTTON

                      Full row click = dropdown toggle
                  ====================================== */}

                  <button
                    type="button"
                    onClick={toggleCakesDropdown}
                    aria-expanded={cakesOpen}
                    className={`
                      group
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-[14px]
                      px-3
                      py-3
                      text-left
                      transition-all
                      duration-300

                      ${
                        isActive || cakesOpen
                          ? "bg-[#f7e8e6]"
                          : "hover:bg-[#faf1ed]"
                      }
                    `}
                  >
                    {/* ICON */}

                    <span
                      className={`
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-[11px]
                        transition-all
                        duration-300

                        ${
                          isActive || cakesOpen
                            ? "bg-[#9a1e2f] text-white"
                            : "bg-[#f6e9e5] text-[#9a1e2f]"
                        }
                      `}
                    >
                      {category.icon}
                    </span>

                    {/* CATEGORY NAME */}

                    <div className="min-w-0 flex-1">
                      <p
                        className={`
                          text-[10px]
                          font-semibold

                          ${
                            isActive || cakesOpen
                              ? "text-[#9a1e2f]"
                              : "text-[#5d4943]"
                          }
                        `}
                      >
                        {category.name}
                      </p>

                      <p
                        className="
                          mt-0.5
                          truncate
                          text-[7px]
                          text-[#a18d87]
                        "
                      >
                        Celebration Collection
                      </p>
                    </div>

                    {/* COUNT */}

                    {category.count !== undefined && (
                      <span
                        className="
                          rounded-full
                          bg-white
                          px-2
                          py-1
                          text-[7px]
                          font-bold
                          text-[#9a1e2f]
                        "
                      >
                        {category.count}
                      </span>
                    )}

                    {/* ARROW */}

                    <span
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        text-[#9a1e2f]
                        transition-colors
                        duration-200
                        group-hover:bg-white
                      "
                    >
                      <ChevronDown
                        size={14}
                        className={`
                          transition-transform
                          duration-300

                          ${
                            cakesOpen
                              ? "rotate-180"
                              : ""
                          }
                        `}
                      />
                    </span>
                  </button>

                  {/* =====================================
                      CAKE DROPDOWN
                  ====================================== */}

                  <AnimatePresence initial={false}>
                    {cakesOpen && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: "easeInOut",
                        }}
                        className="overflow-hidden"
                      >
                        <div
                          className="
                            relative
                            ml-[30px]
                            mt-1
                            border-l
                            border-[#e7d5cf]
                            pb-2
                            pl-5
                          "
                        >
                          {category.children?.map(
                            (child) => {
                              const childActive =
                                activeCategory ===
                                child.value;

                              return (
                                <button
                                  key={child.value}
                                  type="button"
                                  onClick={() =>
                                    changeCategory(
                                      child.value
                                    )
                                  }
                                  className={`
                                    group
                                    relative
                                    flex
                                    w-full
                                    items-center
                                    gap-2
                                    rounded-[10px]
                                    px-3
                                    py-2.5
                                    text-left
                                    transition-all
                                    duration-200

                                    ${
                                      childActive
                                        ? `
                                          bg-[#fff1ee]
                                          text-[#9a1e2f]
                                        `
                                        : `
                                          text-[#796660]
                                          hover:bg-[#faf4f1]
                                          hover:text-[#9a1e2f]
                                        `
                                    }
                                  `}
                                >
                                  {/* LEFT DOT */}

                                  <span
                                    className={`
                                      absolute
                                      -left-[23px]
                                      h-[7px]
                                      w-[7px]
                                      rounded-full
                                      border-2
                                      border-[#fffdfb]

                                      ${
                                        childActive
                                          ? "bg-[#9a1e2f]"
                                          : "bg-[#d8c4be]"
                                      }
                                    `}
                                  />

                                  {/* CHILD NAME */}

                                  <span
                                    className="
                                      flex-1
                                      text-[9px]
                                      font-medium
                                    "
                                  >
                                    {child.name}
                                  </span>

                                  {/* ACTIVE ARROW */}

                                  {childActive && (
                                    <motion.span
                                      layoutId="active-cake-arrow"
                                    >
                                      <ChevronRight
                                        size={11}
                                      />
                                    </motion.span>
                                  )}
                                </button>
                              );
                            }
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* =================================================
          CUSTOM CAKE CARD
      ================================================== */}

      <div className="p-3 pt-1">
        <div
          className="
            relative
            overflow-hidden
            rounded-[18px]
            bg-[#281916]
            p-5
            text-white
          "
        >
          {/* DECORATION */}

          <div
            className="
              pointer-events-none
              absolute
              -right-[45px]
              -top-[45px]
              h-[120px]
              w-[120px]
              rounded-full
              border
              border-white/[0.08]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-[55px]
              -left-[45px]
              h-[110px]
              w-[110px]
              rounded-full
              border
              border-white/[0.05]
            "
          />

          {/* CONTENT */}

          <div className="relative z-10">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-[#9a1e2f]
              "
            >
              <Sparkles size={14} />
            </div>

            <p
              className="
                mt-4
                text-[7px]
                font-bold
                uppercase
                tracking-[1.8px]
                text-[#e5a4a0]
              "
            >
              Made Just For You
            </p>

            <h3
              className="
                mt-1.5
                font-serif
                text-[17px]
                font-medium
              "
            >
              Need a custom cake?
            </h3>

            <p
              className="
                mt-2
                text-[8px]
                leading-[1.7]
                text-white/45
              "
            >
              Create something special for your next
              celebration.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/custom-cakes")
              }
              className="
                mt-4
                inline-flex
                items-center
                gap-2
                text-[8px]
                font-bold
                text-white
                transition-colors
                hover:text-[#e5a4a0]
              "
            >
              Design Your Cake

              <ChevronRight size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <>
      {/* =================================================
          DESKTOP SIDEBAR

          IMPORTANT:
          Position/fixed behavior MenuPage se control karo.
      ================================================== */}

      <aside
        className="
          hidden
          w-full
          lg:block
        "
      >
        {sidebarContent}
      </aside>

      {/* =================================================
          MOBILE SIDEBAR
      ================================================== */}

      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* BACKDROP */}

            <motion.button
              type="button"
              aria-label="Close menu categories"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
              }}
              onClick={onMobileClose}
              className="
                fixed
                inset-0
                z-[80]
                bg-black/45
                backdrop-blur-[2px]
                lg:hidden
              "
            />

            {/* MOBILE DRAWER */}

            <motion.aside
              initial={{
                x: "-100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "-100%",
              }}
              transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                fixed
                bottom-0
                left-0
                top-0
                z-[90]
                w-[86%]
                max-w-[330px]
                overflow-x-hidden
                overflow-y-auto
                bg-[#fffaf7]
                p-3
                shadow-2xl
                lg:hidden
              "
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}