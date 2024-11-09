"use client";

import { Home, Repeat, RefreshCcw, ArrowLeftRight, Send } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { icon: <Home size={20} />, label: "Home", active: true, href: "/" },
  {
    icon: <ArrowLeftRight size={20} />,
    label: "Stable Swap",
    beta: false,
    href: "/swap",
  },
  { icon: <RefreshCcw size={20} />, label: "DCA", beta: false, href: "/dca" },
  { icon: <Repeat size={20} />, label: "AMM", beta: false, href: "/amm" },
  { icon: <Send size={20} />, label: "Send", href: "/send" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white p-4 shadow-lg">
      <div className="mb-8 flex flex-row gap-4 items-center justify-start">
        <img src="/logo.svg" alt="CitriFi" className="w-12 h-12" />
        <h1 className="text-xl font-bold text-purple-600">CitriFi</h1>
      </div>

      <nav>
        {menuItems.map((item, index) => {
          const href = item.href;

          const active =
            href === "/" ? pathname === href : pathname.startsWith(href);

          return (
            <Link key={index} href={item.href}>
              <div
                key={index}
                className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer
                    ${
                      active
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
          );
        })}
      </nav>
    </div>
  );
}
