import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/SessionWrapper";
import CartWrapper from "@/CartWrapper";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "QuickServe | Smart Restaurant Ordering System",

  description:
    "QuickServe is a modern QR-based restaurant ordering system for cafes, restaurants and bakeries.",

  icons: {
    icon: "/icon.png",
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper>
          <CartWrapper>
            {children}
          </CartWrapper>
        </SessionWrapper>
      </body>
    </html>
  );
}
