
"use client";

import React from "react";
import {
  Package,
  CheckCircle,
  XCircle,
  Tags,
} from "lucide-react";

interface ProductStatsProps {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  totalBrands: number;
}

export default function ProductStats({
  totalProducts,
  activeProducts,
  inactiveProducts,
  totalBrands,
}: ProductStatsProps) {
  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      iconStyle: "bg-blue-50 text-blue-600",
      borderStyle: "border-blue-100",
    },
    {
      title: "Active Products",
      value: activeProducts,
      icon: CheckCircle,
      iconStyle: "bg-green-50 text-green-600",
      borderStyle: "border-green-100",
    },
    {
      title: "Inactive Products",
      value: inactiveProducts,
      icon: XCircle,
      iconStyle: "bg-red-50 text-red-600",
      borderStyle: "border-red-100",
    },
    {
      title: "Total Brands",
      value: totalBrands,
      icon: Tags,
      iconStyle: "bg-amber-50 text-amber-600",
      borderStyle: "border-amber-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className={`rounded-2xl border ${stat.borderStyle} bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
          >
            <div className="flex items-center justify-between gap-3">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-800">
                  {stat.value.toLocaleString("en-IN")}
                </h2>
              </div>

              <div className={`rounded-xl p-3 ${stat.iconStyle}`}>
                <Icon size={24} />
              </div>

            </div>
          </div>
        );
      })}

    </div>
  );
}
