"use client";

import { motion } from "framer-motion";
import {
  Users,
  Star,
  PackageCheck,
  Heart,
} from "lucide-react";

const stats = [
  {
    id: 1,
    value: "250+",
    label: "Happy Customers",
    icon: Users,
  },
  {
    id: 2,
    value: "4.9",
    label: "Average Rating",
    icon: Star,
  },
  {
    id: 3,
    value: "500+",
    label: "Orders Delivered",
    icon: PackageCheck,
  },
  {
    id: 4,
    value: "100%",
    label: "Quality Assured",
    icon: Heart,
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
    y: 40,
    scale: 0.95,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.55,
      ease: "easeOut" as const,
    },
  },
};

export default function WhyChooseUs() {
  return (
    <section className="overflow-hidden bg-[#fff9f6] py-6 lg:py-6">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">

        {/* =====================================
            SECTION HEADING
        ====================================== */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="mx-auto mb-12 max-w-[650px] text-center"
        >
          {/* Small heading */}
          <p
            className="
              mb-3
              text-[10px]
              font-bold
              uppercase
              tracking-[3px]
              text-[#9a1e2f]
            "
          >
            Our Promise
          </p>

          {/* Main Heading */}
          <h2
            className="
              font-serif
              text-[34px]
              font-semibold
              leading-tight
              tracking-[-1px]
              text-[#251b18]
              sm:text-[40px]
              lg:text-[46px]
            "
          >
            Why Customers{" "}
            <span className="italic text-[#9a1e2f]">
              Love Us
            </span>
          </h2>

          {/* Description */}
          <p
            className="
              mx-auto
              mt-4
              max-w-[520px]
              text-[13px]
              leading-6
              text-[#786a65]
              sm:text-[14px]
            "
          >
            Freshly baked treats, thoughtful service and beautiful
            celebrations — made with care for every customer.
          </p>
        </motion.div>

        {/* =====================================
            STATS
        ====================================== */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          className="
            grid
            grid-cols-2
            gap-4
            md:grid-cols-4
            lg:gap-5
          "
        >
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.id}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[22px]
                  border
                  border-[#eee2dd]
                  bg-white
                  px-4
                  py-7
                  text-center
                  shadow-[0_8px_30px_rgba(75,35,35,0.06)]
                  transition-shadow
                  duration-300
                  hover:shadow-[0_18px_45px_rgba(75,35,35,0.12)]
                  sm:px-5
                  sm:py-8
                "
              >
                {/* Background decoration */}
                <div
                  className="
                    absolute
                    -right-8
                    -top-8
                    h-24
                    w-24
                    rounded-full
                    bg-[#fbeaec]
                    opacity-0
                    transition-all
                    duration-500
                    group-hover:scale-[2.5]
                    group-hover:opacity-70
                  "
                />

                {/* Content */}
                <div className="relative z-10">

                  {/* Icon */}
                  <motion.div
                    whileHover={{
                      rotate: -8,
                      scale: 1.1,
                    }}
                    className="
                      mx-auto
                      flex
                      h-[50px]
                      w-[50px]
                      items-center
                      justify-center
                      rounded-[15px]
                      bg-[#fbeaec]
                      text-[#98182c]
                      transition-all
                      duration-300
                      group-hover:bg-[#98182c]
                      group-hover:text-white
                    "
                  >
                    <Icon
                      size={21}
                      strokeWidth={1.7}
                    />
                  </motion.div>

                  {/* Number */}
                  <h3
                    className="
                      mt-5
                      font-serif
                      text-[27px]
                      font-bold
                      leading-none
                      text-[#271c19]
                      sm:text-[31px]
                    "
                  >
                    {stat.value}
                  </h3>

                  {/* Label */}
                  <p
                    className="
                      mt-2
                      text-[10px]
                      font-medium
                      text-[#7d6e69]
                      sm:text-[11px]
                    "
                  >
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* =====================================
            BOTTOM TEXT
        ====================================== */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.35,
            duration: 0.6,
          }}
          className="
            mx-auto
            mt-10
            flex
            max-w-[700px]
            items-center
            justify-center
            gap-2
            text-center
          "
        >
          <Heart
            size={14}
            fill="#98182c"
            className="shrink-0 text-[#98182c]"
          />

          <p className="text-[12px] text-[#82736e]">
            Every order is prepared with the same love and care we
            would give to our own family.
          </p>
        </motion.div>
      </div>
    </section>
  );
}