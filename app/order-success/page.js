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
          className="w-32 h-32 object-cover rounded-full border-2 border-[#FFB100] shadow-[0_0_25px_rgba(255,177,0,0.5)]"
        />

      </motion.div>

      {/* STATUS */}
      <div className="text-center mt-6">

        <h1 className="text-3xl font-extrabold text-yellow-400">
          Order Confirmed 🎉
        </h1>

        <p className="mt-2 text-sm font-semibold text-yellow-300">
          {statusText[liveStatus]}
        </p>

        {/* PROGRESS */}
        <div className="flex justify-center gap-4 mt-5">

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
                      ? "bg-yellow-400 shadow-[0_0_10px_rgba(255,199,0,0.8)]"
                      : "bg-gray-600"
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
        className="bg-[#111] rounded-2xl border border-[#222] shadow-xl p-6 mt-10"
      >

        <h2 className="text-xl font-bold mb-5 text-yellow-400">
          Order Summary
        </h2>

        {/* ITEMS */}
        <div className="space-y-4">

          {order.items.map((item) => (

            <div
              key={item._id}
              className="flex justify-between bg-[#1a1a1a] p-4 rounded-xl border border-[#333]"
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
              Total
            </span>

            <span className="font-bold text-yellow-400 text-lg">
              ₹
              {order.finalPrice ||
                order.totalPrice}
            </span>

          </div>

        </div>

        {/* TABLE */}
        <div className="mt-6 bg-yellow-400 text-black p-3 rounded-lg text-center font-extrabold text-lg">

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
          © QuickServe
        </p>

      </div>

      {/* BUTTON */}
      <div className="mt-8 text-center">

        <button
          onClick={() =>
            (window.location.href =
              "/menu")
          }
          className="bg-yellow-400 hover:bg-yellow-300 px-10 py-3 rounded-full text-lg font-bold text-black shadow-[0_0_20px_rgba(255,177,0,0.4)] active:scale-95"
        >
          Back to Menu
        </button>

      </div>

    </div>
  );
}