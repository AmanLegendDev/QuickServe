"use client";

import { useEffect } from "react";

export default function TablePage({ params }) {

  useEffect(() => {

    async function openMenu() {

      console.log("STEP 1");

      try {

        const res = await fetch(`/api/tables/${params.id}`);

        console.log("STEP 2");

        const data = await res.json();

        console.log("TABLE DATA:", data);

        sessionStorage.setItem(
          "tableInfo",
          JSON.stringify({
            id: data.table._id,
            number: data.table.number,
            name: data.table.name,
          })
        );

        console.log("STEP 3");

        const categoryRes = await fetch("/api/categories");

        console.log("STEP 4");

        const categoryData = await categoryRes.json();

        console.log("CATEGORY DATA:", categoryData);

        const firstCategoryId = categoryData[0]._id;

        console.log("STEP 5", firstCategoryId);

        window.location.href = `/menu/${firstCategoryId}`;

      } catch (err) {
        console.log("ERROR:", err);
      }

    }

    openMenu();

  }, [params.tableId]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      Opening Menu...
    </div>
  );
}