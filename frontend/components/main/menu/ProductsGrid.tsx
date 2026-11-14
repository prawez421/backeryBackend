
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";

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
    branchCode: string;

    categoryId: number | null;
    subcategoryId: number | null;

    name: string;
    category: string;
    subcategory?: string;

    price: number;
    oldPrice?: number;

    image: string;
    description: string;

    badge?: string;
    featured?: boolean;
};

/* =====================================================
   API RESPONSE TYPE
===================================================== */

type ApiProduct = {
    id: number;
    branch_code?: string | null;

    product_name: string;

    category_id?: number | string | null;
    sub_category_id?: number | string | null;

    product_image?: string | null;
    product_images?: string[] | string | null;
    description?: string | null;

    category?: {
        id?: number | string;
        category_name?: string;
    } | null;

    sub_category?: {
        id?: number | string;
        category_id?: number | string;
        sub_category_name?: string;
    } | null;

    purchase_items?: {
        id: number;
        product_id: number;
        purchase_id: number;

        selling_price?: number | string | null;
        purchase_price?: number | string | null;
        mrp?: number | string | null;
        quantity?: number | string | null;

        purchase?: {
            id: number;
            purchase_date?: string;
            status?: string;
        } | null;
    }[];

    latest_purchase_item?: {
        selling_price?: number | string | null;
        mrp?: number | string | null;
    } | null;
};

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
   HELPERS
===================================================== */

