"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  CakeSlice,
  Clock3,
  Coffee,
  Sparkles,
} from "lucide-react";

/* =====================================================
   OPENING HOURS DATA

   IMPORTANT:
   Ye sample timings hain.
   Apne actual bakery timings se replace kar dena.
===================================================== */

const openingHours = [
  {
    id: 1,
    day: "Monday",
    shortDay: "MON",
    time: "09:00 AM – 09:00 PM",
    closed: false,
  },
  {
    id: 2,
    day: "Tuesday",
    shortDay: "TUE",
    time: "09:00 AM – 09:00 PM",
    closed: false,
  },
  {
    id: 3,
    day: "Wednesday",
    shortDay: "WED",
    time: "09:00 AM – 09:00 PM",
    closed: false,
  },
  {
    id: 4,
    day: "Thursday",
    shortDay: "THU",
    time: "09:00 AM – 09:00 PM",
    closed: false,
  },
  {
    id: 5,
    day: "Friday",
    shortDay: "FRI",
    time: "09:00 AM – 09:00 PM",
    closed: false,
  },
  {
    id: 6,
    day: "Saturday",
    shortDay: "SAT",
    time: "09:00 AM – 10:00 PM",
    closed: false,
  },
  {
    id: 7,
    day: "Sunday",
    shortDay: "SUN",
    time: "10:00 AM – 08:00 PM",
    closed: false,
  },
];

/* =====================================================
   ANIMATION
===================================================== */

