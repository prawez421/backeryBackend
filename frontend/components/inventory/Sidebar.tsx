
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Package,
  Tags,
  Truck,
  ArrowDownToLine,
  ArrowUpFromLine,
  AlertTriangle,
  CalendarClock,
  History,
  BarChart3,
  Settings,
  LogOut,
  X,
  Warehouse,
  ChevronRight,
  ChevronDown,
  Ruler,
  Layers,
  Settings2,
  ChefHat,
  ClipboardList,
  Factory,
  Trash2,
  ShoppingBag,
  Cake,
} from "lucide-react";

import { toast } from "sonner";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const masterItems = [
{ label: "Vendor Master", href: "/inventory/vendors", icon: Truck },
  { label: "Product Master", href: "/inventory/products", icon: Package },
  { label: "Category Master", href: "/inventory/categories", icon: Tags },
  { label: "Attribute Master", href: "/inventory/attributes", icon: Settings2 },
  { label: "Unit Master", href: "/inventory/units", icon: Ruler },
  { label: "Raw Material Master", href: "/inventory/raw-materials", icon: Layers },
  { label: "Recipe Master", href: "/inventory/recipes", icon: ChefHat },
];

const menuItems = [
  { label: "Purchase / Stock In", href: "/inventory/stock-in", icon: ArrowDownToLine },
  { label: "Production Management", href: "/inventory/production", icon: Factory },
  { label: "Stock Out / Consumption", href: "/inventory/stock-out", icon: ArrowUpFromLine },
  { label: "Finished Goods", href: "/inventory/finished-goods", icon: Cake },
  { label: "Wastage Management", href: "/inventory/wastage", icon: Trash2 },
  { label: "Low Stock", href: "/inventory/low-stock", icon: AlertTriangle },
  { label: "Expiry Management", href: "/inventory/expiry", icon: CalendarClock },
  { label: "Stock History", href: "/inventory/history", icon: History },
  { label: "Reports", href: "/inventory/reports", icon: BarChart3 },
  { label: "Settings", href: "/inventory/settings", icon: Settings },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [masterOpen, setMasterOpen] = useState(
    () => masterItems.some(
      (item) => pathname === item.href || pathname.startsWith(item.href + "/")
    )
  );

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isMasterActive = masterItems.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await axiosInstance.post(ProjectApiList.logout);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      toast.success("Logout successful!");
      setShowLogoutModal(false);
      onClose();
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-orange-100 bg-white shadow-sm transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-orange-100 px-5">
          <Link
            href="/inventory/dashboard"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
              <Warehouse className="h-6 w-6 text-orange-600" />
            </div>

            <span className="text-xl font-bold">
              <span className="text-orange-600">Cake</span>
              <span className="text-gray-800">House</span>
              <span className="block text-xs font-medium text-gray-500">
                Bakery Inventory
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-orange-50 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Bakery Inventory
          </p>

          {/* Dashboard */}
          <Link
            href="/inventory/dashboard"
            onClick={onClose}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${
              pathname === "/inventory/dashboard"
                ? "bg-orange-500 text-white"
                : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
            }`}
          >
            <LayoutDashboard size={19} />
            Dashboard
          </Link>

          {/* Master Setup */}
          <div>
            <button
              type="button"
              onClick={() => setMasterOpen((prev) => !prev)}
              aria-expanded={masterOpen}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium ${
                isMasterActive
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              <span className="flex items-center gap-3">
                <Settings2 size={19} />
                Master Setup
              </span>

              {masterOpen ? (
                <ChevronDown size={17} />
              ) : (
                <ChevronRight size={17} />
              )}
            </button>

            {masterOpen && (
              <div className="ml-5 mt-2 space-y-1 border-l-2 border-orange-100 pl-3">
                {masterItems.map((item) => {
                  const Icon = item.icon;

                  const active =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium ${
                        active
                          ? "bg-orange-500 text-white"
                          : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                      }`}
                    >
                      <Icon size={17} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Inventory Operations */}
          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium ${
                  active
                    ? "bg-orange-500 text-white"
                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={19} />
                  {item.label}
                </span>

                {active && <ChevronRight size={17} />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="space-y-3 border-t border-orange-100 p-4">
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100"
          >
            <LogOut size={19} />
            Logout
          </button>

          <div className="px-2">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} CakeHouse
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Bakery Inventory Management
            </p>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-7 w-7 text-red-600" />
            </div>

            <h2
              id="logout-title"
              className="text-center text-xl font-bold text-gray-800"
            >
              Confirm Logout
            </h2>

            <p className="mt-2 text-center text-sm text-gray-500">
              Are you sure you want to logout?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={loggingOut}
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={loggingOut}
                onClick={handleLogout}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                <LogOut size={17} />
                {loggingOut ? "Logging out..." : "Yes, Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
