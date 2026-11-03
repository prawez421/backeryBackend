"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CakeSlice,
  PackageSearch,
  SearchX,
  Sparkles,
} from "lucide-react";

import ProductCard from "./ProductCard";

/* =====================================================
   PRODUCT TYPE
===================================================== */

export type Product = {
  id: number;
  name: string;

  category:
    | "cakes"
    | "pastries"
    | "cupcakes"
    | "cookies"
    | "breads"
    | "desserts"
    | "snacks";

  subcategory?: string;

  price: number;
  oldPrice?: number;

  image: string;

  description: string;

  badge?: string;

  featured?: boolean;
};

/* =====================================================
   PRODUCTS DATA
===================================================== */

const products: Product[] = [
  /* ===================================================
     CAKES
  =================================================== */

  {
    id: 1,
    name: "Chocolate Truffle Cake",
    category: "cakes",
    subcategory: "chocolate",
    price: 699,
    oldPrice: 799,

    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",

    description:
      "Rich chocolate cake layered with smooth chocolate ganache.",

    badge: "Bestseller",
    featured: true,
  },

  {
    id: 2,
    name: "Birthday Celebration Cake",
    category: "cakes",
    subcategory: "birthday",
    price: 899,

    image:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=85",

    description:
      "A colourful celebration cake made especially for birthdays.",

    badge: "Birthday",
    featured: true,
  },

  {
    id: 3,
    name: "Anniversary Rose Cake",
    category: "cakes",
    subcategory: "anniversary",
    price: 1099,

    image:
      "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=900&q=85",

    description:
      "Elegant cream cake decorated for memorable anniversaries.",

    badge: "Special",
  },

  {
    id: 4,
    name: "Wedding Elegance Cake",
    category: "cakes",
    subcategory: "wedding",
    price: 2499,

    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=85",

    description:
      "An elegant celebration cake created for beautiful wedding moments.",

    badge: "Premium",
    featured: true,
  },

  {
    id: 5,
    name: "Chocolate Fudge Cake",
    category: "cakes",
    subcategory: "chocolate",
    price: 749,

    image:
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=900&q=85",

    description:
      "Deep chocolate flavour with a soft and indulgent fudge finish.",
  },

  {
    id: 6,
    name: "Designer Floral Cake",
    category: "cakes",
    subcategory: "designer",
    price: 1399,

    image:
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=85",

    description:
      "Beautifully designed cake with an elegant floral-inspired finish.",

    badge: "Designer",
  },

  {
    id: 7,
    name: "Photo Celebration Cake",
    category: "cakes",
    subcategory: "photo",
    price: 999,

    image:
      "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=900&q=85",

    description:
      "Personalised celebration cake designed for your special memories.",

    badge: "Custom",
  },

  {
    id: 8,
    name: "Mini Bento Cake",
    category: "cakes",
    subcategory: "bento",
    price: 399,

    image:
      "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=900&q=85",

    description:
      "Cute mini cake perfect for small celebrations and sweet surprises.",

    badge: "Cute Pick",
  },

  /* ===================================================
     PASTRIES
  =================================================== */

  {
    id: 9,
    name: "Chocolate Pastry",
    category: "pastries",
    price: 149,

    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85",

    description:
      "Soft pastry layered with rich chocolate cream.",

    badge: "Popular",
    featured: true,
  },

  {
    id: 10,
    name: "Cream Pastry",
    category: "pastries",
    price: 129,

    image:
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=900&q=85",

    description:
      "Light and creamy pastry for a simple sweet treat.",
  },

  {
    id: 11,
    name: "Berry Pastry",
    category: "pastries",
    price: 169,

    image:
      "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=900&q=85",

    description:
      "Fresh berry-inspired pastry with smooth cream layers.",
  },

  /* ===================================================
     CUPCAKES
  =================================================== */

  {
    id: 12,
    name: "Chocolate Cupcake",
    category: "cupcakes",
    price: 99,

    image:
      "https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=900&q=85",

    description:
      "Chocolate cupcake topped with creamy frosting.",

    badge: "Bestseller",
  },

  {
    id: 13,
    name: "Vanilla Cupcake",
    category: "cupcakes",
    price: 89,

    image:
      "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=900&q=85",

    description:
      "Classic vanilla cupcake with a light creamy topping.",
  },

  {
    id: 14,
    name: "Red Velvet Cupcake",
    category: "cupcakes",
    price: 119,

    image:
      "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=900&q=85",

    description:
      "Soft red velvet cupcake finished with smooth frosting.",
  },

  /* ===================================================
     COOKIES
  =================================================== */

  {
    id: 15,
    name: "Chocolate Chip Cookies",
    category: "cookies",
    price: 179,

    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=85",

    description:
      "Freshly baked cookies packed with chocolate chips.",

    badge: "Fresh Bake",
  },

  {
    id: 16,
    name: "Butter Cookies",
    category: "cookies",
    price: 159,

    image:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=900&q=85",

    description:
      "Crisp and buttery cookies perfect with tea or coffee.",
  },

  {
    id: 17,
    name: "Double Chocolate Cookies",
    category: "cookies",
    price: 199,

    image:
      "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=900&q=85",

    description:
      "Rich chocolate cookies made for serious chocolate lovers.",
  },

  /* ===================================================
     BREADS
  =================================================== */

  {
    id: 18,
    name: "Artisan Bread",
    category: "breads",
    price: 149,

    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85",

    description:
      "Fresh artisan bread baked for a soft centre and golden crust.",

    badge: "Daily Fresh",
  },

  {
    id: 19,
    name: "Classic Croissant",
    category: "breads",
    price: 119,

    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85",

    description:
      "Flaky buttery croissant baked fresh for a light crisp texture.",
  },

  /* ===================================================
     DESSERTS
  =================================================== */

  {
    id: 20,
    name: "Chocolate Dessert Cup",
    category: "desserts",
    price: 199,

    image:
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=85",

    description:
      "Creamy chocolate dessert served in a convenient individual portion.",
  },

  {
    id: 21,
    name: "Berry Cheesecake",
    category: "desserts",
    price: 249,

    image:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=85",

    description:
      "Smooth cheesecake finished with a fresh berry-inspired topping.",

    badge: "Premium",
  },

  /* ===================================================
     SNACKS
  =================================================== */

  {
    id: 22,
    name: "Veg Puff",
    category: "snacks",
    price: 69,

    image:
      "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=900&q=85",

    description:
      "Crispy baked puff filled with a savoury vegetable filling.",

    badge: "Fresh",
  },

  {
    id: 23,
    name: "Cheese Puff",
    category: "snacks",
    price: 89,

    image:
      "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=900&q=85",

    description:
      "Flaky baked puff with a delicious cheesy filling.",
  },
];

