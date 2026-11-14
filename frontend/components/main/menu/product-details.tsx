
"use client";

import React, {
    Suspense,
    useEffect,
    useMemo,
    useState,
} from "react";

import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

import {
    ArrowLeft,
    Heart,
    ShoppingBag,
    Plus,
    Minus,
    Truck,
    ShieldCheck,
    RefreshCcw,
    CheckCircle,
    Loader2,
    Package,
    Image as ImageIcon,
    Share2,
    MapPin,
    Clock,
    Tag,
    Info,
} from "lucide-react";

/* =====================================================
   TYPES
===================================================== */

type AttributeValue =
    | string
    | {
          attribute_id?: number;
          attribute_name?: string;
          attribute_value?: string;
      };

type PurchaseItem = {
    id: number;
    purchase_id: number;
    product_id: number;

    selected_attributes?:
        | Record<string, AttributeValue>
        | AttributeValue[]
        | null;

    quantity?: string | number;
    purchase_price?: string | number;
    mrp?: string | number;
    selling_price?: string | number;
    discount?: string | number;
    tax?: string | number;
    total_amount?: string | number;

    created_at?: string;

    purchase?: {
        unique_id?: string;
        invoice_number?: string;
        purchase_date?: string;
        status?: string;
        payment_status?: string;
    };
};

type ApiProduct = {
    id: number;
    unique_id?: string;
    branch_code?: string;

    product_name: string;
    product_image?: string | null;
    product_images?: string[] | string | null;

    description?: string | null;
    status?: string;

    created_at?: string;
    updated_at?: string;

    stock?: number | string | null;
    current_stock?: number | string | null;
    stock_quantity?: number | string | null;
    available_stock?: number | string | null;

    category?: {
        id?: number;
        category_name?: string;
        status?: string;
    } | null;

    sub_category?: {
        id?: number;
        sub_category_name?: string;
        status?: string;
    } | null;

    brand?: {
        id?: number;
        brand_name?: string;
        status?: string;
        description?: string | null;
    } | null;

    unit?: {
        id?: number;
        unit_name?: string;
        short_name?: string;
        status?: string;
    } | null;

    purchase_items?: PurchaseItem[];
    latest_purchase_item?: PurchaseItem | null;
};

type Product = {
    id: number;
    uniqueId: string;
    branchCode: string;

    name: string;
    images: string[];
    description: string;
    status: string;

    category: string;
    subcategory: string;
    brand: string;
    unit: string;

    createdAt: string;
    updatedAt: string;

    stock: number | null;
    purchaseItems: PurchaseItem[];
};

/* =====================================================
   API CONFIG
===================================================== */

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000/api";

const STORAGE_URL =
    process.env.NEXT_PUBLIC_STORAGE_URL ||
    "http://127.0.0.1:8000/storage";

const PLACEHOLDER = "/images/product-placeholder.png";

/* =====================================================
   HELPERS
===================================================== */

function imageUrl(path?: string | null): string {
    if (!path) return PLACEHOLDER;

    if (
        path.startsWith("http://") ||
        path.startsWith("https://")
    ) {
        return path;
    }

    return `${STORAGE_URL.replace(/\/$/, "")}/${path.replace(
        /^\/+/,
        ""
    )}`;
}

function money(value?: string | number | null): string | null {
    const amount = Number(value || 0);

    if (!Number.isFinite(amount) || amount <= 0) {
        return null;
    }

    return `₹${amount.toLocaleString("en-IN")}`;
}