const containerVariants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const rowVariants = {
  hidden: {
    opacity: 0,
    x: 25,
  },

  visible: {
    opacity: 1,
    x: 0,

    transition: {
      duration: 0.45,
      ease: "easeOut" as const,
    },
  },
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function OpeningHours() {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#fffaf7]
        py-14
        sm:py-16
        lg:py-20
      "
    >
      <div
        className="
          mx-auto
          max-w-[1400px]
          px-5
          sm:px-8
          lg:px-12
        "
      >
        {/* =================================================
            SECTION HEADING
        ================================================== */}

        <div
          className="
            mb-10
            grid
            grid-cols-1
            gap-5
            lg:grid-cols-[1fr_420px]
            lg:items-end
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              x: -25,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <div
              className="
                mb-4
                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-[#f3dfe0]
                  text-[#9a1e2f]
                "
              >
                <Clock3 size={13} />
              </span>

              <span
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[2.7px]
                  text-[#9a1e2f]
                "
              >
                Opening Hours
              </span>
            </div>

            <h2
              className="
                font-serif
                text-[35px]
                font-medium
                leading-[1.08]
                tracking-[-1px]
                text-[#281b18]

                sm:text-[43px]
                lg:text-[50px]
              "
            >
              There&apos;s Always Time
              <br />

              <span className="italic text-[#9a1e2f]">
                For Something Sweet.
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{
              opacity: 0,
              x: 25,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            className="
              text-[11px]
              leading-6
              text-[#806d67]

              sm:text-[12px]
              lg:text-[13px]
            "
          >
            Planning to visit? Check our weekly bakery hours
            before stopping by for cakes, pastries and freshly
            baked favourites.
          </motion.p>
        </div>

        {/* =================================================
            MAIN LAYOUT
        ================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-5

            lg:grid-cols-[0.9fr_1.1fr]
          "
        >
          {/* =================================================
              LEFT IMAGE
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: -35,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.7,
            }}
            className="
              group
              relative
              min-h-[450px]
              overflow-hidden
              rounded-[28px]

              sm:min-h-[500px]
              lg:min-h-[590px]
            "
          >
            {/* IMAGE */}

            <Image
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85"
              alt="Fresh bakery products"
              fill
              sizes="
                (max-width: 1024px) 100vw,
                45vw
              "
              className="
                object-cover
                object-center
                transition-transform
                duration-[1200ms]
                group-hover:scale-[1.05]
              "
            />

            {/* OVERLAY */}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-[#1d0e0c]/90
                via-[#28120f]/15
                to-transparent
              "
            />

            {/* TOP BADGE */}

            <div
              className="
                absolute
                left-5
                top-5

                inline-flex
                items-center
                gap-2

                rounded-full

                border
                border-white/20

                bg-black/10

                px-4
                py-2

                backdrop-blur-md
              "
            >
              <Sparkles
                size={11}
                className="text-[#efb0ad]"
              />

              <span
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[1.7px]
                  text-white
                "
              >
                Fresh Every Day
              </span>
            </div>

            {/* FLOATING ICON */}

            <div
              className="
                absolute
                right-5
                top-5

                flex
                h-11
                w-11
                items-center
                justify-center

                rounded-full

                bg-[#9a1e2f]

                text-white

                shadow-lg
              "
            >
              <CakeSlice size={17} />
            </div>

            {/* BOTTOM CONTENT */}

            <div
              className="
                absolute
                bottom-0
                left-0
                right-0

                p-6

                sm:p-8
              "
            >
              <div
                className="
                  mb-4
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center

                  rounded-full

                  border
                  border-white/20

                  bg-white/10

                  text-white

                  backdrop-blur-md
                "
              >
                <Coffee size={17} />
              </div>

              <p
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[2px]
                  text-[#efaaa7]
                "
              >
                Visit Alibros
              </p>

              <h3
                className="
                  mt-2
                  max-w-[420px]

                  font-serif
                  text-[28px]
                  font-medium
                  leading-[1.15]
                  text-white

                  sm:text-[33px]
                "
              >
                Freshly baked treats,
                <span className="italic text-[#efaaa7]">
                  {" "}
                  waiting for you.
                </span>
              </h3>

              <p
                className="
                  mt-3
                  max-w-[420px]

                  text-[9px]
                  leading-[1.8]
                  text-white/55

                  sm:text-[10px]
                "
              >
                Drop by during our opening hours to explore
                cakes, pastries and other bakery favourites.
              </p>
            </div>
          </motion.div>

          {/* =================================================
              RIGHT HOURS CARD
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 35,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.7,
            }}
            className="
              rounded-[28px]

              border
              border-[#e7d7d1]

              bg-[#fffdfb]

              p-5

              shadow-[0_15px_45px_rgba(70,30,30,0.05)]

              sm:p-7
              lg:p-8
            "
          >
            {/* =====================================
                CARD HEADER
            ====================================== */}

            <div
              className="
                flex
                items-start
                justify-between
                gap-4

                border-b
                border-[#eadbd5]

                pb-6
              "
            >
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
                  Weekly Schedule
                </p>

                <h3
                  className="
                    mt-2
                    font-serif
                    text-[25px]
                    font-semibold
                    text-[#34231f]

                    sm:text-[28px]
                  "
                >
                  Bakery Hours
                </h3>

                <p
                  className="
                    mt-2
                    text-[9px]
                    leading-5
                    text-[#8a7771]
                  "
                >
                  Check our daily opening and closing times.
                </p>
              </div>

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center

                  rounded-[14px]

                  bg-[#f3dfe0]

                  text-[#9a1e2f]
                "
              >
                <CalendarDays size={18} />
              </div>
            </div>

            {/* =====================================
                DAYS
            ====================================== */}

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.15,
              }}
              className="mt-2"
            >
              {openingHours.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={rowVariants}
                  className={`
                    group

                    flex
                    items-center
                    justify-between
                    gap-3

                    py-4

                    ${
                      index !== openingHours.length - 1
                        ? "border-b border-[#eee2dd]"
                        : ""
                    }
                  `}
                >
                  {/* DAY */}

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center

                        rounded-full

                        bg-[#f8eeeb]

                        text-[7px]
                        font-bold
                        text-[#9a1e2f]

                        transition-all
                        duration-300

                        group-hover:bg-[#9a1e2f]
                        group-hover:text-white
                      "
                    >
                      {item.shortDay}
                    </div>

                    <div>
                      <p
                        className="
                          text-[10px]
                          font-semibold
                          text-[#42302b]

                          sm:text-[11px]
                        "
                      >
                        {item.day}
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-[7px]
                          uppercase
                          tracking-[1px]
                          text-[#a5918b]
                        "
                      >
                        {item.closed
                          ? "Bakery Closed"
                          : "Open"}
                      </p>
                    </div>
                  </div>

                  {/* TIME */}

                  <div className="flex items-center gap-2">
                    <Clock3
                      size={12}
                      className="hidden text-[#9a1e2f] sm:block"
                    />

                    <span
                      className={`
                        text-right
                        text-[9px]
                        font-semibold

                        sm:text-[10px]

                        ${
                          item.closed
                            ? "text-[#9a1e2f]"
                            : "text-[#5d4943]"
                        }
                      `}
                    >
                      {item.closed
                        ? "Closed"
                        : item.time}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* =====================================
                BOTTOM NOTE
            ====================================== */}

            <div
              className="
                mt-4

                rounded-[18px]

                bg-[#f7edE9]

                p-4
              "
            >
              <div
                className="
                  flex
                  items-start
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center

                    rounded-full

                    bg-[#9a1e2f]

                    text-white
                  "
                >
                  <Clock3 size={14} />
                </div>

                <div>
                  <p
                    className="
                      text-[9px]
                      font-semibold
                      text-[#402e29]
                    "
                  >
                    Planning a special order?
                  </p>

                  <p
                    className="
                      mt-1
                      text-[8px]
                      leading-[1.7]
                      text-[#8a7771]
                    "
                  >
                    Custom cakes may need advance notice,
                    depending on the design and requirements.
                  </p>
                </div>
              </div>
            </div>

            {/* =====================================
                BUTTON
            ====================================== */}

            <Link
              href="/custom-cakes"
              className="
                group
                mt-5

                flex
                w-full
                items-center
                justify-between

                rounded-[15px]

                bg-[#281916]

                px-5
                py-4

                text-white

                transition-all
                duration-300

                hover:bg-[#9a1e2f]
              "
            >
              <div>
                <p
                  className="
                    text-[7px]
                    font-bold
                    uppercase
                    tracking-[1.5px]
                    text-white/50
                  "
                >
                  Celebration Coming Up?
                </p>

                <p
                  className="
                    mt-1
                    font-serif
                    text-[14px]
                    font-medium
                  "
                >
                  Plan Your Custom Cake
                </p>
              </div>

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center

                  rounded-full

                  bg-white/10

                  transition-all
                  duration-300

                  group-hover:bg-white
                  group-hover:text-[#9a1e2f]
                "
              >
                <ArrowUpRight
                  size={14}
                  className="
                    transition-transform
                    duration-300
                    group-hover:rotate-45
                  "
                />
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}