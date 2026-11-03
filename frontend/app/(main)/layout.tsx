import type { Metadata } from "next";
import "../layout";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cake House Motera",
  description: "Fresh cakes, pastries and custom celebration cakes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#fff9f6] text-[#211816]">
        <Navbar />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}