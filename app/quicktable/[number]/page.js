"use client";

import { useEffect } from "react";

export default function QuickTablePage({ params }) {

  useEffect(() => {

    const tableNumber = params.number;

    sessionStorage.setItem(
      "tableInfo",
      JSON.stringify({
        number: tableNumber,
        name: `Table ${tableNumber}`,
      })
    );

    window.location.href = "/menu";

  }, [params.number]);

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center text-white">

      <div className="text-center">

        <div className="w-12 h-12 border-4 border-[#F5B041] border-t-transparent rounded-full animate-spin mx-auto"></div>

        <p className="mt-4 text-[#FFCC70] font-medium">
          Opening Menu...
        </p>

      </div>

    </div>
  );
}