function dateFormat(value?: string): string {
    if (!value) return "N/A";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function getStock(item: ApiProduct): number | null {
    const value =
        item.stock ??
        item.current_stock ??
        item.stock_quantity ??
        item.available_stock;

    if (value === null || value === undefined) {
        return null;
    }

    const number = Number(value);

    return Number.isFinite(number)
        ? Math.max(0, number)
        : null;
}

function getImages(item: ApiProduct): string[] {
    let extraImages: string[] = [];

    if (Array.isArray(item.product_images)) {
        extraImages = item.product_images;
    } else if (typeof item.product_images === "string") {
        try {
            const parsed = JSON.parse(item.product_images);

            if (Array.isArray(parsed)) {
                extraImages = parsed;
            }
        } catch {
            extraImages = [];
        }
    }

    const allImages = [
        item.product_image,
        ...extraImages,
    ]
        .filter(
            (value): value is string =>
                Boolean(value && typeof value === "string")
        )
        .map(imageUrl);

    return Array.from(
        new Set(
            allImages.length
                ? allImages
                : [PLACEHOLDER]
        )
    );
}

function formatProduct(item: ApiProduct): Product {
    return {
        id: item.id,

        uniqueId: item.unique_id || `PRD-${item.id}`,
        branchCode: item.branch_code || "N/A",

        name: item.product_name || "Product",
        images: getImages(item),

        description:
            item.description || "No description available.",

        status: item.status || "N/A",

        category:
            item.category?.category_name || "N/A",

        subcategory:
            item.sub_category?.sub_category_name || "N/A",

        brand:
            item.brand?.brand_name || "N/A",

        unit:
            item.unit?.short_name ||
            item.unit?.unit_name ||
            "N/A",

        createdAt: item.created_at || "",
        updatedAt: item.updated_at || "",

        stock: getStock(item),

        purchaseItems:
            item.purchase_items ||
            (item.latest_purchase_item
                ? [item.latest_purchase_item]
                : []),
    };
}

/* =====================================================
   ATTRIBUTE HELPER
===================================================== */

function getAttributes(
    item: PurchaseItem
): { name: string; value: string }[] {
    const attributes = item.selected_attributes;

    if (!attributes) return [];

    if (Array.isArray(attributes)) {
        return attributes.map((value, index) => {
            if (
                typeof value === "object" &&
                value !== null
            ) {
                return {
                    name:
                        value.attribute_name ||
                        `Attribute ${index + 1}`,

                    value:
                        value.attribute_value || "N/A",
                };
            }

            return {
                name: `Attribute ${index + 1}`,
                value: String(value),
            };
        });
    }

    return Object.entries(attributes).map(
        ([key, value]) => {
            if (
                typeof value === "object" &&
                value !== null
            ) {
                return {
                    name:
                        value.attribute_name ||
                        `Attribute ${key}`,

                    value:
                        value.attribute_value || "N/A",
                };
            }

            return {
                name: `Attribute ${key}`,
                value: String(value),
            };
        }
    );
}

/* =====================================================
   SMALL COMPONENTS
===================================================== */

function InfoItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl border border-[#eee3de] bg-white p-3">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-[#a0928c]">
                {label}
            </p>

            <p className="mt-1 break-words text-xs font-bold text-[#30211d]">
                {value || "N/A"}
            </p>
        </div>
    );
}

function SectionTitle({
    title,
    subtitle,
}: {
    title: string;
    subtitle?: string;
}) {
    return (
        <div className="mb-4">
            <h2 className="text-base font-extrabold text-[#30211d]">
                {title}
            </h2>

            {subtitle && (
                <p className="mt-1 text-[11px] text-[#a0928c]">
                    {subtitle}
                </p>
            )}
        </div>
    );
}

/* =====================================================
   MAIN CONTENT
===================================================== */

function ProductDetailsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const productId = searchParams.get("id");

    const [product, setProduct] =
        useState<Product | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedImage, setSelectedImage] =
        useState("");

    const [selectedPurchase, setSelectedPurchase] =
        useState<PurchaseItem | null>(null);

    const [quantity, setQuantity] = useState(1);

    const [liked, setLiked] = useState(false);
    const [adding, setAdding] = useState(false);

    const [message, setMessage] = useState("");

    const [cakeMessage, setCakeMessage] =
        useState("");

    const [pincode, setPincode] =
        useState("");

    const [deliveryMessage, setDeliveryMessage] =
        useState("");

    /* =================================================
       FETCH PRODUCT
    ================================================= */

    useEffect(() => {
        async function fetchProduct() {
            if (
                !productId ||
                !Number.isFinite(Number(productId))
            ) {
                setError("Invalid product ID.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response = await axios.get(
                    `${API_URL}/menu/products`
                );

                const products: ApiProduct[] =
                    response.data?.data || [];

                const found = products.find(
                    (item) =>
                        String(item.id) === productId
                );

                if (!found) {
                    setProduct(null);
                    setError("Product not found.");
                    return;
                }

                const formatted = formatProduct(found);

                setProduct(formatted);

                setSelectedImage(
                    formatted.images[0] || PLACEHOLDER
                );

                const sortedItems = [
                    ...formatted.purchaseItems,
                ].sort(
                    (a, b) =>
                        new Date(
                            b.created_at || ""
                        ).getTime() -
                        new Date(
                            a.created_at || ""
                        ).getTime()
                );

                setSelectedPurchase(
                    sortedItems[0] || null
                );
            } catch (err) {
                console.error(err);

                setError(
                    "Unable to load product details."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [productId]);

    /* =================================================
       PURCHASE DATA
    ================================================= */

    const purchaseItems = useMemo(() => {
        if (!product) return [];

        return [...product.purchaseItems].sort(
            (a, b) =>
                new Date(
                    b.created_at || ""
                ).getTime() -
                new Date(
                    a.created_at || ""
                ).getTime()
        );
    }, [product]);

    const selectedPrice = Number(
        selectedPurchase?.selling_price || 0
    );

    const selectedMrp = Number(
        selectedPurchase?.mrp || 0
    );

    const selectedStock = product?.stock ?? null;

    const outOfStock = selectedStock === 0;

    const discount =
        selectedMrp > selectedPrice &&
        selectedPrice > 0
            ? Math.round(
                  ((selectedMrp - selectedPrice) /
                      selectedMrp) *
                      100
              )
            : 0;

    const canPurchase =
        selectedPrice > 0 &&
        !outOfStock &&
        (selectedStock === null ||
            selectedStock >= quantity);

    /* =================================================
       QUANTITY
    ================================================= */

    function increaseQuantity() {
        if (
            selectedStock !== null &&
            quantity >= selectedStock
        ) {
            return;
        }

        setQuantity((old) => old + 1);
    }

    function decreaseQuantity() {
        setQuantity((old) =>
            Math.max(1, old - 1)
        );
    }

    /* =================================================
       ADD TO CART
    ================================================= */

    function addToCart(buyNow = false) {
        if (
            !product ||
            !selectedPurchase ||
            !canPurchase ||
            adding
        ) {
            return;
        }

        try {
            setAdding(true);
            setMessage("");

            const oldCart = JSON.parse(
                localStorage.getItem("alibros-cart") ||
                    "[]"
            );

            const cart = Array.isArray(oldCart)
                ? oldCart
                : [];

            const cartKey = `${product.id}-${selectedPurchase.id}`;

            const index = cart.findIndex(
                (item: any) =>
                    item.cartKey === cartKey
            );

            const oldQuantity =
                index >= 0
                    ? Number(
                          cart[index].quantity || 0
                      )
                    : 0;

            const newQuantity =
                oldQuantity + quantity;

            if (
                selectedStock !== null &&
                newQuantity > selectedStock
            ) {
                setMessage(
                    "Available stock is not sufficient."
                );

                return;
            }

            const cartProduct = {
                id: product.id,
                cartKey,

                name: product.name,
                image: product.images[0],

                category: product.category,
                brand: product.brand,
                unit: product.unit,

                price: selectedPrice,
                oldPrice: selectedMrp,

                purchaseItemId: selectedPurchase.id,

                selectedAttributes:
                    selectedPurchase.selected_attributes,

                cakeMessage: cakeMessage.trim(),

                quantity: newQuantity,
            };

            if (index >= 0) {
                cart[index] = {
                    ...cart[index],
                    ...cartProduct,
                };
            } else {
                cart.push(cartProduct);
            }

            localStorage.setItem(
                "alibros-cart",
                JSON.stringify(cart)
            );

            window.dispatchEvent(
                new Event("cart-updated")
            );

            if (buyNow) {
                router.push("/cart");
            } else {
                setMessage(
                    "Product added to cart successfully!"
                );
            }
        } catch (err) {
            console.error(err);

            setMessage(
                "Unable to add product to cart."
            );
        } finally {
            setAdding(false);
        }
    }

    /* =================================================
       DELIVERY PINCODE
    ================================================= */

    function checkDelivery() {
        if (!/^\d{6}$/.test(pincode)) {
            setDeliveryMessage(
                "Please enter a valid 6-digit PIN code."
            );

            return;
        }

        setDeliveryMessage(
            "PIN code entered. Connect your delivery API to verify availability."
        );
    }

    /* =================================================
       LOADING
    ================================================= */

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#fffaf7]">
                <Loader2
                    className="animate-spin text-[#9a1e2f]"
                    size={38}
                />
            </div>
        );
    }

    /* =================================================
       ERROR
    ================================================= */

    if (error || !product) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#fffaf7] p-4 text-center">
                <Package
                    size={48}
                    className="text-[#9a1e2f]"
                />

                <h2 className="mt-4 text-xl font-bold text-[#30211d]">
                    Product Not Found
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                    {error}
                </p>

                <button
                    onClick={() => router.push("/menu")}
                    className="mt-5 rounded-xl bg-[#9a1e2f] px-6 py-3 text-sm font-bold text-white"
                >
                    Back to Products
                </button>
            </div>
        );
    }

    /* =================================================
       MAIN UI
    ================================================= */

    return (
        <main className="min-h-screen bg-[#fffaf7] px-3 py-5 sm:px-6 lg:px-9">
            <div className="mx-auto max-w-[1500px]">

                {/* BREADCRUMB */}

                <div className="mb-5 flex flex-wrap items-center gap-2 text-[11px] text-[#94847e]">
                    <button
                        onClick={() => router.push("/menu")}
                        className="hover:text-[#9a1e2f]"
                    >
                        Home
                    </button>

                    <span>/</span>

                    <button
                        onClick={() => router.push("/menu")}
                        className="hover:text-[#9a1e2f]"
                    >
                        Products
                    </button>

                    <span>/</span>

                    <span className="font-semibold text-[#9a1e2f]">
                        {product.name}
                    </span>
                </div>

                {/* PRODUCT GRID */}

                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(390px,0.92fr)] xl:gap-9">

                    {/* LEFT IMAGE GALLERY */}

                    <section className="min-w-0">

                        <div className="grid grid-cols-[68px_minmax(0,1fr)] gap-3 sm:grid-cols-[90px_minmax(0,1fr)]">

                            {/* THUMBNAILS */}

                            <div className="flex flex-col gap-3">
                                {product.images.map(
                                    (image, index) => (
                                        <button
                                            key={`${image}-${index}`}
                                            type="button"
                                            onClick={() =>
                                                setSelectedImage(image)
                                            }
                                            className={`aspect-square w-full overflow-hidden rounded-xl border-2 bg-white p-1 transition-all ${
                                                selectedImage === image
                                                    ? "border-[#9a1e2f] shadow-md"
                                                    : "border-[#eee3de] hover:border-[#c9a59a]"
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.name} ${index + 1}`}
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        PLACEHOLDER;
                                                }}
                                                className="h-full w-full rounded-lg object-contain"
                                            />
                                        </button>
                                    )
                                )}
                            </div>

                            {/* MAIN IMAGE */}

                            <div className="group relative flex min-h-[350px] items-center justify-center overflow-hidden rounded-xl border border-[#f0e6e1] bg-[#fff0f2] sm:min-h-[530px] lg:min-h-[620px]">

                                {discount > 0 && (
                                    <span className="absolute left-4 top-4 z-10 rounded-md bg-[#f5b400] px-3 py-1.5 text-[10px] font-extrabold text-[#30211d] shadow-sm">
                                        {discount}% OFF
                                    </span>
                                )}

                                {outOfStock && (
                                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40">
                                        <span className="rounded-lg bg-red-600 px-6 py-3 text-sm font-extrabold tracking-widest text-white shadow-xl">
                                            OUT OF STOCK
                                        </span>
                                    </div>
                                )}

                                {/* WISHLIST */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setLiked(!liked)
                                    }
                                    aria-label="Toggle wishlist"
                                    className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110"
                                >
                                    <Heart
                                        size={19}
                                        fill={
                                            liked
                                                ? "#9a1e2f"
                                                : "none"
                                        }
                                        className={
                                            liked
                                                ? "text-[#9a1e2f]"
                                                : "text-[#30211d]"
                                        }
                                    />
                                </button>

                                {/* PRODUCT IMAGE */}

                                <img
                                    src={
                                        selectedImage ||
                                        PLACEHOLDER
                                    }
                                    alt={product.name}
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            PLACEHOLDER;
                                    }}
                                    className={`max-h-[600px] w-full object-contain p-3 transition-transform duration-700 group-hover:scale-[1.03] ${
                                        outOfStock
                                            ? "grayscale opacity-60"
                                            : ""
                                    }`}
                                />

                                <span className="absolute bottom-0 left-0 rounded-tr-md bg-[#f5b400] px-4 py-1 text-[9px] font-extrabold text-[#30211d]">
                                    PRODUCT GALLERY
                                </span>
                            </div>
                        </div>

                        <p className="mt-3 text-center text-[10px] text-[#a0928c]">
                            {product.images.length} product images available
                        </p>
                    </section>

                    {/* RIGHT PRODUCT DETAILS */}

                    <section className="min-w-0">

                        {/* BRAND */}

                        <div className="flex items-center justify-between">
                            <span className="rounded-full bg-[#fff0e7] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#9a1e2f]">
                                ✦ {product.brand}
                            </span>

                            <button
                                type="button"
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: product.name,
                                            url: window.location.href,
                                        }).catch(() => {});
                                    } else {
                                        navigator.clipboard.writeText(
                                            window.location.href
                                        );
                                    }
                                }}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eee3de] bg-white text-[#5b4b45] shadow-sm hover:text-[#9a1e2f]"
                            >
                                <Share2 size={17} />
                            </button>
                        </div>

                        {/* NAME */}

                        <h1 className="mt-4 font-serif text-2xl font-bold leading-tight text-[#30211d] sm:text-3xl">
                            {product.name}
                        </h1>

                        <p className="mt-2 text-xs text-[#9a8982]">
                            {product.category} / {product.subcategory}
                        </p>

                        {/* PRICE */}

                        <div className="mt-5 rounded-xl border border-[#eee5df] bg-white p-4 shadow-sm">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-[#9a8982]">
                                SELECTED VARIANT PRICE
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-3">
                                <span className="text-3xl font-extrabold text-[#30211d]">
                                    {money(selectedPrice) ||
                                        "Price not set"}
                                </span>

                                {selectedMrp >
                                    selectedPrice &&
                                    selectedPrice > 0 && (
                                        <span className="text-sm text-gray-400 line-through">
                                            {money(selectedMrp)}
                                        </span>
                                    )}

                                {discount > 0 && (
                                    <span className="rounded-md bg-[#fff0e7] px-2 py-1 text-[10px] font-bold text-[#9a1e2f]">
                                        {discount}% OFF
                                    </span>
                                )}
                            </div>

                            <div className="mt-3">
                                {outOfStock ? (
                                    <span className="inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-[11px] font-bold text-red-600">
                                        <span className="h-2 w-2 rounded-full bg-red-500" />
                                        OUT OF STOCK
                                    </span>
                                ) : selectedStock !== null ? (
                                    <span className="inline-flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-[11px] font-bold text-green-700">
                                        <CheckCircle size={13} />
                                        {selectedStock} Available
                                    </span>
                                ) : (
                                    <span className="rounded-md bg-amber-50 px-3 py-2 text-[10px] text-amber-700">
                                        Stock availability will be confirmed at checkout.
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* DESCRIPTION */}

                        <div className="mt-5">
                            <p className="text-sm leading-6 text-[#76655e]">
                                {product.description}
                            </p>
                        </div>

                        {/* VARIANTS */}

                        <div className="mt-6">
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-xs font-extrabold text-[#30211d]">
                                    Select Variant
                                </h3>

                                <span className="text-[10px] text-[#a0928c]">
                                    Choose available option
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {purchaseItems.map((item) => {
                                    const active =
                                        selectedPurchase?.id ===
                                        item.id;

                                    const attributes =
                                        getAttributes(item);

                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedPurchase(
                                                    item
                                                );

                                                setQuantity(1);
                                                setMessage("");
                                            }}
                                            className={`rounded-md border px-3 py-2 text-[11px] font-bold transition ${
                                                active
                                                    ? "border-[#9a1e2f] bg-[#9a1e2f] text-white shadow-sm"
                                                    : "border-[#d8ccc6] bg-white text-[#51413b] hover:border-[#9a1e2f] hover:text-[#9a1e2f]"
                                            }`}
                                        >
                                            {attributes.length
                                                ? attributes
                                                      .map(
                                                          (a) =>
                                                              a.value
                                                      )
                                                      .join(" / ")
                                                : `Variant ${item.id}`}
                                        </button>
                                    );
                                })}
                            </div>

                            {purchaseItems.length === 0 && (
                                <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
                                    No purchase variants available.
                                </p>
                            )}
                        </div>

                        {/* SELECTED VARIANT */}

                        {selectedPurchase && (
                            <div className="mt-5 rounded-xl border border-[#f1dfce] bg-[#fff8ef] p-4">

                                <p className="text-[10px] font-extrabold text-[#9a1e2f]">
                                    SELECTED VARIANT
                                </p>

                                <div className="mt-3 space-y-2">
                                    {getAttributes(
                                        selectedPurchase
                                    ).map((attr, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between gap-3 text-xs"
                                        >
                                            <span className="text-[#96857e]">
                                                {attr.name}
                                            </span>

                                            <strong className="text-[#30211d]">
                                                {attr.value}
                                            </strong>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-3 flex items-center justify-between border-t border-[#f0dfce] pt-3">
                                    <span className="text-[10px] text-[#9a8982]">
                                        Purchase quantity:{" "}
                                        {selectedPurchase.quantity ??
                                            "N/A"}
                                    </span>

                                    <strong className="text-sm text-[#30211d]">
                                        {money(selectedPrice) ||
                                            "Price not set"}
                                    </strong>
                                </div>
                            </div>
                        )}

                        {/* CAKE MESSAGE */}

                        <div className="mt-6">
                            <div className="mb-2 flex justify-between">
                                <label className="text-xs font-bold text-[#30211d]">
                                    Cake Message
                                </label>

                                <span className="text-[10px] text-[#a0928c]">
                                    {cakeMessage.length}/25
                                </span>
                            </div>

                            <input
                                type="text"
                                maxLength={25}
                                value={cakeMessage}
                                onChange={(e) =>
                                    setCakeMessage(
                                        e.target.value
                                    )
                                }
                                placeholder="Write A Sweet Wish!"
                                className="h-11 w-full rounded-md border border-[#d8ccc6] bg-white px-3 text-xs outline-none transition focus:border-[#9a1e2f] focus:ring-2 focus:ring-[#9a1e2f]/10"
                            />
                        </div>

                        {/* DELIVERY */}

                        <div className="mt-4 rounded-xl border border-[#f3e4d8] bg-[#fff7f0] p-4">

                            <label className="flex items-center gap-2 text-xs font-bold text-[#30211d]">
                                <MapPin
                                    size={15}
                                    className="text-[#9a1e2f]"
                                />
                                Delivery Location
                            </label>

                            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={pincode}
                                    onChange={(e) => {
                                        setPincode(
                                            e.target.value.replace(
                                                /\D/g,
                                                ""
                                            )
                                        );

                                        setDeliveryMessage("");
                                    }}
                                    placeholder="Enter 6-digit PIN code"
                                    className="h-10 min-w-0 flex-1 rounded-md border border-[#d8ccc6] bg-white px-3 text-[10px] outline-none focus:border-[#9a1e2f]"
                                />

                                <button
                                    type="button"
                                    onClick={checkDelivery}
                                    className="h-10 rounded-md bg-[#9a1e2f] px-4 text-[10px] font-bold text-white transition hover:bg-[#7e1725]"
                                >
                                    Check Availability
                                </button>
                            </div>

                            {deliveryMessage && (
                                <p className="mt-2 text-[10px] text-[#9a1e2f]">
                                    {deliveryMessage}
                                </p>
                            )}

                            <p className="mt-2 text-[9px] text-[#a0928c]">
                                Delivery availability depends on your location.
                            </p>
                        </div>

                        {/* SKU */}

                        <div className="mt-5">
                            <p className="text-[10px] font-bold text-[#30211d]">
                                SKU Number
                            </p>

                            <p className="mt-1 text-[10px] text-[#a0928c]">
                                {product.uniqueId}
                            </p>
                        </div>

                        {/* CHEF MESSAGE */}

                        <div className="relative mt-5 overflow-hidden rounded-lg border border-[#f5dce3] bg-[#fff0f4] p-4">

                            <div className="relative z-10">
                                <h3 className="text-xs font-bold text-[#30211d]">
                                    From Our Chef's Kitchen
                                </h3>

                                <p className="mt-2 text-[10px] leading-5 text-[#76655e]">
                                    {product.description}
                                </p>
                            </div>

                            <div className="absolute right-3 top-1 text-4xl opacity-20">
                                ✨
                            </div>
                        </div>

                        {/* QUANTITY */}

                        <div className="mt-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-[#30211d]">
                                    Select Quantity
                                </p>

                                <p className="mt-1 text-[10px] text-[#a0928c]">
                                    Choose items count
                                </p>
                            </div>

                            <div className="flex items-center gap-4 rounded-md border border-[#e5d9d3] bg-white px-3 py-2">
                                <button
                                    onClick={decreaseQuantity}
                                    disabled={
                                        quantity <= 1 ||
                                        outOfStock
                                    }
                                    className="text-[#9a1e2f] disabled:opacity-30"
                                >
                                    <Minus size={14} />
                                </button>

                                <span className="min-w-5 text-center text-xs font-bold">
                                    {quantity}
                                </span>

                                <button
                                    onClick={increaseQuantity}
                                    disabled={
                                        outOfStock ||
                                        (selectedStock !== null &&
                                            quantity >= selectedStock)
                                    }
                                    className="text-[#9a1e2f] disabled:opacity-30"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>

                        {/* TOTAL */}

                        <div className="mt-4 flex items-center justify-between border-t border-[#eee3de] pt-4">
                            <span className="text-xs font-semibold text-[#76655e]">
                                Total Amount
                            </span>

                            <strong className="text-xl text-[#30211d]">
                                {selectedPrice > 0
                                    ? money(
                                          selectedPrice *
                                              quantity
                                      )
                                    : "Price not set"}
                            </strong>
                        </div>

                        {/* BUY NOW */}

                        <button
                            onClick={() => addToCart(true)}
                            disabled={!canPurchase || adding}
                            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#e90016] text-sm font-extrabold text-white shadow-sm transition hover:bg-[#c50013] disabled:cursor-not-allowed disabled:bg-red-300"
                        >
                            {adding ? (
                                <Loader2
                                    size={17}
                                    className="animate-spin"
                                />
                            ) : (
                                <ShoppingBag size={17} />
                            )}

                            {outOfStock
                                ? "OUT OF STOCK"
                                : "Buy Now"}
                        </button>

                        <button
                            onClick={() => addToCart(false)}
                            disabled={!canPurchase || adding}
                            className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-[#9a1e2f] bg-white text-xs font-bold text-[#9a1e2f] transition hover:bg-[#fff0f1] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Add to Cart
                        </button>

                        {message && (
                            <p className="mt-3 rounded-lg border border-[#f1dfce] bg-[#fff8ef] p-3 text-center text-xs font-semibold text-[#9a1e2f]">
                                {message}
                            </p>
                        )}

                        {/* FEATURES */}

                        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#eee3de] pt-5">

                            <div className="flex items-center gap-2">
                                <Truck
                                    size={19}
                                    className="text-[#9a1e2f]"
                                />

                                <div>
                                    <p className="text-[10px] font-bold text-[#30211d]">
                                        Fast Delivery
                                    </p>

                                    <p className="text-[9px] text-[#a0928c]">
                                        Quick processing
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <ShieldCheck
                                    size={19}
                                    className="text-[#9a1e2f]"
                                />

                                <div>
                                    <p className="text-[10px] font-bold text-[#30211d]">
                                        Genuine Product
                                    </p>

                                    <p className="text-[9px] text-[#a0928c]">
                                        Quality assured
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <RefreshCcw
                                    size={19}
                                    className="text-[#9a1e2f]"
                                />

                                <div>
                                    <p className="text-[10px] font-bold text-[#30211d]">
                                        Customer Support
                                    </p>

                                    <p className="text-[9px] text-[#a0928c]">
                                        Help when needed
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <CheckCircle
                                    size={19}
                                    className="text-[#9a1e2f]"
                                />

                                <div>
                                    <p className="text-[10px] font-bold text-[#30211d]">
                                        Quality Products
                                    </p>

                                    <p className="text-[9px] text-[#a0928c]">
                                        Verified products
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* PRODUCT DESCRIPTION */}

                <section className="mt-8 rounded-xl border border-[#eee3de] bg-white p-5 shadow-sm sm:p-6">
                    <SectionTitle
                        title="Product Description"
                        subtitle="Complete details about this product"
                    />

                    <p className="whitespace-pre-wrap text-sm leading-7 text-[#76655e]">
                        {product.description}
                    </p>
                </section>

                {/* PRODUCT INFORMATION */}

                <section className="mt-6 rounded-xl border border-[#eee3de] bg-white p-5 shadow-sm sm:p-6">
                    <SectionTitle
                        title="Product Information"
                        subtitle="Product details retrieved from your database"
                    />

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        <InfoItem
                            label="Product ID"
                            value={String(product.id)}
                        />

                        <InfoItem
                            label="Unique ID"
                            value={product.uniqueId}
                        />

                        <InfoItem
                            label="Branch Code"
                            value={product.branchCode}
                        />

                        <InfoItem
                            label="Product Name"
                            value={product.name}
                        />

                        <InfoItem
                            label="Category"
                            value={product.category}
                        />

                        <InfoItem
                            label="Sub Category"
                            value={product.subcategory}
                        />

                        <InfoItem
                            label="Brand"
                            value={product.brand}
                        />

                        <InfoItem
                            label="Unit"
                            value={product.unit}
                        />

                        <InfoItem
                            label="Status"
                            value={product.status}
                        />

                        <InfoItem
                            label="Current Stock"
                            value={
                                product.stock === null
                                    ? "Not provided"
                                    : String(product.stock)
                            }
                        />

                        <InfoItem
                            label="Created Date"
                            value={dateFormat(product.createdAt)}
                        />

                        <InfoItem
                            label="Updated Date"
                            value={dateFormat(product.updatedAt)}
                        />
                    </div>
                </section>

                {/* PURCHASE HISTORY */}

                <section className="mt-6 rounded-xl border border-[#eee3de] bg-white p-5 shadow-sm sm:p-6">
                    <SectionTitle
                        title="Purchase Information & History"
                        subtitle={`${purchaseItems.length} purchase record(s)`}
                    />

                    {purchaseItems.length === 0 ? (
                        <p className="rounded-lg bg-[#fffaf7] p-4 text-xs text-[#a0928c]">
                            No purchase history available.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {purchaseItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-xl border border-[#eee3de] bg-[#fffdfb] p-4"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-bold text-[#30211d]">
                                                Purchase Item #{item.id}
                                            </p>

                                            <p className="mt-1 text-[10px] text-[#a0928c]">
                                                {item.purchase?.unique_id ||
                                                    `Purchase ID #${item.purchase_id}`}
                                            </p>
                                        </div>

                                        <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold text-green-700">
                                            {item.purchase?.status ||
                                                "N/A"}
                                        </span>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                                        <InfoItem
                                            label="Invoice Number"
                                            value={
                                                item.purchase?.invoice_number ||
                                                "N/A"
                                            }
                                        />

                                        <InfoItem
                                            label="Purchase Date"
                                            value={dateFormat(
                                                item.purchase?.purchase_date
                                            )}
                                        />

                                        <InfoItem
                                            label="Quantity"
                                            value={String(
                                                item.quantity ?? "N/A"
                                            )}
                                        />

                                        <InfoItem
                                            label="Purchase Price"
                                            value={
                                                money(item.purchase_price) ||
                                                "Not set"
                                            }
                                        />

                                        <InfoItem
                                            label="MRP"
                                            value={
                                                money(item.mrp) ||
                                                "Not set"
                                            }
                                        />

                                        <InfoItem
                                            label="Selling Price"
                                            value={
                                                money(item.selling_price) ||
                                                "Not set"
                                            }
                                        />

                                        <InfoItem
                                            label="Discount"
                                            value={
                                                money(item.discount) ||
                                                "₹0"
                                            }
                                        />

                                        <InfoItem
                                            label="Tax"
                                            value={
                                                money(item.tax) ||
                                                "₹0"
                                            }
                                        />

                                        <InfoItem
                                            label="Total Amount"
                                            value={
                                                money(item.total_amount) ||
                                                "₹0"
                                            }
                                        />

                                        <InfoItem
                                            label="Payment Status"
                                            value={
                                                item.purchase?.payment_status ||
                                                "N/A"
                                            }
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <p className="mb-2 text-[10px] font-bold uppercase text-[#a0928c]">
                                            Variant Attributes
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {getAttributes(item).length >
                                            0 ? (
                                                getAttributes(item).map(
                                                    (attr, index) => (
                                                        <span
                                                            key={index}
                                                            className="rounded-md bg-[#fff0e7] px-3 py-2 text-[10px] font-semibold text-[#9a1e2f]"
                                                        >
                                                            {attr.name}:{" "}
                                                            {attr.value}
                                                        </span>
                                                    )
                                                )
                                            ) : (
                                                <span className="text-xs text-gray-400">
                                                    No attributes
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* TRUST FEATURES */}

                <section className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-[#eee3de] bg-white p-5 shadow-sm sm:grid-cols-4">

                    <div className="flex items-center gap-3">
                        <Truck
                            size={21}
                            className="text-[#9a1e2f]"
                        />

                        <div>
                            <p className="text-xs font-bold text-[#30211d]">
                                Fast Delivery
                            </p>

                            <p className="text-[10px] text-[#a0928c]">
                                Quick order processing
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <ShieldCheck
                            size={21}
                            className="text-[#9a1e2f]"
                        />

                        <div>
                            <p className="text-xs font-bold text-[#30211d]">
                                Genuine Product
                            </p>

                            <p className="text-[10px] text-[#a0928c]">
                                Quality assured
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <RefreshCcw
                            size={21}
                            className="text-[#9a1e2f]"
                        />

                        <div>
                            <p className="text-xs font-bold text-[#30211d]">
                                Customer Support
                            </p>

                            <p className="text-[10px] text-[#a0928c]">
                                Help when needed
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <CheckCircle
                            size={21}
                            className="text-[#9a1e2f]"
                        />

                        <div>
                            <p className="text-xs font-bold text-[#30211d]">
                                Verified Items
                            </p>

                            <p className="text-[10px] text-[#a0928c]">
                                Quality products
                            </p>
                        </div>
                    </div>

                </section>
            </div>
        </main>
    );
}

/* =====================================================
   EXPORT
===================================================== */

export default function ProductDetails() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-[#fffaf7]">
                    <Loader2
                        className="animate-spin text-[#9a1e2f]"
                        size={38}
                    />
                </div>
            }
        >
            <ProductDetailsContent />
        </Suspense>
    );
}
