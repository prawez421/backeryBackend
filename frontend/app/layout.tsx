
import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-screen bg-[#fff9f6] text-[#211816]">
        {children}
      </body>
    </html>
  );
}
