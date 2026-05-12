"use client";

import { useEffect, useState } from "react";

export default function OrderHistoryPage() {

  const [orders, setOrders] =
    useState([]);

  const [filtered, setFiltered] =
    useState([]);

  const [search, setSearch] =
    useState("");

  // LOAD
  useEffect(() => {

    loadOrders();

  }, []);

  async function loadOrders() {

    try {

      const res = await fetch(
        "/api/orders",
        {
          cache: "no-store",
        }
      );

      const data =
        await res.json();

      const served =
        (data.orders || []).filter(
          (o) =>
            o.status ===
            "served"
        );

      setOrders(served);
      setFiltered(served);

    } catch (err) {
      console.log(err);
    }
  }

  // SEARCH
  useEffect(() => {

    const value =
      search.toLowerCase();

    const filteredOrders =
      orders.filter((order) => {

        const table =
          order.table
            ?.toLowerCase()
            .includes(value);

        const items =
          order.items?.some(
            (item) =>
              item.name
                ?.toLowerCase()
                .includes(value)
          );

        const date =
          new Date(
            order.createdAt
          )
            .toLocaleDateString()
            .includes(value);

        return (
          table ||
          items ||
          date
        );
      });

    setFiltered(
      filteredOrders
    );

  }, [search, orders]);

  return (
    <div className="min-h-screen bg-[#111111] px-4 py-6 text-white">

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-4xl font-extrabold">

          <span className="text-[#F5B041]">
            Order
          </span>{" "}

          History

        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Served customer orders
        </p>

      </div>

      {/* SEARCH */}
      <div className="mb-6">

        <input
          type="text"
          placeholder="Search by table, product or date..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="w-full rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-3 text-sm text-white outline-none focus:border-[#F5B041]"
        />

      </div>

      {/* ORDERS */}
      <div className="space-y-5">

        {filtered.length === 0 && (

          <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-10 text-center">

            <p className="text-gray-400">
              No served orders found
            </p>

          </div>
        )}

        {filtered.map((order) => (

          <div
            key={order._id}
            className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-5"
          >

            {/* TOP */}
            <div className="flex items-start justify-between gap-4">

              <div>

                <h2 className="text-lg font-bold text-white">
                  {order.table}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  {new Date(
                    order.createdAt
                  ).toLocaleString()}
                </p>

              </div>

              <div className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">

                Served

              </div>

            </div>

            {/* ITEMS */}
            <div className="mt-5 space-y-3">

              {order.items?.map(
                (item, index) => (

                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl bg-[#111111] p-3"
                  >

                    <div>

                      <p className="text-sm font-semibold text-white">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Qty: {item.qty}
                      </p>

                    </div>

                    <p className="text-sm font-bold text-[#F5B041]">
                      ₹
                      {item.price *
                        item.qty}
                    </p>

                  </div>
                )
              )}

            </div>

            {/* TOTAL */}
            <div className="mt-5 flex items-center justify-between border-t border-[#2A2A2A] pt-4">

              <p className="text-sm text-gray-400">
                Total Bill
              </p>

              <p className="text-xl font-extrabold text-[#F5B041]">
                ₹
                {order.finalPrice ||
                  order.totalPrice}
              </p>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}