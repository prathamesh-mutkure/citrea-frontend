import { Sidebar } from "@/components/Sidebar";
import "./globals.css";
import { Inter } from "next/font/google";

import { WalletConnect } from "@/components/WalletConnect";
import { Bell, Settings } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DeFi Super App",
  description: "Your all-in-one DeFi platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
