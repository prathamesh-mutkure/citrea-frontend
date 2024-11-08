"use client";

import { Home, Repeat, RefreshCcw, ArrowLeftRight, Send } from "lucide-react";
import Link from "next/link";

const menuItems = [
  { icon: <Home size={20} />, label: "Home", active: true, href: "/" },
  {
    icon: <ArrowLeftRight size={20} />,
    label: "Stable Swap",
    beta: false,
    href: "/swap",
  },
  { icon: <RefreshCcw size={20} />, label: "DCA", beta: true, href: "/dca" },
  { icon: <Repeat size={20} />, label: "DEX", beta: true, href: "/dex" },
  { icon: <Send size={20} />, label: "Send", href: "/send" },
];

export function Sidebar() {
  return (
    <div className="w-64 bg-white p-4 shadow-lg">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-purple-600">Your DeFi App</h1>
      </div>

      <nav>
        {menuItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <div
              key={index}
              className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer
              ${
                item.active
                  ? "bg-purple-100 text-purple-600"
                  : "hover:bg-gray-100"
              }
            `}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
              {item.beta && (
                <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                  Beta
                </span>
              )}
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}
