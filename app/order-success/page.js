"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { formatDateTime } from "@/lib/formatDate";
import { useCart } from "@/app/context/CartContext";

export default function OrderSuccessPage() {

  const [order, setOrder] = useState(null);
  const [liveStatus, setLiveStatus] = useState("pending");
  const [cancelled, setCancelled] = useState(false);

  const { clearCart } = useCart();

  // LOAD ORDER
  useEffect(() => {

    const saved =
      localStorage.getItem("latestOrder");

    if (saved) {

      const parsed = JSON.parse(saved);

      setOrder(parsed);

      setLiveStatus(
        parsed.status || "pending"
      );
    }

  }, []);

  // CLEAR CART
  useEffect(() => {

    sessionStorage.setItem(
      "orderCompleted",
      "yes"
    );

    clearCart();

    sessionStorage.removeItem(
      "selectedItems"
    );

  }, []);

  // SUCCESS SOUND
  useEffect(() => {

    const audio = new Audio("/notify.mp3");

    audio.volume = 1;

    audio.play().catch(() => {});

  }, []);

  // LIVE STATUS
  useEffect(() => {

    if (!order?._id) return;

    const interval = setInterval(
      async () => {

        try {

          const res = await fetch(
            `/api/orders/${order._id}`,
            {
              cache: "no-store",
            }
          );

          const data = await res.json();

          const status =
            data?.order?.status;

          if (!status) return;

          setLiveStatus(status);

          if (
            status === "cancelled" ||
            status === "rejected"
          ) {
            setCancelled(true);
          }

        } catch (err) {
          console.log(err);
        }

      },
      3000
    );

    return () =>
      clearInterval(interval);

  }, [order]);

  // LOADING
  if (!order) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] text-white">
        Loading your order...
      </div>
    );
  }

  // STATUS TEXT
  const statusText = {

    pending:
      "Waiting for restaurant to accept…",

    preparing:
      "Your food is being prepared 🔥",

    ready:
      "Your order is ready to be served 😍",

    served:
      "Enjoy your meal! 🍽️",
  };

  const statusSteps = [
    "pending",
    "preparing",
    "ready",
    "served",
  ];

  // CANCEL SCREEN
  if (cancelled) {

    return (
      <div className="min-h-screen bg-[#0d0d0d] px-6 py-10 text-white flex items-center justify-center">

        <motion.div
          initial={{
            scale: 0.8,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          className="bg-[#200] border border-red-600 p-8 rounded-2xl text-center shadow-xl"
        >

          <p className="text-3xl font-extrabold text-red-400 mb-3">
            ❌ Order Cancelled
          </p>

          <p className="text-gray-300 mb-6">
            Your order was cancelled by the restaurant.
          </p>

          <button
            onClick={() =>
              (window.location.href =
                "/menu")
            }
            className="px-8 py-3 bg-red-500 hover:bg-red-400 rounded-full text-white font-bold"
          >
            Back to Menu
          </button>

        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] px-6 py-10 text-white">

      {/* LOGO */}
      <motion.div
        initial={{
          scale: 0,
          rotate: -180,
        }}
        animate={{
          scale: 1,
          rotate: 0,
        }}
        transition={{
          duration: 0.7,
          type: "spring",
        }}
        className="flex justify-center"
      >

        <img
          src="/onebite-2.jpg"
className="w-32 h-32 object-contain bg-[#111] p-2 rounded-full border-2 border-[#FFB100] shadow-[0_0_25px_rgba(255,177,0,0.5)]"        />

      </motion.div>

      {/* STATUS */}
      <div className="text-center mt-6">

        <h1 className="text-3xl font-extrabold text-yellow-400">
          Order Sent Successfully ✅
        </h1>

        <p className="mt-2 text-sm font-semibold text-yellow-300">
          {liveStatus === "pending"
  ? "Your order has been sent to kitchen successfully 🍽️"
  : statusText[liveStatus]}
        </p>

        <div className="mt-4 flex justify-center">

  <div className="rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 shadow-[0_0_18px_rgba(34,197,94,0.12)]">

    <p className="text-xs font-bold text-green-400">
      ✔ Kitchen Will Receive Your Order Instantly
    </p>

  </div>

</div>

        {/* PROGRESS */}
        <div className="flex justify-center gap-5 mt-7">

          {statusSteps.map((step) => {

            const active =
              statusSteps.indexOf(step) <=
              statusSteps.indexOf(
                liveStatus
              );

            return (
              <div
                key={step}
                className="flex flex-col items-center"
              >

                <div
                  className={`w-4 h-4 rounded-full transition-all ${
                    active
  ? "bg-yellow-400 shadow-[0_0_20px_rgba(255,199,0,0.9)] animate-pulse duration-100"
  : "bg-gray-700"
                  }`} 
                />

                <p
                  className={`text-[10px] mt-1 transition capitalize ${
                    active
                      ? "text-yellow-300"
                      : "text-gray-500"
                  }`}
                >
                  {step}
                </p>

              </div>
            );
          })}

        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-yellow-500/10 bg-[#151515] px-4 py-3 text-center shadow-[0_0_18px_rgba(255,199,0,0.05)]">

  <p className="text-xs font-semibold text-yellow-100/85">

    📡 Live Order Status Updates Enabled

  </p>

</div>

      {/* SUMMARY */}
      <motion.div
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="bg-[#111] rounded-3xl border border-yellow-500/10 shadow-[0_0_35px_rgba(255,199,0,0.06)] p-6 mt-10"
      >

        <h2 className="text-xl font-bold mb-5 text-yellow-400">
          Your Order Summary
        </h2>

        {/* ITEMS */}
        <div className="space-y-4">

          {order.items.map((item) => (

            <div
              key={item._id}
              className="flex justify-between bg-[#1a1a1a] p-4 rounded-2xl border border-yellow-500/10"
            >

              <div>

                <p className="font-semibold">
                  {item.name}
                </p>

                <p className="text-sm text-gray-400">
                  {item.qty} × ₹
                  {item.price}
                </p>

              </div>

              <p className="font-extrabold text-[#FFB100]">
                ₹
                {item.qty *
                  item.price}
              </p>

            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="border-t border-gray-700 my-5"></div>

        <div className="space-y-2 text-[15px]">

          <div className="flex justify-between">
<span className="text-gray-400">
  Final Total
</span>

            <span className="font-bold text-yellow-400 text-lg">
              ₹
              {order.finalPrice ||
                order.totalPrice}
            </span>

          </div>

        </div>

        {/* TABLE */}
        <div className="mt-6 rounded-2xl border border-yellow-400/20 bg-yellow-400 px-4 py-4 text-center font-extrabold text-lg text-black shadow-[0_0_25px_rgba(255,199,0,0.25)]">

          Table:{" "}
          {order.table || "—"}

        </div>

        {/* DATE */}
        <p className="text-center text-gray-500 text-xs mt-5">
          {formatDateTime(
            order.createdAt
          )}
        </p>

      </motion.div>

      {/* FOOTER */}
      <div className="mt-12 text-center opacity-70">

        <p className="text-xs">
          Powered by QuickServe Digital Dining
        </p>

      </div>

      {/* BUTTON */}
      <div className="mt-8 text-center">

        <button
          onClick={() =>
            (window.location.href =
              "/menu")
          }
          className="bg-yellow-400 hover:bg-yellow-300 px-10 py-3 rounded-full text-lg font-bold text-black   shadow-[0_0_28px_rgba(255,177,0,0.55)] active:scale-95"
        >
          Order More Items
        </button>

      </div>

    </div>
  );
}