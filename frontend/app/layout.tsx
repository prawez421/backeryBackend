import "./globals.css";
import type { Metadata } from "next";
import ToastProvider from "@/components/common/ToastProvider";

export const metadata: Metadata = {
  title: "Cake House",
  description: "Bakery Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
