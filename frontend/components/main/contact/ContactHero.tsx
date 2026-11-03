"use client";

import { motion } from "framer-motion";

export default function ContactHero() {
  return (
    <section className="bg-[#fffaf7] px-4 py-4 sm:px-6 lg:px-10">
      <div
        className="
          relative
          mx-auto
          max-w-[1450px]
          overflow-hidden
          rounded-[26px]
          border
          border-[#ead8d2]
          bg-[#f7eee9]
        "
      >
        {/* LEFT DECORATION */}

        <div
          className="
            pointer-events-none
            absolute
            -left-[150px]
            -top-[170px]
            h-[350px]
            w-[350px]
            rounded-full
            border
            border-[#dfc8c1]
          "
        />

        {/* RIGHT DECORATION */}

        <div
          className="
            pointer-events-none
            absolute
            -bottom-[190px]
            -right-[100px]
            h-[380px]
            w-[380px]
            rounded-full
            bg-[#ead5cf]/50
          "
        />

        {/* CONTENT */}

        <div
          className="
            relative
            z-10
            flex
            min-h-[310px]
            items-center
            justify-center
            px-6
            py-8
            text-center

            sm:px-10
            lg:px-16
            lg:py-9
          "
        >
          <div className="mx-auto max-w-[800px]">
            {/* SMALL TITLE */}

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[3px]
                text-[#9a1e2f]
                sm:text-[10px]
              "
            >
              Contact Alibros Bakery
            </motion.p>

            {/* HEADING */}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.1,
              }}
              className="
                mt-3
                font-serif
                text-[34px]
                font-medium
                leading-[1.05]
                tracking-[-1px]
                text-[#281a17]

                sm:text-[42px]
                lg:text-[48px]
              "
            >
              We&apos;d Love to{" "}

              <span className="italic text-[#9a1e2f]">
                Hear From You
              </span>
            </motion.h1>

            {/* LINE */}

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 55 }}
              transition={{
                duration: 0.7,
                delay: 0.3,
              }}
              className="
                mx-auto
                mt-4
                h-[2px]
                bg-[#9a1e2f]
              "
            />

            {/* DESCRIPTION */}

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.35,
              }}
              className="
                mx-auto
                mt-4
                max-w-[650px]
                text-[11px]
                leading-[1.8]
                text-[#75615b]

                sm:text-[12px]
                lg:text-[13px]
              "
            >
              Have a question about our cakes, bakery treats
              or custom orders? Get in touch with Alibros
              Bakery and we&apos;ll be happy to help.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}