const formatSlug = (value?: string | null) => {
    return (value || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
};

const getImageUrl = (image?: string | null) => {
    if (!image) {
        return "/images/product-placeholder.png";
    }

    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {
        return image;
    }

    const storageUrl =
        process.env.NEXT_PUBLIC_STORAGE_URL ||
        "http://127.0.0.1:8000/storage";

    return `${storageUrl.replace(/\/$/, "")}/${image.replace(/^\//, "")}`;
};

const getProductImage = (item: ApiProduct) => {
    const primaryImage = item.product_image?.trim();

    if (primaryImage) {
        return primaryImage;
    }

    let images: unknown = item.product_images;

    if (typeof images === "string") {
        try {
            images = JSON.parse(images);
        } catch {
            images = [images];
        }
    }

    const imageList = Array.isArray(images) ? images : [images];

    return imageList.find(
        (image): image is string =>
            typeof image === "string" && image.trim() !== ""
    )?.trim();
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function ProductsGrid() {
    const searchParams = useSearchParams();

    /* ===================================================
       STATES
    =================================================== */

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    /* ===================================================
       URL FILTERS
    =================================================== */

    const activeCategory =
        searchParams.get("category") || "all";

    const activeSubCategory =
        searchParams.get("subcategory") || "";

    const selectedBranch =
        searchParams.get("branch") || "all";

    const search =
        searchParams.get("search")?.trim().toLowerCase() || "";

    const sort =
        searchParams.get("sort") || "featured";

    /* ===================================================
       FETCH PRODUCTS FROM LARAVEL
    =================================================== */

    useEffect(() => {
        const controller = new AbortController();

        const fetchProducts = async () => {
            try {
                setLoading(true);
                setErrorMessage("");

                const apiUrl = (
                    process.env.NEXT_PUBLIC_API_URL ||
                    "http://127.0.0.1:8000/api"
                ).replace(/\/$/, "");

                const response = await axios.get(
                    `${apiUrl}/menu/products`,
                    {
                        signal: controller.signal,
                    }
                );

                const apiProducts: ApiProduct[] =
                    response.data?.data || [];

                if (!Array.isArray(apiProducts)) {
                    throw new Error(
                        "Invalid products API response."
                    );
                }

                /* =========================================
                   FORMAT PRODUCTS
                ========================================= */

                const formattedProducts: Product[] =
                    apiProducts.map((item) => {
                        // Latest purchase item preferred
                        const purchase =
                            item.latest_purchase_item ||
                            item.purchase_items?.[0];

                        const categoryName =
                            item.category?.category_name || "";

                        const subcategoryName =
                            item.sub_category?.sub_category_name || "";

                        const categoryId =
                            item.category?.id ??
                            item.category_id;

                        const subcategoryId =
                            item.sub_category?.id ??
                            item.sub_category_id;

                        return {
                            id: Number(item.id),

                            branchCode:
                                item.branch_code || "",

                            categoryId:
                                categoryId != null
                                    ? Number(categoryId)
                                    : null,

                            subcategoryId:
                                subcategoryId != null
                                    ? Number(subcategoryId)
                                    : null,

                            name: item.product_name || "",

                            category: formatSlug(categoryName),

                            subcategory: formatSlug(
                                subcategoryName
                            ),

                            price: Number(
                                purchase?.selling_price || 0
                            ),

                            oldPrice: Number(
                                purchase?.mrp || 0
                            ),

                            image: getImageUrl(getProductImage(item)),

                            description:
                                item.description || "",
                        };
                    });

                if (!controller.signal.aborted) {
                    setProducts(formattedProducts);
                }

            } catch (error) {
                if (
                    axios.isCancel(error) ||
                    controller.signal.aborted
                ) {
                    return;
                }

                console.error(
                    "Menu products fetch error:",
                    error
                );

                if (axios.isAxiosError(error)) {
                    console.error(
                        "API Error:",
                        error.response?.data
                    );

                    console.error(
                        "API Status:",
                        error.response?.status
                    );
                }

                setErrorMessage(
                    "Products load nahi ho paaye. Please try again."
                );

            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchProducts();

        return () => {
            controller.abort();
        };
    }, []);

    /* ===================================================
       FILTER + SEARCH + SORT
    =================================================== */

    const filteredProducts = useMemo(() => {
        let result = [...products];

        /* ===============================================
           BRANCH FILTER
        =============================================== */

        if (selectedBranch !== "all") {
            result = result.filter(
                (product) =>
                    product.branchCode === selectedBranch
            );
        }

        /* ===============================================
           CATEGORY FILTER
        =============================================== */

        if (activeCategory !== "all") {
            const categoryId = Number(activeCategory);

            if (
                activeCategory.trim() !== "" &&
                Number.isFinite(categoryId)
            ) {
                result = result.filter(
                    (product) =>
                        product.categoryId === categoryId
                );
            } else {
                const categorySlug =
                    formatSlug(activeCategory);

                result = result.filter(
                    (product) =>
                        product.category === categorySlug
                );
            }
        }

        /* ===============================================
           SUBCATEGORY FILTER
        =============================================== */

        if (activeSubCategory) {
            const subcategoryId =
                Number(activeSubCategory);

            if (
                activeSubCategory.trim() !== "" &&
                Number.isFinite(subcategoryId)
            ) {
                result = result.filter(
                    (product) =>
                        product.subcategoryId === subcategoryId
                );
            } else {
                const subcategorySlug =
                    formatSlug(activeSubCategory);

                result = result.filter(
                    (product) =>
                        product.subcategory === subcategorySlug
                );
            }
        }

        /* ===============================================
           SEARCH FILTER
        =============================================== */

        if (search) {
            result = result.filter((product) => {
                const searchableText = [
                    product.name,
                    product.category,
                    product.subcategory || "",
                    product.description,
                ]
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(search);
            });
        }

        /* ===============================================
           SORT PRODUCTS
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
                result.sort(
                    (a, b) =>
                        Number(Boolean(b.featured)) -
                        Number(Boolean(a.featured))
                );
                break;
        }

        return result;

    }, [
        products,
        selectedBranch,
        activeCategory,
        activeSubCategory,
        search,
        sort,
    ]);

    /* =====================================================
       SECTION TITLE
    ===================================================== */

    const sectionTitle = activeSubCategory
        ? "Sub Category Products"
        : activeCategory === "all"
            ? "All Bakery Products"
            : categoryLabels[activeCategory] ||
              "Category Products";

    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#eadbd5] border-t-[#9a1e2f]" />

                    <p className="mt-4 text-sm text-[#8a7771]">
                        Loading bakery products...
                    </p>
                </div>
            </div>
        );
    }

    /* =====================================================
       ERROR
    ===================================================== */

    if (errorMessage) {
        return (
            <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                <SearchX
                    size={35}
                    className="text-[#9a1e2f]"
                />

                <p className="mt-4 text-sm text-[#69544e]">
                    {errorMessage}
                </p>

                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 rounded-full bg-[#281916] px-5 py-2 text-xs font-semibold text-white"
                >
                    Retry
                </button>
            </div>
        );
    }

    /* =====================================================
       RETURN UI
    ===================================================== */

    return (
        <div>
            {/* GRID HEADER */}

            <motion.div
                key={`${selectedBranch}-${activeCategory}-${activeSubCategory}`}
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
                    <div className="mb-2 flex items-center gap-2">
                        <Sparkles
                            size={10}
                            className="text-[#9a1e2f]"
                        />

                        <span className="text-[7px] font-bold uppercase tracking-[2px] text-[#9a1e2f]">
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

                    <p className="mt-1.5 text-[9px] leading-5 text-[#8a7771] sm:text-[10px]">
                        Freshly prepared bakery favourites made
                        for everyday treats and special moments.
                    </p>

                    {selectedBranch !== "all" && (
                        <p className="mt-2 text-[9px] font-semibold text-[#9a1e2f]">
                            Branch: {selectedBranch}
                        </p>
                    )}
                </div>

                {/* PRODUCT COUNT */}

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

                    <span className="text-[8px] font-semibold text-[#69544e]">
                        {filteredProducts.length}{" "}
                        {filteredProducts.length === 1
                            ? "Product"
                            : "Products"}
                    </span>
                </div>
            </motion.div>

            {/* PRODUCTS GRID */}

            {filteredProducts.length > 0 ? (
                <motion.div
                    key={`${selectedBranch}-${activeCategory}-${activeSubCategory}-${search}-${sort}`}
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
                            <ProductCard
                                product={product}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                /* EMPTY STATE */

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

                    <p className="mt-5 text-[7px] font-bold uppercase tracking-[2px] text-[#9a1e2f]">
                        Nothing Found
                    </p>

                    <h3 className="mt-2 font-serif text-[23px] font-semibold text-[#34231f]">
                        No sweet treats found.
                    </h3>

                    <p className="mt-2 max-w-[350px] text-[9px] leading-[1.8] text-[#8b7771]">
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
