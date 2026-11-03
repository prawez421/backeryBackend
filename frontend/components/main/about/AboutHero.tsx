"use client";

import { motion } from "framer-motion";

export default function AboutHero() {
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
        {/* =========================================
            BACKGROUND DECORATION
        ========================================== */}

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

        {/* =========================================
            CONTENT
        ========================================== */}

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
          <div className="mx-auto max-w-[850px]">
            {/* =====================================
                SMALL TITLE
            ====================================== */}

            <motion.p
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
              }}
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[3px]
                text-[#9a1e2f]

                sm:text-[10px]
              "
            >
              About Alibros Bakery
            </motion.p>

            {/* =====================================
                HEADING
            ====================================== */}

            <motion.h1
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
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
              The Story Behind{" "}

              <span className="italic text-[#9a1e2f]">
                Alibros Bakery
              </span>
            </motion.h1>

            {/* =====================================
                SMALL LINE
            ====================================== */}

            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: 55,
              }}
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

            {/* =====================================
                FIRST DESCRIPTION
            ====================================== */}

            <motion.p
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.35,
              }}
              className="
                mx-auto
                mt-4
                max-w-[720px]
                text-[11px]
                leading-[1.8]
                text-[#75615b]

                sm:text-[12px]
                lg:text-[13px]
              "
            >
              Alibros Bakery is all about creating fresh,
              delicious and beautifully prepared baked goods
              for every occasion. We believe that good food
              brings people together and makes simple moments
              more special.
            </motion.p>

            {/* =====================================
                SECOND DESCRIPTION
            ====================================== */}

            <motion.p
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.45,
              }}
              className="
                mx-auto
                mt-2
                max-w-[680px]
                text-[10px]
                leading-[1.8]
                text-[#8a7670]

                sm:text-[11px]
                lg:text-[12px]
              "
            >
              Every creation at Alibros Bakery is prepared
              with attention to taste, freshness and quality.
              Our goal is simple — to make every bite enjoyable
              and every celebration memorable.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}