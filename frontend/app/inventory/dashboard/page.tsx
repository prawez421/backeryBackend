"use client";

import { useState } from "react";
import { toast } from "sonner";

const stats = [
  {
    title: "Total Revenue",
    value: "₹1,24,580",
    change: "+12.5%",
    description: "Compared to last month",
  },
  {
    title: "Total Orders",
    value: "856",
    change: "+8.2%",
    description: "Compared to last month",
  },
  {
    title: "Total Products",
    value: "124",
    change: "+4.6%",
    description: "Products in inventory",
  },
  {
    title: "Total Customers",
    value: "2,450",
    change: "+15.3%",
    description: "Registered customers",
  },
];

const recentOrders = [
  {
    id: "#ORD-1024",
    customer: "Aarav Sharma",
    product: "Chocolate Truffle Cake",
    date: "04 Nov 2026",
    amount: "₹1,250",
    status: "Completed",
  },
  {
    id: "#ORD-1023",
    customer: "Priya Singh",
    product: "Red Velvet Cake",
    date: "04 Nov 2026",
    amount: "₹950",
    status: "Processing",
  },
  {
    id: "#ORD-1022",
    customer: "Rahul Kumar",
    product: "Black Forest Cake",
    date: "03 Nov 2026",
    amount: "₹750",
    status: "Pending",
  },
  {
    id: "#ORD-1021",
    customer: "Ananya Gupta",
    product: "Vanilla Cupcakes",
    date: "03 Nov 2026",
    amount: "₹450",
    status: "Completed",
  },
  {
    id: "#ORD-1020",
    customer: "Rohan Verma",
    product: "Butterscotch Cake",
    date: "02 Nov 2026",
    amount: "₹1,100",
    status: "Processing",
  },
];

const weeklySales = [
  { day: "Mon", amount: 45 },
  { day: "Tue", amount: 65 },
  { day: "Wed", amount: 40 },
  { day: "Thu", amount: 80 },
  { day: "Fri", amount: 55 },
  { day: "Sat", amount: 95 },
  { day: "Sun", amount: 70 },
];

const topProducts = [
  {
    name: "Chocolate Truffle Cake",
    category: "Cakes",
    sold: 245,
    revenue: "₹1,22,500",
  },
  {
    name: "Red Velvet Cake",
    category: "Cakes",
    sold: 180,
    revenue: "₹90,000",
  },
  {
    name: "Vanilla Cupcakes",
    category: "Cupcakes",
    sold: 156,
    revenue: "₹31,200",
  },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Completed: "bg-green-100 text-green-700",
    Processing: "bg-blue-100 text-blue-700",
    Pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

export default function DashboardPage() {
  const [period, setPeriod] = useState("This Week");

  const handleAddProduct = () => {
    toast.info("Add New Product page is not connected yet.");
  };

  const handleViewOrders = () => {
    toast.info("View All Orders page is not connected yet.");
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-gray-500">
            Welcome back, Admin!
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-800">
            Bakery Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your bakery today.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddProduct}
          className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          + Add New Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">
              {stat.title}
            </p>

            <div className="mt-3 flex items-center justify-between gap-2">
              <h2 className="text-2xl font-bold text-gray-800">
                {stat.value}
              </h2>

              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">
                {stat.change}
              </span>
            </div>

            <p className="mt-3 text-xs text-gray-400">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Sales Chart + Orders Summary */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Sales Chart */}
        <div className="rounded-2xl border border-orange-100 bg-white p-5 xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Sales Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your bakery sales performance
              </p>
            </div>

            <select
              value={period}
              onChange={(e) => {
                setPeriod(e.target.value);
                toast.success(`Showing ${e.target.value} sales.`);
              }}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400"
            >
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="mt-8 flex h-64 items-end justify-around gap-3 border-b border-gray-100 pb-2">
            {weeklySales.map((item) => (
              <div
                key={item.day}
                className="flex h-full flex-1 flex-col items-center justify-end gap-3"
              >
                <div className="flex w-full flex-1 items-end justify-center">
                  <div
                    className="w-full max-w-[48px] rounded-t-lg bg-orange-400 transition hover:bg-orange-500"
                    style={{ height: `${item.amount}%` }}
                    title={`${item.day}: ${item.amount}%`}
                  />
                </div>

                <span className="text-xs text-gray-500">
                  {item.day}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Sales
              </p>

              <p className="mt-1 text-xl font-bold text-gray-800">
                ₹48,250
              </p>
            </div>

            <p className="text-sm font-medium text-green-600">
              +10.8% this week
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="rounded-2xl border border-orange-100 bg-white p-5">
          <h2 className="text-lg font-bold text-gray-800">
            Order Summary
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Current order status
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600">Completed</span>
                <span className="font-semibold text-gray-800">65%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-[65%] rounded-full bg-green-500" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600">Processing</span>
                <span className="font-semibold text-gray-800">25%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-[25%] rounded-full bg-blue-500" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold text-gray-800">10%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-[10%] rounded-full bg-yellow-500" />
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl bg-orange-50 p-4">
            <p className="text-sm text-orange-700">
              Total Orders
            </p>

            <p className="mt-1 text-3xl font-bold text-orange-600">
              856
            </p>

            <p className="mt-1 text-xs text-orange-600">
              Orders received this month
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Recent Orders
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest orders from your customers
            </p>
          </div>

          <button
            type="button"
            onClick={handleViewOrders}
            className="text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            View All Orders →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-orange-50">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Order ID
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Customer
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Product
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Date
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Amount
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="transition hover:bg-orange-50/40"
                >
                  <td className="px-5 py-4 text-sm font-semibold text-orange-600">
                    {order.id}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-700">
                    {order.customer}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {order.product}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-500">
                    {order.date}
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                    {order.amount}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products */}
      <div className="rounded-2xl border border-orange-100 bg-white p-5">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-800">
            Best Selling Products
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your most popular bakery products
          </p>
        </div>

        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div
              key={product.name}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 p-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 font-bold text-orange-600">
                  {index + 1}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {product.category} · {product.sold} sold
                  </p>
                </div>
              </div>

              <p className="text-sm font-bold text-gray-800">
                {product.revenue}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
