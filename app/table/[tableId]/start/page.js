"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";

export default function StartPage() {
  const router = useRouter();
  const { tableId } = useParams();

  useEffect(() => {
    async function startQuickServe() {
      try {
        // Fetch table info
        const res = await fetch(`/api/tables/${tableId}`);
        const data = await res.json();

        if (!data.success) {
          return;
        }

        // Save table session only
        const tableData = {
          id: data.table._id,
          number: data.table.number,
          name: data.table.name,
        };

        sessionStorage.setItem(
          "tableInfo",
          JSON.stringify(tableData)
        );

        // Direct menu open
        router.replace(`/table/${tableId}/menu`);
      } catch (err) {
        console.log(err);
      }
    }

    startQuickServe();
  }, [tableId, router]);

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center text-white">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#F5B041] border-t-transparent rounded-full animate-spin mx-auto"></div>

        <p className="mt-4 text-lg font-medium text-[#FFCC70]">
          Opening Menu...
        </p>
      </div>
    </div>
  );
}