
import {
  CheckCircle,
  Clock,
  ShoppingCart,
  Wallet,
} from "lucide-react";

import type { Purchase } from "../page";

interface PurchaseStatsProps {
  purchases: Purchase[];
}

const money = (value: number) =>
  `₹${value.toFixed(2)}`;

export default function PurchaseStats({
  purchases,
}: PurchaseStatsProps) {

  const totalPurchase = purchases.length;

  const paidPurchases = purchases.filter(
    (item) => item.payment_status === "Paid"
  ).length;

  const pendingPayments = purchases.reduce(
    (sum, item) => sum + Number(item.due_amount || 0),
    0
  );

  const purchaseValue = purchases.reduce(
    (sum, item) => sum + Number(item.grand_total || 0),
    0
  );

  const stats = [
    {
      title: "Total Purchases",
      value: String(totalPurchase),
      icon: ShoppingCart,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Paid Purchases",
      value: String(paidPurchases),
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Pending Payments",
      value: money(pendingPayments),
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Purchase Value",
      value: money(purchaseValue),
      icon: Wallet,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">

              <div>
                <p className="text-sm text-gray-500">
                  {stat.title}
                </p>

                <h2 className="text-xl font-bold text-gray-800 mt-2">
                  {stat.value}
                </h2>
              </div>

              <div className={`p-3 rounded-xl ${stat.color}`}>
                <Icon size={22} />
              </div>

            </div>
          </div>
        );
      })}

    </div>
  );
}
