"use client";

import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function OrderReviewPage() {

  const {
    cart,
    increaseQty,
    decreaseQty,
  } = useCart();

  const router = useRouter();

  const [note, setNote] = useState("");
  const [tableInfo, setTableInfo] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // RESTORE TABLE
  useEffect(() => {

    const savedTable =
      sessionStorage.getItem("tableInfo");

    if (savedTable) {
      try {
        setTableInfo(JSON.parse(savedTable));
      } catch (err) {
        console.log(err);
      }
    }

    setTimeout(() => {
      setLoading(false);
    }, 100);

  }, []);

  // EMPTY CART REDIRECT
  useEffect(() => {

    if (!loading && cart.length === 0) {

      const table =
        sessionStorage.getItem("tableInfo");

      if (table) {

        const parsed = JSON.parse(table);

        if (parsed?.number) {
          router.replace(
            `/quicktable/${parsed.number}`
          );
          return;
        }
      }

      router.replace("/");
    }

  }, [loading, cart, router]);

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-yellow-300">
        Loading...
      </div>
    );
  }

  // TOTALS
  const totalQty = cart.reduce(
    (s, i) => s + i.qty,
    0
  );

  const totalPrice = cart.reduce(
    (s, i) => s + i.qty * i.price,
    0
  );

  // PLACE ORDER
  async function placeOrder() {

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {

      const tableLabel =
        tableInfo?.name ||
        `Table ${tableInfo?.number || "?"}`;

      const orderData = {

        table: tableLabel,
        tableNumber: tableInfo?.number || null,

        items: cart.map((item) => ({
          _id: item._id,
          name: item.name,
          image: item.image,
          qty: item.qty,
          price: item.price,
        })),

        totalQty,
        totalPrice,

        note,

        status: "pending",

        createdAt: new Date(),
      };

      // SAVE ORDER
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      // SUCCESS
      if (data.success) {

        // SAVE LAST ORDER
        localStorage.setItem(
          "latestOrder",
          JSON.stringify({
            ...orderData,
            _id: data.order._id,
          })
        );

        // ORDER COMPLETE FLAG
        sessionStorage.setItem(
          "orderCompleted",
          "true"
        );

        // VIBRATION
        if (navigator.vibrate) {
          navigator.vibrate(100);
        }

        // FAST REDIRECT
        router.replace("/order-success");

      } else {

        setIsSubmitting(false);

        alert("Failed to place order.");
      }

    } catch (err) {

      console.log(err);

      setIsSubmitting(false);

      alert("Network error.");

    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white px-4 pt-5 pb-32">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-extrabold tracking-tight text-yellow-400">
          Review Order
        </h1>

     <p className="mt-2 text-sm text-yellow-200/80 leading-relaxed">
  Review your selected items and tap
  <span className="font-bold text-yellow-400">
    {" "}Send Order To Kitchen
  </span>
</p>

        {tableInfo && (
          <div className="mt-3">
            <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/40 bg-yellow-400/10 px-4 py-1.5 text-xs font-bold text-yellow-300 shadow-[0_0_12px_rgba(255,199,0,0.15)]">
              🪑{" "}
              {tableInfo.name ||
                `Table ${tableInfo.number}`}
            </span>
          </div>
        )}

      </div>

      {/* QUICK GUIDE */}
<div className="mt-6 rounded-2xl border border-yellow-500/10 bg-[#151515] px-4 py-3 shadow-[0_0_18px_rgba(255,199,0,0.06)]">

  <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-yellow-100/85">

    <div className="flex items-center gap-1">
      🍽️
      <span>Review Items</span>
    </div>

    <span className="text-yellow-500/50">
      →
    </span>

    <div className="flex items-center gap-1">
      📤
      <span>Send Order</span>
    </div>

    <span className="text-yellow-500/50">
      →
    </span>

    <div className="flex items-center gap-1">
      👨‍🍳
      <span>Kitchen Receives</span>
    </div>

  </div>

</div>

      {/* ITEMS */}
      <div className="mt-8 space-y-4">

        {cart.map((item) => (

          <div
            key={item._id}
            className="flex gap-3 rounded-2xl border border-yellow-500/10 bg-[#151515] p-3 shadow-lg"
          >

            {/* IMAGE */}
            <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-yellow-400/20">

              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />

            </div>

            {/* BODY */}
            <div className="flex flex-1 flex-col">

              {/* TOP */}
              <div className="flex items-start justify-between gap-3">

                <div>

                  <h3 className="line-clamp-1 text-sm font-bold text-white">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    ₹{item.price} each
                  </p>

                </div>

                <p className="text-sm font-extrabold text-yellow-400">
                  ₹{item.qty * item.price}
                </p>

              </div>

              <p className="mb-2 text-[10px] font-medium text-yellow-200/70">
  Adjust quantity if needed
</p>

              {/* QTY */}
              <div className="mt-auto flex items-center gap-2 pt-4">

                <button
                  onClick={() =>
                    decreaseQty(item._id)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#252525] border border-yellow-500/20 text-sm font-bold text-white active:scale-95"
                >
                  -
                </button>

                <span className="w-4 text-center text-sm font-bold text-yellow-300">
                  {item.qty}
                </span>

                <button
                  onClick={() =>
                    increaseQty(item._id)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-sm font-extrabold text-black shadow-[0_0_14px_rgba(255,199,0,0.35)] active:scale-95"
                >
                  +
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

      {/* NOTE */}
      <div className="mt-8">

        <h2 className="text-sm font-semibold text-yellow-300">
          Special Instructions
        </h2>

        <textarea
          placeholder="Add cooking instructions for kitchen..."
          value={note}
          onChange={(e) =>
            setNote(e.target.value)
          }
          className="mt-3 min-h-[100px] w-full rounded-2xl border border-yellow-500/10 bg-[#151515] p-4 text-sm text-white outline-none placeholder:text-gray-500 focus:border-yellow-400/40"
        />

      </div>

      {/* BILL */}
      <div className="mt-8 rounded-2xl border border-yellow-500/10 bg-[#151515] p-5 shadow-lg">

        <div className="flex items-center justify-between text-sm">

          <span className="text-gray-400">
  Total Items
</span>

          <span className="font-bold text-yellow-300">
            {totalQty}
          </span>

        </div>

        <div className="mt-4 flex items-center justify-between text-xl font-extrabold">

          <span className="text-white">
            Total
          </span>

          <span className="text-yellow-400 drop-shadow-[0_0_10px_rgba(255,199,0,0.35)]">
            ₹{totalPrice}
          </span>

        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 z-50 w-full border-t border-yellow-500/20 bg-[#0a0a0a]/95 px-4 py-3 backdrop-blur-xl">

        <div className="flex items-center justify-between">

          {/* TOTAL */}
          <div>

            <p className="text-sm font-bold text-yellow-200">
              {totalQty} items
            </p>

            <p className="text-xs text-gray-400">
              ₹{totalPrice}
            </p>

          </div>
          <div className="mr-4 hidden sm:block">

</div>

          {/* BUTTON */}
          <button
            onClick={placeOrder}
            disabled={isSubmitting}
            className={`rounded-full px-7 py-3 text-sm font-extrabold transition active:scale-95 shadow-[0_0_24px_rgba(255,199,0,0.38)]
              ${
                isSubmitting
                  ? "bg-gray-700 text-gray-300"
                  :"bg-yellow-400 hover:bg-yellow-300 text-black animate-pulse"
              }`}
          >
              <p className="absolute -top-5 right-4 text-[10px] font-medium text-yellow-100/70">
  Tap button to send order
</p>
            {isSubmitting
              ? "Sending To Kitchen..."
              : "Send Order To Kitchen"}
          </button>

        </div>

      </div>

    </div>
  );
}