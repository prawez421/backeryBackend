"use client";

import { motion } from "framer-motion";
import { Heart, Leaf, Sparkles } from "lucide-react";

const missionPoints = [
  {
    icon: Leaf,
    title: "Freshness First",
    text: "Freshly prepared baked goods with quality ingredients.",
  },
  {
    icon: Heart,
    title: "Made With Care",
    text: "Every creation is prepared with attention and passion.",
  },
  {
    icon: Sparkles,
    title: "Create Happiness",
    text: "Making everyday moments and celebrations more memorable.",
  },
];

export default function OurMission() {
  return (
    <section
      className="
        overflow-hidden
        bg-[#fffaf7]
        py-12
        sm:py-14
        lg:py-16
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
        <div
          className="
            grid
            grid-cols-1
            items-center
            gap-10

            lg:grid-cols-2
            lg:gap-16

            xl:gap-20
          "
        >
          {/* =====================================
              LEFT CONTENT
          ====================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            {/* SMALL TITLE */}

            <div className="flex items-center gap-3">
              <span
                className="
                  h-[1px]
                  w-[35px]
                  bg-[#9a1e2f]
                "
              />

              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[3px]
                  text-[#9a1e2f]

                  sm:text-[10px]
                "
              >
                Our Mission
              </p>
            </div>

            {/* HEADING */}

            <h2
              className="
                mt-5
                max-w-[580px]
                font-serif
                text-[34px]
                font-medium
                leading-[1.1]
                tracking-[-1px]
                text-[#281a17]

                sm:text-[40px]
                lg:text-[46px]
              "
            >
              Baking Happiness Into
              <span className="italic text-[#9a1e2f]">
                {" "}Every Moment.
              </span>
            </h2>

            {/* DESCRIPTION */}

            <p
              className="
                mt-6
                max-w-[580px]
                text-[11px]
                leading-[1.9]
                text-[#75615b]

                sm:text-[12px]
                lg:text-[13px]
              "
            >
              Our mission at Alibros Bakery is to create
              fresh, delicious and beautifully prepared baked
              goods that bring happiness to everyday moments
              and special celebrations.
            </p>

            <p
              className="
                mt-4
                max-w-[560px]
                text-[10px]
                leading-[1.9]
                text-[#8a7670]

                sm:text-[11px]
                lg:text-[12px]
              "
            >
              We believe every cake, pastry and baked treat
              should be made with care, quality and attention
              to detail — because the smallest moments can
              become the sweetest memories.
            </p>

            {/* QUOTE */}

            <div
              className="
                mt-7
                border-l-2
                border-[#9a1e2f]
                pl-5
              "
            >
              <p
                className="
                  font-serif
                  text-[17px]
                  italic
                  leading-[1.6]
                  text-[#4d3934]

                  sm:text-[19px]
                "
              >
                “Freshly baked, thoughtfully made,
                and created to bring people together.”
              </p>
            </div>
          </motion.div>

          {/* =====================================
              RIGHT SIDE
          ====================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            className="
              relative
              rounded-[28px]
              bg-[#f5e9e5]
              p-6

              sm:p-8
              lg:p-10
            "
          >
            {/* DECORATION */}

            <div
              className="
                pointer-events-none
                absolute
                -right-[70px]
                -top-[70px]
                h-[180px]
                w-[180px]
                rounded-full
                border
                border-[#dcbfb7]/60
              "
            />

            {/* NUMBER */}

            <p
              className="
                font-serif
                text-[70px]
                leading-none
                text-[#9a1e2f]/10

                sm:text-[85px]
              "
            >
              02
            </p>

            <div className="relative z-10 mt-[-15px]">
              <p
                className="
                  mb-6
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[2.5px]
                  text-[#9a1e2f]
                "
              >
                What Drives Us
              </p>

              {/* MISSION POINTS */}

              <div className="space-y-3">
                {missionPoints.map(
                  (item, index) => {
                    const Icon = item.icon;

                    return (
                      <motion.div
                        key={item.title}
                        initial={{
                          opacity: 0,
                          y: 15,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                        }}
                        viewport={{
                          once: true,
                        }}
                        transition={{
                          duration: 0.45,
                          delay:
                            0.15 +
                            index * 0.1,
                        }}
                        className="
                          group
                          flex
                          items-center
                          gap-4
                          rounded-[16px]
                          border
                          border-[#e3cec7]
                          bg-[#fffaf7]
                          p-4
                          transition-all
                          duration-300

                          hover:-translate-y-0.5
                          hover:border-[#d5aea7]
                          hover:bg-white
                        "
                      >
                        {/* ICON */}

                        <div
                          className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-[#f2dddd]
                            text-[#9a1e2f]
                            transition-all
                            duration-300

                            group-hover:bg-[#9a1e2f]
                            group-hover:text-white
                          "
                        >
                          <Icon
                            size={16}
                            strokeWidth={1.7}
                          />
                        </div>

                        {/* TEXT */}

                        <div>
                          <h3
                            className="
                              font-serif
                              text-[17px]
                              font-semibold
                              text-[#35231f]
                            "
                          >
                            {item.title}
                          </h3>

                          <p
                            className="
                              mt-1
                              text-[9px]
                              leading-[1.7]
                              text-[#806d67]

                              sm:text-[10px]
                            "
                          >
                            {item.text}
                          </p>
                        </div>
                      </motion.div>
                    );
                  }
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}