"use client";

import Link from "next/link";
import {
  ClipboardList,
  Utensils,
  Layers,
  LayoutGrid,
} from "lucide-react";

import { useEffect, useState } from "react";

export default function AdminDashboard() {

  const [orders, setOrders] =
    useState([]);

  const [items, setItems] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  // LOAD DATA
  useEffect(() => {

    loadOrders();
    loadItems();
    loadCategories();

    // LIVE REFRESH
    const interval =
      setInterval(() => {

        loadOrders();

      }, 3000);

    return () =>
      clearInterval(interval);

  }, []);

  // ORDERS
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

      setOrders(
        data.orders || []
      );

    } catch (err) {
      console.log(err);
    }
  }

  // ITEMS
  async function loadItems() {

    try {

      const res = await fetch(
        "/api/items?count=true"
      );

      const data =
        await res.json();

      setItems(
        new Array(
          data.count || 0
        )
      );

    } catch (err) {
      console.log(err);
    }
  }

  // CATEGORIES
  async function loadCategories() {

    try {

      const res = await fetch(
        "/api/categories"
      );

      const data =
        await res.json();

      setCategories(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {
      console.log(err);
    }
  }

  // CARD
  function Card({
    title,
    count,
    icon: Icon,
    href,
  }) {

    return (
      <Link href={href}>

        <div className="rounded-2xl border border-[#222] bg-[#111] p-5 transition hover:border-[#FFB100] hover:shadow-[0_0_25px_rgba(255,177,0,0.18)]">

          <div className="flex items-center justify-between">

            <p className="text-sm font-medium text-gray-400">
              {title}
            </p>

            <Icon
              size={22}
              className="text-[#FFB100]"
            />

          </div>

          <h2 className="mt-4 text-4xl font-extrabold text-white">
            {count}
          </h2>

          <p className="mt-2 text-xs text-[#FFB100]">
            Open →
          </p>

        </div>

      </Link>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] px-4 py-6 text-white">

      {/* HEADER */}
      <div className="mb-10">

        <h1 className="text-4xl font-extrabold tracking-tight">

          <span className="text-[#FFB100]">
            QuickServe
          </span>{" "}

          Admin
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Lightweight restaurant order management
        </p>

      </div>

      {/* OVERVIEW */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <Card
          title="Pending"
          count={
            orders.filter(
              (o) =>
                o.status ===
                "pending"
            ).length
          }
          icon={ClipboardList}
          href="/admin/orders/pending"
        />

        <Card
          title="Preparing"
          count={
            orders.filter(
              (o) =>
                o.status ===
                "preparing"
            ).length
          }
          icon={Utensils}
          href="/admin/orders/preparing"
        />

        <Card
          title="Ready"
          count={
            orders.filter(
              (o) =>
                o.status ===
                "ready"
            ).length
          }
          icon={LayoutGrid}
          href="/admin/orders/ready"
        />

        <Card
          title="Served"
          count={
            orders.filter(
              (o) =>
                o.status ===
                "served"
            ).length
          }
          icon={Layers}
          href="/admin/orders/completed"
        />

      </div>

      {/* MANAGEMENT */}
      <div className="mt-12">

        <h2 className="mb-4 text-lg font-bold text-white">
          Management
        </h2>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

          <Card
            title="Active Orders"
            count={
              orders.filter(
                (o) =>
                  o.status !==
                  "served"
              ).length
            }
            icon={ClipboardList}
            href="/admin/orders-by-table"
            
          />

          <Card
            title="Products"
            count={items.length}
            icon={Utensils}
            href="/admin/items"
          />

          <Card
            title="Categories"
            count={categories.length}
            icon={Layers}
            href="/admin/categories"
          />

        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="mt-12">

        <h2 className="mb-4 text-lg font-bold text-white">
          Quick Actions
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <Link href="/admin/items">

            <div className="rounded-2xl border border-[#222] bg-[#111] p-5 transition hover:border-[#FFB100] hover:shadow-[0_0_25px_rgba(255,177,0,0.18)]">

              <p className="text-lg font-bold">
                Add Product
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Create new menu item
              </p>

            </div>

          </Link>

          <Link href="/admin/categories">

            <div className="rounded-2xl border border-[#222] bg-[#111] p-5 transition hover:border-[#FFB100] hover:shadow-[0_0_25px_rgba(255,177,0,0.18)]">

              <p className="text-lg font-bold">
                Manage Categories
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Organize restaurant menu
              </p>

            </div>

          </Link>

          <Link href="/admin/orders/pending">

            <div className="rounded-2xl border border-[#222] bg-[#111] p-5 transition hover:border-[#FFB100] hover:shadow-[0_0_25px_rgba(255,177,0,0.18)]">

              <p className="text-lg font-bold">
                Live Orders
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Monitor active customer orders
              </p>

            </div>

          </Link>

          <Link href="/admin/orders/history">

            <div className="rounded-2xl border border-[#222] bg-[#111] p-5 transition hover:border-[#FFB100] hover:shadow-[0_0_25px_rgba(255,177,0,0.18)]">

              <p className="text-lg font-bold">
                Orders History
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Monitor Orders History
              </p>

            </div>

          </Link>

        </div>
      </div>

    </div>
  );
}