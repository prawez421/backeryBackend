"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowDownAZ,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

/* =====================================================
   PROPS
===================================================== */

type MenuSearchProps = {
  totalProducts?: number;
  onOpenSidebar?: () => void;
};

/* =====================================================
   SORT OPTIONS
===================================================== */

const sortOptions = [
  {
    label: "Featured",
    value: "featured",
  },
  {
    label: "Name: A - Z",
    value: "name-asc",
  },
  {
    label: "Name: Z - A",
    value: "name-desc",
  },
  {
    label: "Price: Low to High",
    value: "price-low",
  },
  {
    label: "Price: High to Low",
    value: "price-high",
  },
];

/* =====================================================
   COMPONENT
===================================================== */

export default function MenuSearch({
  totalProducts = 0,
  onOpenSidebar,
}: MenuSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ===================================================
     CURRENT VALUES FROM URL
  =================================================== */

  const searchValue = searchParams.get("search") || "";

  const sortValue =
    searchParams.get("sort") || "featured";

  const activeCategory =
    searchParams.get("category") || "all";

  /* ===================================================
     CATEGORY LABEL
  =================================================== */

  const categoryLabels: Record<string, string> = {
    all: "All Products",

    cakes: "All Cakes",
    birthday: "Birthday Cakes",
    anniversary: "Anniversary Cakes",
    wedding: "Wedding Cakes",
    chocolate: "Chocolate Cakes",
    photo: "Photo Cakes",
    designer: "Designer Cakes",
    bento: "Bento Cakes",

    pastries: "Pastries",
    cupcakes: "Cupcakes",
    cookies: "Cookies",
    breads: "Breads",
    desserts: "Desserts",
    snacks: "Snacks",
  };

  const activeCategoryLabel =
    categoryLabels[activeCategory] || "All Products";

  /* ===================================================
     UPDATE URL
  =================================================== */

  const updateQuery = (
    key: string,
    value: string
  ) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (
      !value ||
      (key === "sort" && value === "featured")
    ) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // Search/sort change hone par pagination reset
    params.delete("page");

    const query = params.toString();

    router.replace(
      query ? `/menu?${query}` : "/menu",
      {
        scroll: false,
      }
    );
  };

  /* ===================================================
     CLEAR SEARCH
  =================================================== */

  const clearSearch = () => {
    updateQuery("search", "");
  };

  return (
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
        amount: 0.2,
      }}
      transition={{
        duration: 0.55,
      }}
      className="
        mb-7
        overflow-hidden
        rounded-[22px]
        border
        border-[#eadbd5]
        bg-[#fffdfb]
        shadow-[0_10px_35px_rgba(70,30,30,0.04)]
      "
    >
      {/* =================================================
          TOP AREA
      ================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          px-4
          py-4

          sm:px-5

          xl:flex-row
          xl:items-center
          xl:justify-between
        "
      >
        {/* =================================================
            LEFT - CATEGORY + PRODUCT COUNT
        ================================================== */}

        <div className="flex items-center gap-3">
          {/* MOBILE SIDEBAR BUTTON */}

          <button
            type="button"
            onClick={onOpenSidebar}
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-[13px]
              bg-[#9a1e2f]
              text-white
              shadow-[0_7px_18px_rgba(154,30,47,0.15)]
              transition-all
              duration-300

              hover:bg-[#7e1726]

              lg:hidden
            "
            aria-label="Open categories"
          >
            <SlidersHorizontal size={16} />
          </button>

          {/* CATEGORY INFO */}

          <div>
            <div className="flex items-center gap-2">
              <Sparkles
                size={10}
                className="text-[#9a1e2f]"
              />

              <p
                className="
                  text-[7px]
                  font-bold
                  uppercase
                  tracking-[1.8px]
                  text-[#9a1e2f]
                "
              >
                Showing Category
              </p>
            </div>

            <div
              className="
                mt-1
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              <h2
                className="
                  font-serif
                  text-[17px]
                  font-semibold
                  text-[#34231f]

                  sm:text-[19px]
                "
              >
                {activeCategoryLabel}
              </h2>

              <span
                className="
                  rounded-full
                  bg-[#f6e9e5]
                  px-2.5
                  py-1
                  text-[7px]
                  font-bold
                  text-[#9a1e2f]
                "
              >
                {totalProducts} Items
              </span>
            </div>
          </div>
        </div>

        {/* =================================================
            RIGHT CONTROLS
        ================================================== */}

        <div
          className="
            flex
            w-full
            flex-col
            gap-3

            sm:flex-row

            xl:w-auto
          "
        >
          {/* =================================================
              SEARCH
          ================================================== */}

          <div
            className="
              group
              relative
              flex-1

              xl:w-[300px]
            "
          >
            <Search
              size={15}
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-[#9a1e2f]
              "
            />

            <input
              type="text"
              value={searchValue}
              onChange={(e) =>
                updateQuery(
                  "search",
                  e.target.value
                )
              }
              placeholder="Search cakes, pastries..."
              className="
                h-[46px]
                w-full
                rounded-[14px]
                border
                border-[#e8d8d2]
                bg-[#faf6f3]
                pl-11
                pr-10
                text-[10px]
                text-[#46332e]
                outline-none
                transition-all
                duration-300

                placeholder:text-[#aa9690]

                focus:border-[#c99891]
                focus:bg-white
                focus:ring-4
                focus:ring-[#9a1e2f]/[0.05]
              "
            />

            {/* CLEAR SEARCH */}

            {searchValue && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="
                  absolute
                  right-3
                  top-1/2
                  flex
                  h-7
                  w-7
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  text-[#8c7770]
                  transition-all
                  duration-200

                  hover:bg-[#f1e3df]
                  hover:text-[#9a1e2f]
                "
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* =================================================
              SORT
          ================================================== */}

          <div
            className="
              relative
              sm:w-[190px]
            "
          >
            <ArrowDownAZ
              size={14}
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                z-10
                -translate-y-1/2
                text-[#9a1e2f]
              "
            />

            <select
              value={sortValue}
              onChange={(e) =>
                updateQuery(
                  "sort",
                  e.target.value
                )
              }
              aria-label="Sort products"
              className="
                h-[46px]
                w-full
                cursor-pointer
                appearance-none
                rounded-[14px]
                border
                border-[#e8d8d2]
                bg-[#faf6f3]
                pl-10
                pr-9
                text-[9px]
                font-semibold
                text-[#5a4540]
                outline-none
                transition-all
                duration-300

                focus:border-[#c99891]
                focus:bg-white
                focus:ring-4
                focus:ring-[#9a1e2f]/[0.05]
              "
            >
              {sortOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>

            {/* CUSTOM SELECT ARROW */}

            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                right-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-[#9a1e2f]
              "
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* =================================================
          BOTTOM ACTIVE FILTER BAR
      ================================================== */}

      <div
        className="
          flex
          flex-wrap
          items-center
          gap-2
          border-t
          border-[#eee2dd]
          bg-[#faf5f2]
          px-4
          py-3

          sm:px-5
        "
      >
        <span
          className="
            text-[7px]
            font-bold
            uppercase
            tracking-[1.5px]
            text-[#9b8780]
          "
        >
          Active:
        </span>

        {/* CATEGORY BADGE */}

        <span
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-full
            border
            border-[#e5cdc7]
            bg-white
            px-3
            py-1.5
            text-[8px]
            font-semibold
            text-[#9a1e2f]
          "
        >
          {activeCategoryLabel}
        </span>

        {/* SEARCH BADGE */}

        {searchValue && (
          <button
            type="button"
            onClick={clearSearch}
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-full
              bg-[#281916]
              px-3
              py-1.5
              text-[8px]
              font-medium
              text-white
            "
          >
            Search: “{searchValue}”

            <X size={10} />
          </button>
        )}

        {/* SORT BADGE */}

        {sortValue !== "featured" && (
          <span
            className="
              inline-flex
              items-center
              rounded-full
              bg-[#efe2dd]
              px-3
              py-1.5
              text-[8px]
              font-medium
              text-[#614b45]
            "
          >
            {
              sortOptions.find(
                (option) =>
                  option.value === sortValue
              )?.label
            }
          </span>
        )}
      </div>
    </motion.div>
  );
}