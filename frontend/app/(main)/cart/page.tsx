"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import CartHeader from "@/components/main/cart/CartHeader";
import CartList from "@/components/main/cart/CartList";
import CartSummary from "@/components/main/cart/CartSummary";
import EmptyCart from "@/components/main/cart/EmptyCart";

import type { CartProduct } from "@/components/main/cart/CartItem";

/* =====================================================
   STORAGE KEY

   ProductCard.tsx me bhi SAME key honi chahiye.
===================================================== */

const CART_STORAGE_KEY = "alibros-cart";

/* =====================================================
   CART PAGE
===================================================== */

export default function CartPage() {
  const router = useRouter();

  /* ===================================================
     STATE
  =================================================== */

  const [cartItems, setCartItems] = useState<
    CartProduct[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  /* ===================================================
     LOAD CART FROM LOCAL STORAGE
  =================================================== */

  useEffect(() => {
    try {
      const savedCart =
        localStorage.getItem(
          CART_STORAGE_KEY
        );

      if (!savedCart) {
        setCartItems([]);
        return;
      }

      const parsedCart =
        JSON.parse(savedCart);

      /* ===============================================
         BASIC VALIDATION
      ================================================ */

      if (Array.isArray(parsedCart)) {
        const validItems =
          parsedCart.filter(
            (item) =>
              item &&
              item.id !== undefined &&
              item.name &&
              typeof item.price ===
              "number"
          );

        setCartItems(validItems);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error(
        "Cart load error:",
        error
      );

      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ===================================================
     SAVE CART

     Har change ke baad:
     - localStorage update
     - state update
     - navbar ko event send
  =================================================== */

  const updateCart = (
    updatedCart: CartProduct[]
  ) => {
    setCartItems(updatedCart);

    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(updatedCart)
    );

    /* ===============================================
       NAVBAR CART COUNT UPDATE EVENT
    ================================================ */

    window.dispatchEvent(
      new Event("cart-updated")
    );
  };

  /* ===================================================
     INCREASE QUANTITY
  =================================================== */

  const handleIncrease = (
    id: number | string
  ) => {
    const updatedCart =
      cartItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,

            quantity:
              (item.quantity || 1) + 1,
          };
        }

        return item;
      });

    updateCart(updatedCart);
  };

  /* ===================================================
     DECREASE QUANTITY
  =================================================== */

  const handleDecrease = (
    id: number | string
  ) => {
    const updatedCart =
      cartItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,

            quantity: Math.max(
              1,
              (item.quantity || 1) - 1
            ),
          };
        }

        return item;
      });

    updateCart(updatedCart);
  };

  /* ===================================================
     REMOVE PRODUCT
  =================================================== */

  const handleRemove = (
    id: number | string
  ) => {
    const updatedCart =
      cartItems.filter(
        (item) => item.id !== id
      );

    updateCart(updatedCart);
  };

  /* ===================================================
     TOTAL ITEMS

     Example:
     Cake quantity = 2
     Pastry quantity = 3

     Total Items = 5
  =================================================== */

  const totalItems = useMemo(() => {
    return cartItems.reduce(
      (total, item) => {
        return (
          total +
          (item.quantity || 1)
        );
      },
      0
    );
  }, [cartItems]);

  /* ===================================================
     SUBTOTAL

     price × quantity
  =================================================== */

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => {
        return (
          total +
          item.price *
          (item.quantity || 1)
        );
      },
      0
    );
  }, [cartItems]);

  /* ===================================================
     DELIVERY CHARGE

     Filhaal FREE rakha hai.
  =================================================== */

  const deliveryCharge = 0;

  /* ===================================================
     DISCOUNT

     Filhaal koi automatic discount nahi.
  =================================================== */

  const discount = 0;

  /* ===================================================
     CHECKOUT
  =================================================== */

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      return;
    }

    /*
      Checkout page jab bana loge:

      router.push("/checkout");
    */

    router.push("/checkout");
  };

  /* ===================================================
     LOADING
  =================================================== */

  if (loading) {
    return (
      <main
        className="
          min-h-screen
          bg-[#fffaf7]
        "
      >
        <div
          className="
            mx-auto
            max-w-[1450px]
            px-4
            py-10

            sm:px-6

            lg:px-10
            lg:py-12
          "
        >
          <CartLoading />
        </div>
      </main>
    );
  }

  /* ===================================================
     PAGE
  =================================================== */

  return (
    <main
      className="
        min-h-screen
        bg-[#fffaf7]
      "
    >
      <section
        className="
          mx-auto
          max-w-[1450px]
          px-4
          py-8

          sm:px-6
          sm:py-10

          lg:px-10
          lg:py-12
        "
      >
        {/* =================================================
            HEADER
        ================================================== */}

        <CartHeader
          totalItems={totalItems}
        />

        {/* =================================================
            EMPTY CART
        ================================================== */}

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          /* =================================================
             CART CONTENT
          ================================================== */

          <div
            className="
              grid
              grid-cols-1
              items-start
              gap-6

              lg:grid-cols-[minmax(0,1fr)_360px]

              xl:grid-cols-[minmax(0,1fr)_390px]
              xl:gap-8
            "
          >
            {/* =============================================
                LEFT SIDE
            ============================================== */}

            <div className="min-w-0">
              <CartList
                items={cartItems}
                onIncrease={
                  handleIncrease
                }
                onDecrease={
                  handleDecrease
                }
                onRemove={
                  handleRemove
                }
              />
            </div>

            {/* =============================================
                RIGHT SIDE
            ============================================== */}

            <div
              className="
                lg:sticky
                lg:top-[100px]
              "
            >
              <CartSummary
                subtotal={subtotal}
                deliveryCharge={
                  deliveryCharge
                }
                discount={discount}
                onCheckout={
                  handleCheckout
                }
              />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

/* =====================================================
   LOADING SKELETON
===================================================== */

function CartLoading() {
  return (
    <div
      className="
        animate-pulse
        space-y-6
      "
    >
      {/* HEADER */}

      <div
        className="
          flex
          items-end
          justify-between
          border-b
          border-[#eadbd5]
          pb-5
        "
      >
        <div>
          <div
            className="
              h-4
              w-[120px]
              rounded-full
              bg-[#F5E9E5]
            "
          />

          <div
            className="
              mt-3
              h-10
              w-[200px]
              rounded-xl
              bg-[#F5E9E5]
            "
          />

          <div
            className="
              mt-3
              h-3
              w-[160px]
              rounded-full
              bg-[#F5E9E5]
            "
          />
        </div>

        <div
          className="
            hidden
            h-11
            w-[170px]
            rounded-full
            bg-[#F5E9E5]

            sm:block
          "
        />
      </div>

      {/* CONTENT */}

      <div
        className="
          grid
          grid-cols-1
          gap-6

          lg:grid-cols-[minmax(0,1fr)_360px]

          xl:grid-cols-[minmax(0,1fr)_390px]
        "
      >
        {/* PRODUCTS */}

        <div className="space-y-4">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="
                h-[170px]
                rounded-[22px]
                border
                border-[#eadbd5]
                bg-white
                p-4
              "
            >
              <div
                className="
                  flex
                  h-full
                  gap-4
                "
              >
                <div
                  className="
                    h-full
                    w-[140px]
                    rounded-[18px]
                    bg-[#F5E9E5]
                  "
                />

                <div
                  className="
                    flex-1
                    py-2
                  "
                >
                  <div
                    className="
                      h-3
                      w-[90px]
                      rounded-full
                      bg-[#F5E9E5]
                    "
                  />

                  <div
                    className="
                      mt-3
                      h-6
                      w-[220px]
                      max-w-full
                      rounded-lg
                      bg-[#F5E9E5]
                    "
                  />

                  <div
                    className="
                      mt-3
                      h-3
                      w-[280px]
                      max-w-full
                      rounded-full
                      bg-[#F5E9E5]
                    "
                  />

                  <div
                    className="
                      mt-5
                      h-5
                      w-[90px]
                      rounded-lg
                      bg-[#F5E9E5]
                    "
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}

        <div
          className="
            h-[420px]
            rounded-[24px]
            border
            border-[#eadbd5]
            bg-white
          "
        />
      </div>
    </div>
  );
}