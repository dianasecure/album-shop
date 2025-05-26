import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AlbumProvider } from "@/context/AlbumContext";
import { ShoppingListProvider } from "@/context/ShoppingListContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Album Shop",
  description: "Your favorite music albums shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AlbumProvider>
          <ShoppingListProvider>
            {children}
          </ShoppingListProvider>
        </AlbumProvider>
      </body>
    </html>
  );
}
