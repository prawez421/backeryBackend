
"use client";

import { useEffect, useMemo, useState } from "react";
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
  Utensils,
  GitBranch,
} from "lucide-react";

import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";

/* =====================================================
   TYPES
===================================================== */

type SubCategory = {
  id: number;
  category_id: number;
  sub_category_name: string;
  status?: string;
};

type Category = {
  id: number;
  branch_code: string;
  category_name: string;
  status?: string;
  sub_categories: SubCategory[];
};

type MenuSidebarProps = {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

/* =====================================================
   CATEGORY ICON
===================================================== */

const getCategoryIcon = (name: string) => {
  const value = name.toLowerCase();

  if (value.includes("cake")) return <CakeSlice size={16} />;

  if (value.includes("pastry") || value.includes("bread")) {
    return <Croissant size={16} />;
  }

  if (value.includes("cookie")) return <Cookie size={16} />;

  if (value.includes("dessert")) {
    return <IceCreamBowl size={16} />;
  }

  if (value.includes("snack")) return <Sandwich size={16} />;

  if (value.includes("cupcake")) return <CakeSlice size={16} />;

  return <Utensils size={16} />;
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
     URL FILTERS
  =================================================== */

  const activeCategory = searchParams.get("category") || "all";
  const activeSubCategory = searchParams.get("subcategory") || "";

  /* ===================================================
     STATES
  =================================================== */

  const [menuCategories, setMenuCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Branch selection
  const [selectedBranch, setSelectedBranch] = useState("all");

  // Open category
  const [openCategoryId, setOpenCategoryId] = useState<number | null>(() => {
    const categoryId = searchParams.get("category");
    return categoryId ? Number(categoryId) : null;
  });

  /* ===================================================
     FETCH MENU CATEGORIES
  =================================================== */

  useEffect(() => {
    let isMounted = true;

    const fetchMenuCategories = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.get(
          ProjectApiList.menuCategories
        );

        if (!isMounted) return;

        if (response.data?.success) {
          const categories = Array.isArray(response.data.data)
            ? response.data.data
            : [];

          const activeCategories = categories
            .filter(
              (category: Category) => category.status === "Active"
            )
            .map((category: Category) => ({
              ...category,
              sub_categories: Array.isArray(category.sub_categories)
                ? category.sub_categories.filter(
                    (subCategory) => subCategory.status === "Active"
                  )
                : [],
            }));

          setMenuCategories(activeCategories);

          console.log("Menu Categories:", activeCategories);
        } else {
          setMenuCategories([]);
        }
      } catch (error) {
        console.error("Menu Categories Fetch Error:", error);

        if (isMounted) {
          setMenuCategories([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMenuCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ===================================================
     GET UNIQUE BRANCHES
  =================================================== */

  const branches = useMemo(() => {
    return Array.from(
      new Set(
        menuCategories
          .map((category) => category.branch_code)
          .filter(Boolean)
      )
    ).sort();
  }, [menuCategories]);

  /* ===================================================
     FILTER CATEGORIES BY BRANCH
  =================================================== */

  const filteredCategories = useMemo(() => {
    if (selectedBranch === "all") {
      return menuCategories;
    }

    return menuCategories.filter(
      (category) => category.branch_code === selectedBranch
    );
  }, [menuCategories, selectedBranch]);

  /* ===================================================
     SYNC OPEN CATEGORY WITH URL
  =================================================== */

  useEffect(() => {
    const categoryId = searchParams.get("category");

    if (categoryId) {
      setOpenCategoryId(Number(categoryId));
    } else {
      setOpenCategoryId(null);
    }
  }, [activeCategory, searchParams]);

  /* ===================================================
     CHANGE BRANCH
  =================================================== */

  const handleBranchChange = (branchCode: string) => {
    setSelectedBranch(branchCode);
    setOpenCategoryId(null);

    // Purane category filters remove karo
    const params = new URLSearchParams(searchParams.toString());

    params.delete("category");
    params.delete("subcategory");
    params.delete("page");

    const query = params.toString();

    router.push(query ? `/menu?${query}` : "/menu", {
      scroll: false,
    });
  };

  /* ===================================================
     CHANGE CATEGORY
  =================================================== */

  const changeCategory = (
    categoryId: string,
    subCategoryId?: string
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (categoryId === "all") {
      params.delete("category");
      params.delete("subcategory");
      setOpenCategoryId(null);
    } else {
      params.set("category", categoryId);

      if (subCategoryId) {
        params.set("subcategory", subCategoryId);
      } else {
        params.delete("subcategory");
      }

      setOpenCategoryId(Number(categoryId));
    }

    params.delete("page");

    const query = params.toString();

    router.push(query ? `/menu?${query}` : "/menu", {
      scroll: false,
    });

    onMobileClose?.();
  };

  /* ===================================================
     SIDEBAR CONTENT
  =================================================== */

  const sidebarContent = (
    <div
      className="
        w-full max-w-full overflow-x-hidden
        rounded-[24px] border border-[#eadbd5]
        bg-[#fffdfb]
        shadow-[0_12px_35px_rgba(65,30,25,0.05)]
      "
    >
      {/* HEADER */}

      <div className="border-b border-[#eee1dc] px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-[13px] bg-[#9a1e2f] text-white
              "
            >
              <CakeSlice size={17} />
            </div>

            <div>
              <p className="text-[7px] font-bold uppercase tracking-[2px] text-[#9a1e2f]">
                Explore
              </p>

              <h2 className="mt-1 font-serif text-[18px] font-semibold text-[#34231f]">
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
              flex h-9 w-9 items-center justify-center
              rounded-full border border-[#eadbd5]
              text-[#604b45] transition-colors
              hover:bg-[#f8efeb] lg:hidden
            "
          >
            <X size={15} />
          </button>
        </div>

        <p className="mt-4 text-[9px] leading-[1.7] text-[#8a7771]">
          Browse our freshly baked collection by branch and category.
        </p>
      </div>

      {/* CATEGORY LIST */}

      <div className="p-3">

        {/* BRANCH SELECTOR */}

        <div className="mb-4">
          <label
            htmlFor="menu-branch"
            className="
              mb-2 flex items-center gap-2
              text-[9px] font-bold uppercase
              tracking-[1px] text-[#9a1e2f]
            "
          >
            <GitBranch size={13} />
            Select Branch
          </label>

          <select
            id="menu-branch"
            value={selectedBranch}
            onChange={(e) => handleBranchChange(e.target.value)}
            className="
              w-full cursor-pointer rounded-[12px]
              border border-[#eadbd5] bg-white
              px-3 py-3 text-[10px] font-semibold
              text-[#5d4943] outline-none
              transition-all
              focus:border-[#9a1e2f]
              focus:ring-2 focus:ring-[#9a1e2f]/10
            "
          >
            <option value="all">All Branches</option>

            {branches.map((branchCode) => (
              <option key={branchCode} value={branchCode}>
                {branchCode}
              </option>
            ))}
          </select>
        </div>

        {/* ALL PRODUCTS */}

        <button
          type="button"
          onClick={() => changeCategory("all")}
          className={`
            mb-2 flex w-full items-center gap-3
            rounded-[14px] px-3 py-3 text-left
            transition-all duration-300
            ${
              activeCategory === "all"
                ? "bg-[#9a1e2f] text-white shadow-[0_7px_18px_rgba(154,30,47,0.15)]"
                : "text-[#5d4943] hover:bg-[#faf1ed]"
            }
          `}
        >
          <span
            className={`
              flex h-9 w-9 shrink-0 items-center justify-center
              rounded-[11px]
              ${
                activeCategory === "all"
                  ? "bg-white/15 text-white"
                  : "bg-[#f6e9e5] text-[#9a1e2f]"
              }
            `}
          >
            <Grid2X2 size={16} />
          </span>

          <span className="flex-1 text-[10px] font-semibold">
            All Products
          </span>

          <ChevronRight size={13} />
        </button>

        {/* LOADING */}

        {loading && (
          <div className="space-y-3 p-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-11 animate-pulse rounded-xl bg-[#f6e9e5]"
              />
            ))}
          </div>
        )}

        {/* EMPTY */}

        {!loading && filteredCategories.length === 0 && (
          <p className="px-3 py-5 text-center text-[10px] text-[#8a7771]">
            No categories available for this branch.
          </p>
        )}

        {/* DYNAMIC CATEGORIES */}

        {!loading &&
          filteredCategories.map((category) => {
            const subCategories = category.sub_categories || [];

            const hasChildren = subCategories.length > 0;

            const isActiveCategory =
              activeCategory === String(category.id);

            const isCategoryOpen =
              openCategoryId === category.id;

            return (
              <div key={category.id} className="mb-1 last:mb-0">

                {/* CATEGORY BUTTON */}

                <button
                  type="button"
                  onClick={() => {
                    if (hasChildren) {
                      const shouldOpen =
                        openCategoryId !== category.id;

                      setOpenCategoryId(
                        shouldOpen ? category.id : null
                      );

                      changeCategory(String(category.id));
                    } else {
                      setOpenCategoryId(null);
                      changeCategory(String(category.id));
                    }
                  }}
                  aria-expanded={
                    hasChildren ? isCategoryOpen : undefined
                  }
                  className={`
                    group flex w-full items-center gap-3
                    rounded-[14px] px-3 py-3 text-left
                    transition-all duration-300
                    ${
                      isActiveCategory
                        ? "bg-[#f7e8e6]"
                        : "hover:bg-[#faf1ed]"
                    }
                  `}
                >
                  {/* ICON */}

                  <span
                    className={`
                      flex h-9 w-9 shrink-0 items-center
                      justify-center rounded-[11px]
                      transition-all duration-300
                      ${
                        isActiveCategory
                          ? "bg-[#9a1e2f] text-white"
                          : "bg-[#f6e9e5] text-[#9a1e2f]"
                      }
                    `}
                  >
                    {getCategoryIcon(category.category_name)}
                  </span>

                  {/* CATEGORY NAME */}

                  <div className="min-w-0 flex-1">
                    <p
                      className={`
                        text-[10px] font-semibold
                        ${
                          isActiveCategory
                            ? "text-[#9a1e2f]"
                            : "text-[#5d4943]"
                        }
                      `}
                    >
                      {category.category_name}
                    </p>

                    {hasChildren && (
                      <p className="mt-0.5 truncate text-[7px] text-[#a18d87]">
                        Explore Collection
                      </p>
                    )}
                  </div>

                  {/* SUBCATEGORY COUNT */}

                  <span
                    className="
                      rounded-full bg-white px-2 py-1
                      text-[7px] font-bold text-[#9a1e2f]
                    "
                  >
                    {subCategories.length}
                  </span>

                  {/* ARROW */}

                  {hasChildren ? (
                    <ChevronDown
                      size={14}
                      className={`
                        shrink-0 text-[#9a1e2f]
                        transition-transform duration-300
                        ${isCategoryOpen ? "rotate-180" : ""}
                      `}
                    />
                  ) : (
                    <ChevronRight
                      size={13}
                      className="shrink-0 text-[#9a1e2f] opacity-50"
                    />
                  )}
                </button>

                {/* SUBCATEGORY DROPDOWN */}

                <AnimatePresence initial={false}>
                  {hasChildren && isCategoryOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                      className="overflow-hidden"
                    >
                      <div
                        className="
                          relative ml-[30px] mt-1
                          border-l border-[#e7d5cf]
                          pb-2 pl-5
                        "
                      >
                        {/* ALL CATEGORY */}

                        <button
                          type="button"
                          onClick={() =>
                            changeCategory(String(category.id))
                          }
                          className={`
                            group relative flex w-full
                            items-center gap-2 rounded-[10px]
                            px-3 py-2.5 text-left
                            transition-all duration-200
                            ${
                              !activeSubCategory && isActiveCategory
                                ? "bg-[#fff1ee] text-[#9a1e2f]"
                                : "text-[#796660] hover:bg-[#faf4f1] hover:text-[#9a1e2f]"
                            }
                          `}
                        >
                          <span
                            className={`
                              absolute -left-[23px]
                              h-[7px] w-[7px] rounded-full
                              border-2 border-[#fffdfb]
                              ${
                                !activeSubCategory && isActiveCategory
                                  ? "bg-[#9a1e2f]"
                                  : "bg-[#d8c4be]"
                              }
                            `}
                          />

                          <span className="flex-1 text-[9px] font-medium">
                            All {category.category_name}
                          </span>

                          {!activeSubCategory && isActiveCategory && (
                            <ChevronRight size={11} />
                          )}
                        </button>

                        {/* SUBCATEGORY ITEMS */}

                        {subCategories.map((subCategory) => {
                          const isSubActive =
                            activeSubCategory === String(subCategory.id);

                          return (
                            <button
                              key={subCategory.id}
                              type="button"
                              onClick={() =>
                                changeCategory(
                                  String(category.id),
                                  String(subCategory.id)
                                )
                              }
                              className={`
                                group relative flex w-full
                                items-center gap-2 rounded-[10px]
                                px-3 py-2.5 text-left
                                transition-all duration-200
                                ${
                                  isSubActive
                                    ? "bg-[#fff1ee] text-[#9a1e2f]"
                                    : "text-[#796660] hover:bg-[#faf4f1] hover:text-[#9a1e2f]"
                                }
                              `}
                            >
                              <span
                                className={`
                                  absolute -left-[23px]
                                  h-[7px] w-[7px] rounded-full
                                  border-2 border-[#fffdfb]
                                  ${
                                    isSubActive
                                      ? "bg-[#9a1e2f]"
                                      : "bg-[#d8c4be]"
                                  }
                                `}
                              />

                              <span className="flex-1 text-[9px] font-medium">
                                {subCategory.sub_category_name}
                              </span>

                              {isSubActive && (
                                <motion.span
                                  layoutId="active-subcategory-arrow"
                                >
                                  <ChevronRight size={11} />
                                </motion.span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
      </div>

      {/* CUSTOM CAKE CARD */}

      <div className="p-3 pt-1">
        <div
          className="
            relative overflow-hidden rounded-[18px]
            bg-[#281916] p-5 text-white
          "
        >
          <div
            className="
              pointer-events-none absolute -right-[45px]
              -top-[45px] h-[120px] w-[120px]
              rounded-full border border-white/[0.08]
            "
          />

          <div
            className="
              pointer-events-none absolute -bottom-[55px]
              -left-[45px] h-[110px] w-[110px]
              rounded-full border border-white/[0.05]
            "
          />

          <div className="relative z-10">
            <div
              className="
                flex h-9 w-9 items-center justify-center
                rounded-full bg-[#9a1e2f]
              "
            >
              <Sparkles size={14} />
            </div>

            <p
              className="
                mt-4 text-[7px] font-bold uppercase
                tracking-[1.8px] text-[#e5a4a0]
              "
            >
              Made Just For You
            </p>

            <h3 className="mt-1.5 font-serif text-[17px] font-medium">
              Need a custom cake?
            </h3>

            <p className="mt-2 text-[8px] leading-[1.7] text-white/45">
              Create something special for your next celebration.
            </p>

            <button
              type="button"
              onClick={() => router.push("/custom-cakes")}
              className="
                mt-4 inline-flex items-center gap-2
                text-[8px] font-bold text-white
                transition-colors hover:text-[#e5a4a0]
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
      {/* DESKTOP SIDEBAR */}

      <aside className="hidden w-full lg:block">
        {sidebarContent}
      </aside>

      {/* MOBILE SIDEBAR */}

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onMobileClose}
              className="
                fixed inset-0 z-[80]
                bg-black/45 backdrop-blur-[2px]
                lg:hidden
              "
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                fixed bottom-0 left-0 top-0 z-[90]
                w-[86%] max-w-[330px]
                overflow-x-hidden overflow-y-auto
                bg-[#fffaf7] p-3 shadow-2xl
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
