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
      <body className={inter.className}>
        <div className="flex h-screen bg-purple-50">
          <Sidebar />

          <div className="flex-1 p-6">
            {/* Top Bar */}
            <div className="flex flex-col space-y-4">
              {/* {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )} */}

              <div className="flex justify-between items-center mb-8">
                <WalletConnect />

                <div className="flex gap-4">
                  <button className="p-2 hover:bg-purple-100 rounded-full">
                    <Bell size={20} />
                  </button>
                  <button className="p-2 hover:bg-purple-100 rounded-full">
                    <Settings size={20} />
                  </button>
                </div>
              </div>
            </div>

            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
