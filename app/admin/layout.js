"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

import {
  LayoutDashboard,
  List,
  PlusSquare,
  LayoutGrid,
  Users,
  BarChart3,
  Star,
  Bell,
  Menu,
  X,
  LogOut,
  HomeIcon,
  ClipboardList,
  UtensilsCrossed
} from "lucide-react";

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ------------------------------------------
  // 🔔 FULLY FIXED NOTIFICATION SYSTEM
  // ------------------------------------------
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!session) return;

    checkLatestOrder();

    const interval = setInterval(checkLatestOrder, 2000);
    return () => clearInterval(interval);
  }, [session]);

  async function checkLatestOrder() {

  try {

    const res = await fetch(
      "/api/orders?latest=true",
      {
        cache: "no-store",
      }
    );

    const data =
      await res.json();

    const newest =
      data?.orders?.[0];

    if (!newest) return;

    // ONLY PENDING ORDERS
if (
  newest.status
    ?.toLowerCase() !==
  "pending"
) {
  return;
}
    console.log("LATEST:", newest);

    const orderId =
      newest._id;

    // LAST ORDER ID
    const lastOrderId =
      localStorage.getItem(
        "lastOrderId"
      );

    // FIRST LOAD
    if (!lastOrderId) {

      localStorage.setItem(
        "lastOrderId",
        orderId
      );

      return;
    }

    // NEW ORDER
    if (orderId !== lastOrderId) {

      // SOUND
      const audio =
        new Audio(
          "/notify.mp3"
        );

      audio.volume = 1;

      audio.play().catch(() => {});

      // VIBRATE
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }

      // TOAST
      setToast({
        table:
          newest.table ||
          "Table",
        qty:
          newest.totalQty ||
          newest.items?.length,
      });

      // SAVE NEW ID
      localStorage.setItem(
        "lastOrderId",
        orderId
      );

      // REMOVE TOAST
      setTimeout(() => {

        setToast(null);

      }, 4000);
    }

  } catch (err) {

    console.log(
      "Notification Error:",
      err
    );
  }
}

  // ------------------------------------------
  // ADMIN PROTECTION
  // ------------------------------------------
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.replace("/login");
    }
  }, [session, status]);

  if (status === "loading") return null;
  if (!session || session.user.role !== "admin") return null;

  // ------------------------------------------
  // NAV LINKS (Orders removed)
  // ------------------------------------------
const links = [

  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },

  {
    name: "Live Orders",
    href: "/admin/orders/pending",
    icon: ClipboardList,
  },

  {
    name: "Products",
    href: "/admin/items",
    icon: UtensilsCrossed,
  },

  {
    name: "Categories",
    href: "/admin/categories",
    icon: List,
  },

  {
    name: " Active Tables",
    href: "/admin/orders-by-table",
    icon: LayoutGrid,
  },

  {
    name: "Website",
    href: "/",
    icon: HomeIcon,
  },

];
  const activeClass =
    "flex items-center gap-3 px-3 py-2 rounded-lg bg-[#18181b] text-white font-semibold border border-[#ff6a3d] shadow-[0_0_15px_rgba(255,106,61,0.18)]";

  const inactiveClass =
    "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#18181b] hover:text-white transition";

  const currentTitle =
    links.find((l) => pathname.startsWith(l.href))?.name || "Admin Panel";

  return (
    <div className="bg-[#050505] text-white flex min-h-screen">
      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-black border-r border-[#232323] px-5 py-6 flex flex-col z-40 transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-72"} md:translate-x-0`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden text-white mb-4"
        >
          <X size={26} />
        </button>

        {/* LOGO */}
        <div className="flex items-center gap-3 mb-8">
          <Image
            src="/onebite-2.jpg"
            alt="OneBite"
            width={48}
            height={48}
            className="rounded-full border border-yellow-500"
          />
          <div>
            <p className="text-sm uppercase tracking-widest text-yellow-400/90">
              ONEBITE
            </p>
            <p className="text-xs text-gray-400 -mt-1">Admin Panel</p>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="space-y-1 flex-1 overflow-y-auto pr-1">
          {links.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={isActive ? activeClass : inactiveClass}
              >
                <Icon size={18} />
                <span className="text-sm">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-4 flex items-center gap-3 px-3 py-2 rounded-lg bg-[#18181b]/60 text-gray-300 hover:bg-red-600/30 hover:text-white border border-[#27272a]"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 min-h-screen md:ml-64">
        <header className="h-16 bg-[#050505]/90 border-b border-[#1f1f1f] flex items-center justify-between px-4 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-200"
          >
            <Menu size={26} />
          </button>

          <h2 className="text-lg font-semibold">{currentTitle}</h2>
          <Bell size={22} className="text-gray-300" />
        </header>

        <main className="p-4 sm:p-6">{children}</main>
      </div>

      {/* TOAST */}
{toast && (

  <div className="fixed top-5 right-5 z-[9999]">

    <div className="min-w-[280px] rounded-2xl border border-[#F5B041]/30 bg-[#111111] p-4 shadow-[0_0_25px_rgba(245,176,65,0.18)] backdrop-blur-xl">

      <div className="flex items-start gap-3">

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5B041]/15 text-2xl">

          🔔

        </div>

        <div className="flex-1">

          <p className="text-sm font-bold text-[#F5B041]">
            New Order Received
          </p>

          <p className="mt-1 text-sm text-gray-300">

            {toast.table}
            {" • "}
            {toast.qty} items

          </p>

        </div>

      </div>

    </div>

  </div>
)}

 
    </div>
  );
}
