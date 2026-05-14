"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function MenuClient({
  categories,
  items,
  activeCategoryId,
  tableInfo,
}) {
  const router = useRouter();
  const tabsRef = useRef(null);

  const { cart, addToCart, increaseQty, decreaseQty } = useCart();

  const [liveCategories] = useState(categories);
  const [liveItems] = useState(items);

  // INSTANT CATEGORY SWITCH
  const [activeCat, setActiveCat] = useState(
    activeCategoryId || categories[0]?._id
  );

  const [recentOrder, setRecentOrder] = useState(null);
  const [localTableInfo, setLocalTableInfo] = useState(tableInfo);
  const [toast, setToast] = useState(null);

  // CLEAR AFTER ORDER
  useEffect(() => {
    const done = sessionStorage.getItem("orderCompleted");

    if (done) {
      localStorage.removeItem("cart");
      sessionStorage.removeItem("cart");
      sessionStorage.removeItem("selectedItems");
      sessionStorage.removeItem("orderCompleted");
    }
  }, []);

  // SAVE TABLE INFO
  useEffect(() => {
    if (localTableInfo) {
      sessionStorage.setItem(
        "tableInfo",
        JSON.stringify(localTableInfo)
      );
    }
  }, [localTableInfo]);

  // RESTORE TABLE INFO
  useEffect(() => {
    const savedTable = sessionStorage.getItem("tableInfo");

    if (savedTable) {
      try {
        setLocalTableInfo(JSON.parse(savedTable));
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  // LAST ORDER
  useEffect(() => {
    const saved = localStorage.getItem("latestOrder");

    if (saved) {
      setRecentOrder(JSON.parse(saved));
    }
  }, []);

  // KEEP TAB SCROLL
  useEffect(() => {
    const saved = sessionStorage.getItem("tabsScroll");

    if (saved && tabsRef.current) {
      tabsRef.current.scrollLeft = Number(saved);
    }
  }, []);

  // CATEGORY COUNT
  const getCategoryCount = (catId) => {
    return cart
      .filter(
        (item) =>
          String(item.category) === String(catId) ||
          String(item.category?._id) === String(catId)
      )
      .reduce((sum, item) => sum + item.qty, 0);
  };

  // TOTALS
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);

  const totalPrice = cart.reduce(
    (s, i) => s + i.qty * i.price,
    0
  );

  // TABLE LABEL
  const tableLabel =
    localTableInfo?.name ||
    (localTableInfo?.number
      ? `Table ${localTableInfo.number}`
      : null);

  // ACTIVE CATEGORY
  const visibleCategories = liveCategories.filter(
    (cat) => String(cat._id) === String(activeCat)
  );

  // QTY HELPER
  const getCartQty = (itemId) => {
    const inCart = cart.find((c) => c._id === itemId);
    return inCart?.qty ?? 0;
  };

  // PREMIUM UX TOAST
const showToast = (message) => {

  setToast(message);

  setTimeout(() => {
    setToast(null);
  }, 2000);
};

  // STOCK HELPER
  const canAddMore = (item) => {
    if (item.outOfStock) return false;

    if (typeof item.stock !== "number") return true;

    const current = getCartQty(item._id);

    return current < Number(item.stock);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white pb-28">

      {/* HEADER */}
      <div className="sticky top-0 z-30 bg-[#0d0d0d]/95 backdrop-blur-xl border-b border-yellow-500/10 px-4 pt-4 pb-3">

        {/* TOP */}
        <div className="flex items-center gap-3">

          {/* LOGO */}
      <div className="relative h-14 w-32 overflow-hidden rounded-2xl border border-[#F5B041]/40 bg-[#111111] px-2 shadow-[0_0_25px_rgba(245,176,65,0.18)]">

  <Image
    src="/onebite.jpeg"
    alt="QuickServe"
    fill
    className="object-contain p-2"
    sizes="160px"
    priority
  />

</div>
          {/* TITLE */}
          <div className="flex-1">

            <h1 className="text-2xl font-extrabold tracking-tight">
              <span className="text-yellow-400 drop-shadow-[0_0_12px_rgba(255,199,0,0.35)]">
                QuickServe
              </span>
            </h1>

            {tableLabel && (
              <div className="mt-1">
                <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/40 bg-yellow-400/10 px-3 py-1 text-[11px] font-bold text-yellow-300 shadow-[0_0_10px_rgba(255,199,0,0.12)]">
                  🪑 {tableLabel}
                </span>
              </div>
            )}

          </div>
        </div>

        {/* QUICK GUIDE */}
<div className="mt-4 overflow-hidden rounded-2xl border border-yellow-500/15 bg-[#151515] px-3 py-2 shadow-[0_0_18px_rgba(255,199,0,0.06)]">

  <div className="flex items-center gap-2 text-[11px] font-semibold text-yellow-100/90 overflow-x-auto no-scrollbar">

    <span className="whitespace-nowrap">
      📱 Scan QR
    </span>

    <span className="text-yellow-500/60">
      →
    </span>

    <span className="whitespace-nowrap">
      ➕ Add Items
    </span>

    <span className="text-yellow-500/60">
      →
    </span>

    <span className="whitespace-nowrap">
      🛒 View Cart
    </span>

    <span className="text-yellow-500/60">
      →
    </span>

    <span className="whitespace-nowrap">
      🍽️ Send Order
    </span>

  </div>

</div>

        {/* CATEGORY TABS */}
        <div
          ref={tabsRef}
          className="mt-4 flex gap-2 overflow-x-auto no-scrollbar"
        >
          {liveCategories.map((cat) => {

            const isActive =
              String(activeCat) === String(cat._id);

            const count = getCategoryCount(cat._id);

            return (
              <motion.button
                key={cat._id}
                whileTap={{ scale: 0.95 }}
                onClick={() => {

                  const savedScroll =
                    tabsRef.current?.scrollLeft || 0;

                  sessionStorage.setItem(
                    "tabsScroll",
                    savedScroll
                  );

                  setActiveCat(cat._id);
                }}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all border
                  ${
                    isActive
                      ? "bg-yellow-400 text-black border-yellow-400 shadow-[0_0_18px_rgba(255,199,0,0.4)]"
                      : "bg-[#1A1A1A] text-gray-300 border-[#2A2A2A]"
                  }`}
              >
                {cat.name}

                {count > 0 && (
                  <span className="ml-1 opacity-90">
                    ({count})
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 pt-4">

        {/* LAST ORDER */}
        {recentOrder && (
          <div className="mb-5 rounded-2xl border border-yellow-500/20 bg-[#151515] px-4 py-3 shadow-lg">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-bold text-yellow-300">
                  Last Order
                </p>

                <p className="mt-0.5 text-[11px] text-gray-400">
                  View your latest order summary
                </p>
              </div>

              <button
                onClick={() =>
                  router.push("/order-success")
                }
                className="rounded-full bg-yellow-400 px-4 py-2 text-xs font-extrabold text-black shadow-[0_0_14px_rgba(255,199,0,0.3)]"
              >
                View
              </button>

            </div>
          </div>
        )}

        {/* ITEMS */}
        <div className="space-y-10">

          {visibleCategories.map((cat) => (

            <section key={cat._id}>

              {/* TITLE */}
              <div className="mb-4 flex items-center justify-between">

                <h2 className="text-xl font-bold text-yellow-300">
                  {cat.name}
                </h2>

              </div>

              {/* GRID */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
              >

                {liveItems
                  .filter(
                    (item) =>
                      (String(item.category) ===
                        String(cat._id) ||
                        String(item.category?._id) ===
                          String(cat._id)) &&
                      !item.outOfStock
                  )
                  .map((item) => {

                    const qty =
                      cart.find(
                        (c) => c._id === item._id
                      )?.qty ?? 0;

                    const addDisabled =
                      !canAddMore(item);

                    // STOCK
                    let stockBadge = null;

                    if (
                      typeof item.stock === "number" &&
                      item.stock <=
                        (item.lowStockLimit || 5)
                    ) {
                      stockBadge = (
                        <span className="text-[10px] font-semibold text-yellow-400">
                          Only {item.stock} left
                        </span>
                      );
                    } else {
                      stockBadge = (
                        <span className="text-[10px] font-semibold text-green-400">
                          In stock
                        </span>
                      );
                    }

                    return (
                      <motion.div
                        key={item._id}
                        whileTap={{ scale: 0.98 }}
                        className="overflow-hidden rounded-2xl border border-yellow-500/10 bg-[#151515] shadow-lg"
                      >

                        {/* IMAGE */}
                        <div className="relative h-28 sm:h-36 w-full overflow-hidden">

                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            priority
                            className="object-cover"
                          />

                        </div>

                        {/* BODY */}
                        <div className="p-3">

                          {/* NAME */}
                          <h3 className="line-clamp-1 h-5 text-sm font-bold text-white">
                            {item.name}
                          </h3>

                          {/* DESC */}
                          <p className="mt-1 line-clamp-1 text-[11px] text-gray-400">
                            {item.description}
                          </p>

                          {/* STOCK */}
                          <div className="mt-2">
                            {stockBadge}
                          </div>

                          {/* UX HELPER */}
{qty === 0 && (
  <p className="mt-3 text-[10px] font-medium text-yellow-200/75">
    Tap + to add item
  </p>
)}

                          {/* PRICE + QTY */}
                          <div className="mt-4 flex items-center justify-between">

                            <p className="text-sm font-extrabold text-yellow-400">
                              ₹{item.price}
                            </p>

                            <div className="flex items-center gap-2">

                              {/* MINUS */}
                              <button
                                onClick={() =>
                                  decreaseQty(item._id)
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#252525] border border-yellow-500/10 text-sm font-bold text-white active:scale-95"
                              >
                                -
                              </button>

                              {/* QTY */}
                              <span className="w-4 text-center text-sm font-bold text-yellow-300">
                                {qty}
                              </span>

                              {/* PLUS */}
                              <button
                                onClick={() => {

                                  if (addDisabled)
                                    return;

                                  if (qty === 0) {

  addToCart(item);

  showToast(
    `${item.name} added • View Cart to continue`
  );

} else {

  increaseQty(item._id);

  showToast(
    `${item.name} quantity updated`
  );
}
                                }}
                                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold active:scale-95
                                  ${
                                    addDisabled
                                      ? "bg-gray-700 text-gray-400"
                                      : "bg-yellow-400 text-black shadow-[0_0_14px_rgba(255,199,0,0.3)]"
                                  }`}
                              >
                                +
                              </button>

                            </div>
                          </div>

                        </div>
                      </motion.div>
                    );
                  })}

              </motion.div>

            </section>
          ))}

        </div>
      </div>

      {/* CART BAR */}
      {totalQty > 0 && (

        <div className="fixed bottom-0 left-0 z-40 w-full border-t border-yellow-500/20 bg-[#090909]/95 px-4 py-3 backdrop-blur-xl">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-bold text-yellow-200">
                {totalQty} items
              </p>

             <p className="text-xs text-gray-400">
  Ready to send your order
</p>

            </div>

            <button
              onClick={() =>
                router.push("/order-review")
              }
className="rounded-full bg-yellow-400 px-6 py-3 text-sm font-extrabold text-black shadow-[0_0_22px_rgba(255,199,0,0.45)] active:scale-95 animate-pulse"            >
              View Cart & Send Order
            </button>

          </div>

        </div>
      )}
      {/* PREMIUM UX TOAST */}
{toast && (

  <div className="fixed bottom-24 left-1/2 z-[999] -translate-x-1/2 px-4">

    <div className="rounded-2xl border border-yellow-500/20 bg-[#111111]/95 px-5 py-3 shadow-[0_0_30px_rgba(255,199,0,0.18)] backdrop-blur-xl">

      <p className="text-center text-xs font-semibold text-yellow-100 whitespace-nowrap">
        {toast}
      </p>

    </div>

  </div>
)}

    </div>
    
  );
}