"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function QuickTablePage({ params }) {

  useEffect(() => {

    const tableNumber =
      params.number;

    sessionStorage.setItem(
      "tableInfo",
      JSON.stringify({
        number: tableNumber,
        name: `Table ${tableNumber}`,
      })
    );

    const timer =
      setTimeout(() => {

        window.location.href =
          "/menu";

      }, 1800);

    return () =>
      clearTimeout(timer);

  }, [params.number]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#111111] px-6 text-white">

      {/* GLOW */}
      <div className="absolute top-[-120px] h-[300px] w-[300px] rounded-full bg-yellow-400/10 blur-3xl" />

      <div className="absolute bottom-[-120px] right-[-80px] h-[260px] w-[260px] rounded-full bg-yellow-300/10 blur-3xl" />

      {/* CONTENT */}
      <motion.div

        initial={{
          opacity: 0,
          scale: 0.9,
          y: 20,
        }}

        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}

        transition={{
          duration: 0.5,
        }}

        className="relative z-10 w-full max-w-sm rounded-[32px] border border-yellow-500/20 bg-[#161616]/90 p-8 text-center shadow-[0_0_50px_rgba(255,199,0,0.08)] backdrop-blur-2xl"
      >

        {/* LOGO */}
        <motion.div

          animate={{
            y: [0, -6, 0],
          }}

          transition={{
            repeat: Infinity,
            duration: 2,
          }}

          className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border border-yellow-400/30 bg-[#0f0f0f] shadow-[0_0_30px_rgba(255,199,0,0.18)]"
        >

          <Image
            src="/onebite.jpeg"
            alt="QuickServe"
            fill
            className="object-cover"
            priority
          />

        </motion.div>

        {/* TITLE */}
        <motion.h1

          initial={{
            opacity: 0,
            y: 15,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            delay: 0.2,
          }}

          className="mt-7 text-4xl font-black tracking-tight"
        >

          <span className="text-white">
            Quick
          </span>

          <span className="text-yellow-400 drop-shadow-[0_0_18px_rgba(255,199,0,0.35)]">
            Serve
          </span>

        </motion.h1>

        {/* TABLE */}
        <motion.div

          initial={{
            opacity: 0,
            scale: 0.9,
          }}

          animate={{
            opacity: 1,
            scale: 1,
          }}

          transition={{
            delay: 0.35,
          }}

          className="mt-5 inline-flex items-center rounded-full border border-yellow-500/20 bg-[#0f0f0f] px-5 py-2"
        >

          <span className="text-sm font-bold text-yellow-200">

            Table {params.number}

          </span>

        </motion.div>

        {/* TEXT */}
        <motion.p

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: 1,
          }}

          transition={{
            delay: 0.5,
          }}

          className="mt-6 text-sm leading-relaxed text-gray-400"
        >

          Preparing your premium digital menu experience...

        </motion.p>

        {/* LOADER */}
        <div className="mt-8 flex items-center justify-center">

          <div className="relative">

            <div className="h-14 w-14 rounded-full border-[3px] border-yellow-500/20" />

            <div className="absolute inset-0 h-14 w-14 animate-spin rounded-full border-[3px] border-yellow-400 border-t-transparent shadow-[0_0_18px_rgba(255,199,0,0.25)]" />

          </div>

        </div>

        {/* FOOTER */}
        <motion.div

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: 1,
          }}

          transition={{
            delay: 0.8,
          }}

          className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500"
        >

          <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />

          Fast • Secure • Contactless

        </motion.div>

      </motion.div>

    </div>
  );
}