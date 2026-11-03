"use client";

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  CakeSlice,
  ChevronDown,
  Menu,
  ShoppingBag,
  X,
} from "lucide-react";

/* =====================================================
   CART STORAGE
===================================================== */

const CART_STORAGE_KEY = "alibros-cart";

type StoredCartItem = {
  id: number | string;
  quantity?: number;
};

/* =====================================================
   MENU DROPDOWN
===================================================== */

const menuCategories = [
  {
    name: "All Products",
    href: "/menu",
  },
  {
    name: "Cakes",
    href: "/menu?category=cakes",
  },
  {
    name: "Cupcakes",
    href: "/menu?category=cupcakes",
  },
  {
    name: "Pastries",
    href: "/menu?category=pastries",
  },
  {
    name: "Cookies",
    href: "/menu?category=cookies",
  },
  {
    name: "Breads",
    href: "/menu?category=breads",
  },
];

/* =====================================================
   NAVBAR
===================================================== */

export default function Navbar() {
  const pathname = usePathname();

  /* ===================================================
     STATES
  =================================================== */

  const [menuOpen, setMenuOpen] = useState(false);

  const [
    desktopMenuOpen,
    setDesktopMenuOpen,
  ] = useState(false);

  const [
    mobileMenuDropdown,
    setMobileMenuDropdown,
  ] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  /* ===================================================
     CART COUNT
  =================================================== */

  const [cartCount, setCartCount] = useState(0);

  /* ===================================================
     READ CART COUNT
  =================================================== */

  const updateCartCount = useCallback(() => {
    try {
      const savedCart =
        localStorage.getItem(CART_STORAGE_KEY);

      if (!savedCart) {
        setCartCount(0);
        return;
      }

      const parsedCart = JSON.parse(savedCart);

      if (!Array.isArray(parsedCart)) {
        setCartCount(0);
        return;
      }

      const cart =
        parsedCart as StoredCartItem[];

      const totalQuantity = cart.reduce(
        (total, item) => {
          const quantity = Number(item.quantity);

          if (
            !Number.isFinite(quantity) ||
            quantity <= 0
          ) {
            return total + 1;
          }

          return total + quantity;
        },
        0
      );

      setCartCount(totalQuantity);
    } catch (error) {
      console.error(
        "Navbar cart count error:",
        error
      );

      setCartCount(0);
    }
  }, []);

  /* ===================================================
     CART LISTENERS
  =================================================== */

  useEffect(() => {
    updateCartCount();

    const handleCartUpdated = () => {
      updateCartCount();
    };

    const handleStorage = (
      event: StorageEvent
    ) => {
      if (event.key === CART_STORAGE_KEY) {
        updateCartCount();
      }
    };

    window.addEventListener(
      "cart-updated",
      handleCartUpdated
    );

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "cart-updated",
        handleCartUpdated
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, [updateCartCount]);

  /* ===================================================
     SCROLL EFFECT
  =================================================== */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* ===================================================
     ROUTE CHANGE
  =================================================== */

  useEffect(() => {
    setMenuOpen(false);
    setMobileMenuDropdown(false);
    setDesktopMenuOpen(false);

    updateCartCount();
  }, [pathname, updateCartCount]);

  /* ===================================================
     MOBILE BODY SCROLL
  =================================================== */

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* ===================================================
     ACTIVE LINK
  =================================================== */

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(
      href.split("?")[0]
    );
  };

  /* ===================================================
     RETURN
  =================================================== */

  return (
    <>
      {/* =================================================
          NAVBAR
      ================================================== */}

      <header
        className={`
          sticky
          top-0
          z-50
          w-full
          border-b
          transition-all
          duration-300

          ${
            scrolled
              ? `
                  border-[#eadbd5]
                  bg-[#fffaf7]/95
                  shadow-[0_5px_25px_rgba(67,32,27,0.06)]
                  backdrop-blur-xl
                `
              : `
                  border-[#eadbd5]/70
                  bg-[#fffaf7]
                `
          }
        `}
      >
        <div
          className="
            mx-auto
            flex
            h-[76px]
            max-w-[1500px]
            items-center
            justify-between
            px-4
            sm:px-6
            lg:h-[82px]
            lg:px-8
            xl:px-10
          "
        >
          {/* =================================================
              LOGO
          ================================================== */}

          <Link
            href="/"
            className="
              group
              flex
              shrink-0
              items-center
              gap-2.5
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-[#9a1e2f]
                text-white
                transition-transform
                duration-300
                group-hover:-rotate-6
              "
            >
              <CakeSlice
                size={18}
                strokeWidth={1.7}
              />
            </div>

            <div>
              <h1
                className="
                  font-serif
                  text-[22px]
                  font-semibold
                  leading-none
                  tracking-[-0.3px]
                  text-[#30211d]
                  sm:text-[24px]
                "
              >
                ALIBROS
              </h1>

              <p
                className="
                  mt-1
                  text-[7px]
                  font-bold
                  uppercase
                  tracking-[3.5px]
                  text-[#9a1e2f]
                "
              >
                Bakery
              </p>
            </div>
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================== */}

          <nav
            className="
              hidden
              items-center
              gap-1
              lg:flex
            "
          >
            {/* HOME */}

            <DesktopLink
              href="/"
              active={isActive("/")}
            >
              Home
            </DesktopLink>

            {/* ABOUT */}

            <DesktopLink
              href="/about"
              active={isActive("/about")}
            >
              About
            </DesktopLink>

            {/* =================================================
                MENU DROPDOWN
            ================================================== */}

            <div
  className="relative"
  onMouseEnter={() => setDesktopMenuOpen(true)}
  onMouseLeave={() => setDesktopMenuOpen(false)}
>
  <div
    className={`
      flex items-center rounded-full
      text-[13px] font-medium
      transition-colors duration-300
      ${
        isActive("/menu")
          ? "bg-[#F5E9E5] text-[#9a1e2f]"
          : "text-[#594641] hover:bg-[#F5E9E5] hover:text-[#9a1e2f]"
      }
    `}
  >
    {/* MENU LINK */}
    <Link
      href="/menu"
      onClick={() => setDesktopMenuOpen(false)}
      className="py-2.5 pl-4 pr-1"
    >
      Menu
    </Link>

    {/* DROPDOWN BUTTON */}
    <button
      type="button"
      aria-label="Toggle menu categories"
      aria-expanded={desktopMenuOpen}
      onClick={() => setDesktopMenuOpen((prev) => !prev)}
      className="py-2.5 pl-1 pr-4"
    >
      <ChevronDown
        size={13}
        strokeWidth={1.8}
        className={`transition-transform duration-300 ${
          desktopMenuOpen ? "rotate-180" : ""
        }`}
      />
    </button>
  </div>

  {/* DROPDOWN */}
  <AnimatePresence>
    {desktopMenuOpen && (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.18 }}
        className="absolute left-1/2 top-full z-50 w-[220px] -translate-x-1/2 pt-3"
      >
        <div className="overflow-hidden rounded-[20px] border border-[#eadbd5] bg-white p-2 shadow-[0_18px_50px_rgba(60,30,25,0.12)]">
          {menuCategories.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setDesktopMenuOpen(false)}
              className="flex items-center justify-between rounded-[13px] px-4 py-3 text-[12px] font-medium text-[#594641] transition-colors duration-200 hover:bg-[#F5E9E5] hover:text-[#9a1e2f]"
            >
              {item.name}
              <span className="text-[13px]">→</span>
            </Link>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>

            {/* =================================================
                CUSTOM CAKES
            ================================================== */}

            <DesktopLink
              href="/custom-cakes"
              active={isActive("/custom-cakes")}
            >
              Custom Cakes
            </DesktopLink>

            {/* CONTACT */}

            <DesktopLink
              href="/contact"
              active={isActive("/contact")}
            >
              Contact
            </DesktopLink>
          </nav>


                 
              <Link className="flex items-center justify-between rounded-[13px] px-4 py-3 text-[14px] font-medium transition-colors duration-200 hover:bg-[#F5E9E5] bg-[#af2f40] text-[#F5E9E5] hover:text-[#9a1e2f]"
                  href="/auth/login"> Login </Link>
 
          {/* =================================================
              RIGHT ACTIONS
          ================================================== */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            {/* CART */}

            <Link
              href="/cart"
              aria-label={`Shopping cart with ${cartCount} items`}
              className="
                group
                relative
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                border
                border-[#eadbd5]
                bg-white
                text-[#493630]
                transition-all
                duration-300
                hover:border-[#9a1e2f]
                hover:bg-[#9a1e2f]
                hover:text-white
              "
            >
              <ShoppingBag
                size={18}
                strokeWidth={1.7}
              />

              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    flex
                    h-[20px]
                    min-w-[20px]
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    border-[#fffaf7]
                    bg-[#9a1e2f]
                    px-1
                    text-[8px]
                    font-bold
                    text-white
                    group-hover:border-[#9a1e2f]
                    group-hover:bg-white
                    group-hover:text-[#9a1e2f]
                  "
                >
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </Link>

            {/* MOBILE MENU BUTTON */}

            <button
              type="button"
              onClick={() =>
                setMenuOpen(true)
              }
              aria-label="Open navigation menu"
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                border
                border-[#eadbd5]
                bg-white
                text-[#493630]
                transition-colors
                duration-300
                hover:border-[#9a1e2f]
                hover:text-[#9a1e2f]
                lg:hidden
              "
            >
              <Menu
                size={19}
                strokeWidth={1.7}
              />
            </button>
          </div>
        </div>
      </header>

      {/* =================================================
          MOBILE MENU
      ================================================== */}

      <AnimatePresence>
        {menuOpen && (
          <>
            {/* BACKDROP */}

            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() =>
                setMenuOpen(false)
              }
              className="
                fixed
                inset-0
                z-[60]
                bg-black/35
                backdrop-blur-[2px]
                lg:hidden
              "
            />

            {/* MOBILE DRAWER */}

            <motion.aside
              initial={{
                x: "100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "100%",
              }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 32,
              }}
              className="
                fixed
                bottom-0
                right-0
                top-0
                z-[70]
                flex
                w-[88%]
                max-w-[380px]
                flex-col
                bg-[#fffaf7]
                shadow-[-15px_0_50px_rgba(50,25,20,0.15)]
                lg:hidden
              "
            >
              {/* MOBILE HEADER */}

              <div
                className="
                  flex
                  h-[76px]
                  shrink-0
                  items-center
                  justify-between
                  border-b
                  border-[#eadbd5]
                  px-5
                "
              >
                <Link
                  href="/"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="
                    flex
                    items-center
                    gap-2.5
                  "
                >
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      bg-[#9a1e2f]
                      text-white
                    "
                  >
                    <CakeSlice
                      size={16}
                      strokeWidth={1.7}
                    />
                  </div>

                  <div>
                    <h2
                      className="
                        font-serif
                        text-[20px]
                        font-semibold
                        leading-none
                        text-[#30211d]
                      "
                    >
                      ALIBROS
                    </h2>

                    <p
                      className="
                        mt-1
                        text-[6px]
                        font-bold
                        uppercase
                        tracking-[3px]
                        text-[#9a1e2f]
                      "
                    >
                      Bakery
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#eadbd5]
                    bg-white
                    text-[#493630]
                    transition-colors
                    hover:border-[#9a1e2f]
                    hover:text-[#9a1e2f]
                  "
                >
                  <X
                    size={18}
                    strokeWidth={1.7}
                  />
                </button>
              </div>

              {/* =================================================
                  MOBILE LINKS
              ================================================== */}

              <div
                className="
                  flex-1
                  overflow-y-auto
                  px-4
                  py-5
                "
              >
                {/* HOME */}

                <MobileLink
                  href="/"
                  active={isActive("/")}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  Home
                </MobileLink>

                {/* ABOUT */}

                <MobileLink
                  href="/about"
                  active={isActive("/about")}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  About
                </MobileLink>

                {/* =================================================
                    MOBILE MENU DROPDOWN
                ================================================== */}

                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setMobileMenuDropdown(
                        (prev) => !prev
                      )
                    }
                    className={`
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-xl
                      px-4
                      py-3.5
                      text-[14px]
                      font-medium
                      transition-colors

                      ${
                        isActive("/menu")
                          ? `
                              bg-[#F5E9E5]
                              text-[#9a1e2f]
                            `
                          : `
                              text-[#403633]
                              hover:bg-[#F5E9E5]
                              hover:text-[#9a1e2f]
                            `
                      }
                    `}
                  >
                    Menu

                    <ChevronDown
                      size={16}
                      className={`
                        transition-transform
                        duration-300

                        ${
                          mobileMenuDropdown
                            ? "rotate-180"
                            : ""
                        }
                      `}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileMenuDropdown && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          height: 0,
                        }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                        }}
                        className="overflow-hidden"
                      >
                        <div
                          className="
                            ml-4
                            mt-1
                            space-y-1
                            border-l
                            border-[#eadbd5]
                            py-2
                            pl-3
                          "
                        >
                          {menuCategories.map(
                            (item) => (
                              <Link
                                key={
                                  item.name
                                }
                                href={
                                  item.href
                                }
                                onClick={() =>
                                  setMenuOpen(
                                    false
                                  )
                                }
                                className="
                                  block
                                  rounded-lg
                                  px-3
                                  py-2.5
                                  text-[12px]
                                  font-medium
                                  text-[#75625c]
                                  transition-colors
                                  hover:bg-[#F5E9E5]
                                  hover:text-[#9a1e2f]
                                "
                              >
                                {item.name}
                              </Link>
                            )
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* =================================================
                    CUSTOM CAKES
                ================================================== */}

                <MobileLink
                  href="/custom-cakes"
                  active={isActive(
                    "/custom-cakes"
                  )}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  Custom Cakes
                </MobileLink>

                {/* CONTACT */}

                <MobileLink
                  href="/contact"
                  active={isActive("/contact")}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  Contact
                </MobileLink>

                {/* DIVIDER */}

                <div
                  className="
                    my-3
                    h-px
                    bg-[#eee2dd]
                  "
                />

            

                {/* MY CART */}

                <Link
                  href="/cart"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className={`
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    px-4
                    py-3.5
                    text-[14px]
                    font-medium
                    transition-colors

                    ${
                      pathname === "/cart"
                        ? `
                            bg-[#F5E9E5]
                            text-[#9a1e2f]
                          `
                        : `
                            text-[#403633]
                            hover:bg-[#F5E9E5]
                            hover:text-[#9a1e2f]
                          `
                    }
                  `}
                >
                  <span
                    className="
                      flex
                      items-center
                      gap-2.5
                    "
                  >
                    <ShoppingBag
                      size={17}
                      strokeWidth={1.7}
                    />

                    My Cart
                  </span>

                  {cartCount > 0 && (
                    <span
                      className="
                        flex
                        h-7
                        min-w-7
                        items-center
                        justify-center
                        rounded-full
                        bg-[#f8e8e9]
                        px-2
                        text-[10px]
                        font-bold
                        text-[#8f1728]
                      "
                    >
                      {cartCount > 99
                        ? "99+"
                        : cartCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* MOBILE BOTTOM */}

              <div
                className="
                  shrink-0
                  border-t
                  border-[#eadbd5]
                  bg-[#F5E9E5]/50
                  px-5
                  py-4
                "
              >
                <p
                  className="
                    text-center
                    text-[10px]
                    leading-5
                    text-[#8a7771]
                  "
                >
                  Freshly baked with care at
                  Alibros Bakery.
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* =====================================================
   DESKTOP LINK
===================================================== */

function DesktopLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`
        rounded-full
        px-4
        py-2.5
        text-[13px]
        font-medium
        transition-colors
        duration-300

        ${
          active
            ? `
                bg-[#F5E9E5]
                text-[#9a1e2f]
              `
            : `
                text-[#594641]
                hover:bg-[#F5E9E5]
                hover:text-[#9a1e2f]
              `
        }
      `}
    >
      {children}
    </Link>
  );
}

/* =====================================================
   MOBILE LINK
===================================================== */

function MobileLink({
  href,
  active,
  onClick,
  children,
}: {
  href: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        block
        rounded-xl
        px-4
        py-3.5
        text-[14px]
        font-medium
        transition-colors

        ${
          active
            ? `
                bg-[#F5E9E5]
                text-[#9a1e2f]
              `
            : `
                text-[#403633]
                hover:bg-[#F5E9E5]
                hover:text-[#9a1e2f]
              `
        }
      `}
    >
      {children}
    </Link>
  );
}