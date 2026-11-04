
"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

type NavbarProps = {
  onMenuClick: () => void;
};

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!search.trim()) {
      toast.warning("Please enter something to search.");
      return;
    }

    toast.info(`Searching for "${search}"...`);
  };

  const handleNotification = () => {
    toast.info("You have no new notifications.");
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-orange-100 bg-white px-4 sm:px-6 lg:px-8">

      {/* Left Side */}
      <div className="flex items-center gap-4">

        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg border border-gray-200 p-2 text-gray-700 transition hover:bg-orange-50 hover:text-orange-600 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        {/* Page Title */}
        <div>
          <h1 className="text-lg font-semibold text-gray-800">
            Bakery Admin
          </h1>

          <p className="hidden text-xs text-gray-400 sm:block">
            Manage your bakery business
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 sm:gap-5">

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="relative hidden md:block"
        >
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-48 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:bg-white lg:w-56"
          />
        </form>

        {/* Notifications */}
        <button
          type="button"
          onClick={handleNotification}
          className="relative rounded-lg border border-gray-200 p-2.5 text-gray-600 transition hover:bg-orange-50 hover:text-orange-600"
          aria-label="Notifications"
        >
          <Bell size={21} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" />
        </button>

        {/* Profile */}
        <div className="relative">

          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-orange-50 sm:gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
              A
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-gray-800">
                Admin
              </p>

              <p className="text-xs text-gray-400">
                Administrator
              </p>
            </div>

            <ChevronDown
              size={16}
              className="hidden text-gray-500 sm:block"
            />
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileOpen(false)}
              />

              <div className="absolute right-0 top-14 z-50 w-52 rounded-xl border border-orange-100 bg-white p-2 shadow-lg">

                <Link
                  href="/admin/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition hover:bg-orange-50 hover:text-orange-600"
                >
                  <User size={18} />
                  My Profile
                </Link>

                <Link
                  href="/admin/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition hover:bg-orange-50 hover:text-orange-600"
                >
                  <Settings size={18} />
                  Settings
                </Link>

                <div className="my-1 border-t border-gray-100" />

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    toast.info("Please use the sidebar Logout button.");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={18} />
                  Logout
                </button>

              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
