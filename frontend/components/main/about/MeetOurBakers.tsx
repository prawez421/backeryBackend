"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CakeSlice,
  ChefHat,
  Croissant,
  Sparkles,
  Wheat,
} from "lucide-react";

/* =====================================================
   TEAM DATA
===================================================== */

const bakers = [
  {
    id: 1,
    role: "Head Baker",
    specialty: "Breads & Daily Bakes",
    description:
      "Focused on fresh breads, everyday bakery favourites and consistent baking quality.",
    image:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=900&q=85",
    icon: Wheat,
  },
  {
    id: 2,
    role: "Pastry Chef",
    specialty: "Pastries & Desserts",
    description:
      "Creates delicate pastries, desserts and sweet treats with attention to flavour and presentation.",
    image:
      "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=900&q=85",
    icon: Croissant,
  },
  {
    id: 3,
    role: "Cake Artist",
    specialty: "Custom Cakes",
    description:
      "Turns celebration ideas into beautiful cakes through creative decoration and custom finishing.",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=85",
    icon: CakeSlice,
  },
  {
    id: 4,
    role: "Bakery Chef",
    specialty: "Fresh Bakery",
    description:
      "Supports preparation, baking and finishing to keep every bakery creation fresh and carefully made.",
    image:
      "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=900&q=85",
    icon: ChefHat,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut" as const,
    },
  },
};

