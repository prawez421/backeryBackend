"use client";

import { Suspense, useState } from "react";

import MenuSidebar from "@/components/main/menu/MenuSidebar";
import MenuSearch from "@/components/main/menu/MenuSearch";
import ProductsGrid from "@/components/main/menu/ProductsGrid";

// ==========================================
// MENU LOADING
// ==========================================
function MenuLoading() {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#f5e9e5] border-t-[#9a1e2f]" />
    </div>
  );
}

// ==========================================
// MENU CONTENT
// ==========================================
function MenuContent() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#fffaf7]">
      <section
        id="menu-products"
        className="
          relative
          flex
          min-h-screen
          items-start
          bg-[#fffaf7]
          py-4
        "
      >
        {/* ==========================================
            DESKTOP STICKY SIDEBAR
        =========================================== */}
        <aside
          className="
            sticky
            top-[92px]
            left-[10px]
            z-30
            hidden
            h-[calc(100vh-108px)]
            w-[280px]
            shrink-0
            self-start
            lg:block
            xl:w-[300px]
          "
        >
          <div
            className="
              h-full
              w-full
              overflow-x-hidden
              overflow-y-auto
              rounded-[24px]
              [&::-webkit-scrollbar]:w-[4px]
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-[#d8c4be]
            "
          >
            <MenuSidebar />
          </div>
        </aside>

        {/* ==========================================
            MOBILE SIDEBAR
        =========================================== */}
        <div className="lg:hidden">
          <MenuSidebar
            mobileOpen={mobileSidebarOpen}
            onMobileClose={() => setMobileSidebarOpen(false)}
          />
        </div>

        {/* ==========================================
            RIGHT CONTENT
        =========================================== */}
        <div
          className="
            w-full
            min-w-0
            px-3
            sm:px-4
            lg:pl-5
            lg:pr-5
            xl:pr-6
          "
        >
          {/* SEARCH */}
          <MenuSearch
            onOpenSidebar={() => setMobileSidebarOpen(true)}
          />

          {/* PRODUCTS */}
          <ProductsGrid />
        </div>
      </section>
    </main>
  );
}

// ==========================================
// MAIN PAGE WITH SUSPENSE
// ==========================================
export default function MenuPage() {
  return (
    <Suspense fallback={<MenuLoading />}>
      <MenuContent />
    </Suspense>
  );
}