/* =====================================================
   CAKE SUBCATEGORY VALUES
===================================================== */

const cakeSubcategories = [
  "birthday",
  "anniversary",
  "wedding",
  "chocolate",
  "photo",
  "designer",
  "bento",
];

/* =====================================================
   CATEGORY LABELS
===================================================== */

const categoryLabels: Record<string, string> = {
  all: "All Bakery Products",

  cakes: "Our Cakes",

  birthday: "Birthday Cakes",
  anniversary: "Anniversary Cakes",
  wedding: "Wedding Cakes",
  chocolate: "Chocolate Cakes",
  photo: "Photo Cakes",
  designer: "Designer Cakes",
  bento: "Bento Cakes",

  pastries: "Fresh Pastries",
  cupcakes: "Cupcakes",
  cookies: "Cookies",
  breads: "Fresh Breads",
  desserts: "Desserts",
  snacks: "Bakery Snacks",
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function ProductsGrid() {
  const searchParams = useSearchParams();

  /* ===================================================
     URL VALUES
  =================================================== */

  const activeCategory =
    searchParams.get("category") || "all";

  const search =
    searchParams.get("search")?.trim().toLowerCase() ||
    "";

  const sort =
    searchParams.get("sort") || "featured";

  /* ===================================================
     FILTER + SEARCH + SORT
  =================================================== */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    /* ===============================================
       CATEGORY FILTER
    =============================================== */

    if (activeCategory === "cakes") {
      result = result.filter(
        (product) => product.category === "cakes"
      );
    } else if (
      cakeSubcategories.includes(activeCategory)
    ) {
      result = result.filter(
        (product) =>
          product.category === "cakes" &&
          product.subcategory === activeCategory
      );
    } else if (activeCategory !== "all") {
      result = result.filter(
        (product) =>
          product.category === activeCategory
      );
    }

    /* ===============================================
       SEARCH
    =============================================== */

    if (search) {
      result = result.filter((product) => {
        const searchableText = [
          product.name,
          product.category,
          product.subcategory || "",
          product.description,
          product.badge || "",
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(search);
      });
    }

    /* ===============================================
       SORT
    =============================================== */

    switch (sort) {
      case "name-asc":
        result.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      case "name-desc":
        result.sort((a, b) =>
          b.name.localeCompare(a.name)
        );
        break;

      case "price-low":
        result.sort(
          (a, b) => a.price - b.price
        );
        break;

      case "price-high":
        result.sort(
          (a, b) => b.price - a.price
        );
        break;

      default:
        /*
          Featured products ko starting me show karega.
        */

        result.sort(
          (a, b) =>
            Number(Boolean(b.featured)) -
            Number(Boolean(a.featured))
        );

        break;
    }

    return result;
  }, [activeCategory, search, sort]);

  const sectionTitle =
    categoryLabels[activeCategory] ||
    "Bakery Products";

  return (
    <div>
      {/* =================================================
          GRID HEADER
      ================================================== */}

      <motion.div
        key={activeCategory}
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="
          mb-6
          flex
          flex-col
          gap-3

          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        {/* LEFT */}

        <div>
          <div
            className="
              mb-2
              flex
              items-center
              gap-2
            "
          >
            <Sparkles
              size={10}
              className="text-[#9a1e2f]"
            />

            <span
              className="
                text-[7px]
                font-bold
                uppercase
                tracking-[2px]
                text-[#9a1e2f]
              "
            >
              Alibros Selection
            </span>
          </div>

          <h2
            className="
              font-serif
              text-[27px]
              font-semibold
              tracking-[-0.5px]
              text-[#30211d]

              sm:text-[31px]
            "
          >
            {sectionTitle}
          </h2>

          <p
            className="
              mt-1.5
              text-[9px]
              leading-5
              text-[#8a7771]

              sm:text-[10px]
            "
          >
            Freshly prepared bakery favourites made
            for everyday treats and special moments.
          </p>
        </div>

        {/* COUNT */}

        <div
          className="
            flex
            w-fit
            items-center
            gap-2
            rounded-full
            border
            border-[#e5d3cd]
            bg-[#fffaf7]
            px-4
            py-2
          "
        >
          <PackageSearch
            size={12}
            className="text-[#9a1e2f]"
          />

          <span
            className="
              text-[8px]
              font-semibold
              text-[#69544e]
            "
          >
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1
              ? "Product"
              : "Products"}
          </span>
        </div>
      </motion.div>

      {/* =================================================
          PRODUCTS
      ================================================== */}

      {filteredProducts.length > 0 ? (
        <motion.div
          key={`${activeCategory}-${search}-${sort}`}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},

            visible: {
              transition: {
                staggerChildren: 0.06,
              },
            },
          }}
          className="
            grid
            grid-cols-1
            gap-5

            sm:grid-cols-2

            xl:grid-cols-3
          "
        >
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 25,
                },

                visible: {
                  opacity: 1,
                  y: 0,

                  transition: {
                    duration: 0.45,
                    ease: "easeOut",
                  },
                },
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* =================================================
           EMPTY STATE
        ================================================== */

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            flex
            min-h-[380px]
            flex-col
            items-center
            justify-center
            rounded-[26px]
            border
            border-dashed
            border-[#dfc9c2]
            bg-[#fffaf7]
            px-5
            text-center
          "
        >
          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-[#f4e4e1]
              text-[#9a1e2f]
            "
          >
            <SearchX size={24} />
          </div>

          <p
            className="
              mt-5
              text-[7px]
              font-bold
              uppercase
              tracking-[2px]
              text-[#9a1e2f]
            "
          >
            Nothing Found
          </p>

          <h3
            className="
              mt-2
              font-serif
              text-[23px]
              font-semibold
              text-[#34231f]
            "
          >
            No sweet treats found.
          </h3>

          <p
            className="
              mt-2
              max-w-[350px]
              text-[9px]
              leading-[1.8]
              text-[#8b7771]
            "
          >
            Try another search or choose a different
            bakery category from the menu.
          </p>

          <div
            className="
              mt-5
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-[#281916]
              text-white
            "
          >
            <CakeSlice size={15} />
          </div>
        </motion.div>
      )}
    </div>
  );
}