export default function MeetOurBakers() {
  return (
    <section className="overflow-hidden bg-[#fffaf7] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">

        {/* =================================================
            HEADING
        ================================================== */}

        <div
          className="
            mb-10
            grid
            grid-cols-1
            gap-6
            lg:grid-cols-[1fr_420px]
            lg:items-end
          "
        >
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-[#f2dedf]
                  text-[#9a1e2f]
                "
              >
                <ChefHat size={14} />
              </span>

              <span
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[2.7px]
                  text-[#9a1e2f]
                  sm:text-[10px]
                "
              >
                Behind The Bakery
              </span>
            </div>

            <h2
              className="
                max-w-[650px]
                font-serif
                text-[35px]
                font-medium
                leading-[1.07]
                tracking-[-1px]
                text-[#281b18]
                sm:text-[43px]
                lg:text-[50px]
              "
            >
              Meet The Hands Behind
              <br />

              <span className="italic text-[#9a1e2f]">
                Every Creation.
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            className="
              max-w-[420px]
              text-[11px]
              leading-6
              text-[#7e6b65]
              sm:text-[12px]
              lg:text-[13px]
            "
          >
            From breads and pastries to detailed celebration
            cakes, different skills come together to create the
            Alibros Bakery experience.
          </motion.p>
        </div>

        {/* =================================================
            EDITORIAL TEAM LAYOUT
        ================================================== */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.08,
          }}
          className="
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            lg:grid-cols-12
          "
        >
          {bakers.map((baker, index) => {
            const Icon = baker.icon;

            const largeCard = index === 0 || index === 3;

            return (
              <motion.article
                key={baker.id}
                variants={cardVariants}
                className={`
                  group
                  relative
                  overflow-hidden
                  rounded-[25px]
                  bg-[#eee3de]

                  ${
                    largeCard
                      ? "lg:col-span-7"
                      : "lg:col-span-5"
                  }
                `}
              >
                {/* =========================================
                    IMAGE
                ========================================== */}

                <div
                  className={`
                    relative
                    overflow-hidden

                    ${
                      largeCard
                        ? "h-[420px] sm:h-[470px] lg:h-[520px]"
                        : "h-[390px] sm:h-[470px] lg:h-[520px]"
                    }
                  `}
                >
                  <Image
                    src={baker.image}
                    alt={`${baker.role} at Alibros Bakery`}
                    fill
                    sizes="
                      (max-width: 640px) 100vw,
                      (max-width: 1024px) 50vw,
                      55vw
                    "
                    className="
                      object-cover
                      object-center
                      transition-transform
                      duration-700
                      ease-out
                      group-hover:scale-[1.05]
                    "
                  />

                  {/* DARK OVERLAY */}

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-[#1c0e0c]/90
                      via-[#1c0e0c]/15
                      to-transparent
                    "
                  />

                  {/* NUMBER */}

                  <div
                    className="
                      absolute
                      left-5
                      top-5
                      flex
                      h-9
                      min-w-9
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/20
                      bg-black/10
                      px-2
                      text-[8px]
                      font-bold
                      text-white
                      backdrop-blur-md
                    "
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* SPECIALTY */}

                  <div
                    className="
                      absolute
                      right-5
                      top-5
                      rounded-full
                      border
                      border-white/20
                      bg-white/10
                      px-3
                      py-2
                      text-[7px]
                      font-bold
                      uppercase
                      tracking-[1.5px]
                      text-white
                      backdrop-blur-md
                    "
                  >
                    {baker.specialty}
                  </div>

                  {/* =========================================
                      BOTTOM CONTENT
                  ========================================== */}

                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      right-0
                      p-5
                      sm:p-6
                      lg:p-7
                    "
                  >
                    {/* ICON */}

                    <div
                      className="
                        mb-4
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/20
                        bg-white/10
                        text-white
                        backdrop-blur-md
                        transition-all
                        duration-300
                        group-hover:bg-[#9a1e2f]
                      "
                    >
                      <Icon
                        size={16}
                        strokeWidth={1.7}
                      />
                    </div>

                    <div className="flex items-end justify-between gap-5">
                      <div>
                        <p
                          className="
                            text-[8px]
                            font-bold
                            uppercase
                            tracking-[2px]
                            text-[#e7aaa7]
                          "
                        >
                          Alibros Bakery
                        </p>

                        <h3
                          className="
                            mt-1
                            font-serif
                            text-[26px]
                            font-semibold
                            text-white
                            sm:text-[29px]
                          "
                        >
                          {baker.role}
                        </h3>

                        <p
                          className="
                            mt-2
                            max-w-[470px]
                            text-[9px]
                            leading-[1.8]
                            text-white/60
                            sm:text-[10px]
                          "
                        >
                          {baker.description}
                        </p>
                      </div>

                      {/* ARROW */}

                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-white/25
                          text-white
                          transition-all
                          duration-300
                          group-hover:rotate-45
                          group-hover:border-white
                          group-hover:bg-white
                          group-hover:text-[#9a1e2f]
                        "
                      >
                        <ArrowUpRight size={15} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        {/* =================================================
            TEAM MESSAGE
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="
            relative
            mt-6
            overflow-hidden
            rounded-[24px]
            border
            border-[#ead9d3]
            bg-[#f7ede9]
          "
        >
          {/* DECORATION */}

          <div
            className="
              pointer-events-none
              absolute
              -right-[80px]
              -top-[90px]
              h-[220px]
              w-[220px]
              rounded-full
              border
              border-[#9a1e2f]/10
            "
          />

          <div
            className="
              relative
              z-10
              flex
              flex-col
              gap-5
              px-6
              py-6
              sm:px-8
              lg:flex-row
              lg:items-center
              lg:justify-between
              lg:px-10
              lg:py-7
            "
          >
            {/* LEFT */}

            <div className="flex items-start gap-4">
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#9a1e2f]
                  text-white
                "
              >
                <Sparkles
                  size={17}
                  strokeWidth={1.7}
                />
              </div>

              <div>
                <p
                  className="
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[2px]
                    text-[#9a1e2f]
                  "
                >
                  One Bakery, Many Skills
                </p>

                <h3
                  className="
                    mt-1
                    max-w-[650px]
                    font-serif
                    text-[20px]
                    font-medium
                    leading-[1.4]
                    text-[#35231f]
                    sm:text-[23px]
                  "
                >
                  Different hands. One shared passion for{" "}

                  <span className="italic text-[#9a1e2f]">
                    better baking.
                  </span>
                </h3>
              </div>
            </div>

            {/* RIGHT */}

            <div
              className="
                flex
                shrink-0
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#ddc8c1]
                  bg-white
                  text-[#9a1e2f]
                "
              >
                <CakeSlice size={15} />
              </div>

              <div>
                <p
                  className="
                    font-serif
                    text-[15px]
                    font-semibold
                    text-[#35231f]
                  "
                >
                  Alibros Bakery
                </p>

                <p
                  className="
                    text-[7px]
                    uppercase
                    tracking-[1.7px]
                    text-[#9b8580]
                  "
                >
                  Crafted Together
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}