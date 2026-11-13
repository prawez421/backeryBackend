
"use client";

import {
  ShoppingBag,
  Wallet,
  BadgeCheck,
  Clock,
  TrendingUp,
} from "lucide-react";

interface PurchaseStatsProps {
  totalPurchases: number;
  totalAmount: number;
  totalPaid: number;
  totalDue: number;
}

const formatMoney = (amount: number) => {
  return `₹${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default function PurchaseStats({
  totalPurchases,
  totalAmount,
  totalPaid,
  totalDue,
}: PurchaseStatsProps) {
  const stats = [
    {
      title: "Total Purchases",
      value: totalPurchases.toLocaleString("en-IN"),
      subtitle: "Total purchase records",
      icon: ShoppingBag,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-100",
    },
    {
      title: "Purchase Amount",
      value: formatMoney(totalAmount),
      subtitle: "Total purchase value",
      icon: TrendingUp,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-100",
    },
    {
      title: "Paid Amount",
      value: formatMoney(totalPaid),
      subtitle: "Total amount paid",
      icon: BadgeCheck,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-100",
    },
    {
      title: "Due Amount",
      value: formatMoney(totalDue),
      subtitle: "Remaining payment",
      icon: Clock,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      borderColor: "border-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className={`group rounded-xl border ${stat.borderColor} bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>

                <h3 className="mt-3 break-words text-xl font-bold text-gray-900 sm:text-2xl">
                  {stat.value}
                </h3>

                <p className="mt-2 text-xs text-gray-400">
                  {stat.subtitle}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor} transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon size={23} strokeWidth={2} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
