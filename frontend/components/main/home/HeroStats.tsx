"use client";

import { motion } from "framer-motion";
import {
  CakeSlice,
  Smile,
  Truck,
  Heart,
} from "lucide-react";

const stats = [
  {
    id: 1,
    value: "250+",
    label: "Delicious Items",
    icon: CakeSlice,
  },
  {
    id: 2,
    value: "4.9★",
    label: "Customer Rating",
    icon: Smile,
  },
  {
    id: 3,
    value: "30 mins",
    label: "On-time Delivery",
    icon: Truck,
  },
  {
    id: 4,
    value: "100%",
    label: "Pure & Fresh",
    icon: Heart,
  },
];

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export default function HeroStats() {
  return (
    <section className="relative z-30 bg-[#fff9f6]">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.25,
          }}
          className="
            grid
            grid-cols-2
            overflow-hidden
            rounded-[24px]
            border
            border-[#f0e4df]
            bg-white
            shadow-[0_15px_45px_rgba(92,45,45,0.09)]
            md:grid-cols-4
          "
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.id}
                variants={item}
                whileHover={{
                  y: -5,
                }}
                className={`
                  group
                  relative
                  flex
                  items-center
                  justify-center
                  gap-4
                  px-5
                  py-7
                  transition-colors
                  duration-300
                  hover:bg-[#fff8f5]

                  ${
                    index !== stats.length - 1
                      ? "md:border-r md:border-[#eee3df]"
                      : ""
                  }

                  ${
                    index < 2
                      ? "border-b border-[#eee3df] md:border-b-0"
                      : ""
                  }

                  ${
                    index % 2 === 0
                      ? "border-r border-[#eee3df] md:border-r"
                      : ""
                  }
                `}
              >
                {/* Icon */}
                <motion.div
                  whileHover={{
                    rotate: -8,
                    scale: 1.1,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="
                    flex
                    h-[46px]
                    w-[46px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#fbeaec]
                    text-[#941c2e]
                    transition-colors
                    duration-300
                    group-hover:bg-[#941c2e]
                    group-hover:text-white
                  "
                >
                  <Icon
                    size={21}
                    strokeWidth={1.7}
                  />
                </motion.div>

                {/* Content */}
                <div>
                  <h3
                    className="
                      font-serif
                      text-[21px]
                      font-bold
                      leading-none
                      text-[#241a17]
                      sm:text-[24px]
                    "
                  >
                    {stat.value}
                  </h3>

                  <p
                    className="
                      mt-2
                      whitespace-nowrap
                      text-[10px]
                      font-medium
                      text-[#7a6b66]
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
      </div>
    </section>
  );
}