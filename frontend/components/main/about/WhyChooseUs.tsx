"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CakeSlice,
  Check,
  ChefHat,
  Heart,
  Leaf,
  PackageCheck,
  Sparkles,
  Wheat,
} from "lucide-react";

/* =====================================================
   WHY CHOOSE US DATA
===================================================== */

const reasons = [
  {
    id: 1,
    number: "01",
    title: "Freshly Prepared",
    description:
      "Our bakery treats are prepared with freshness, flavour and care in mind.",
    icon: ChefHat,
  },
  {
    id: 2,
    number: "02",
    title: "Quality Ingredients",
    description:
      "We focus on carefully selected ingredients to create better tasting bakes.",
    icon: Wheat,
  },
  {
    id: 3,
    number: "03",
    title: "Custom Cake Designs",
    description:
      "Create cakes around your theme, colours, flavour and special celebration.",
    icon: CakeSlice,
  },
  {
    id: 4,
    number: "04",
    title: "Eggless Options",
    description:
      "Selected bakery items can be prepared with eggless options based on availability.",
    icon: Leaf,
  },
  {
    id: 5,
    number: "05",
    title: "For Every Occasion",
    description:
      "Birthday, anniversary, wedding or any special moment — there is something for every celebration.",
    icon: Heart,
  },
  {
    id: 6,
    number: "06",
    title: "Pickup & Delivery",
    description:
      "Choose convenient bakery pickup or available delivery options for your order.",
    icon: PackageCheck,
  },
];

/* =====================================================
   ANIMATIONS
===================================================== */

const containerVariants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    x: 30,
  },

  visible: {
    opacity: 1,
    x: 0,

    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

/* =====================================================
   COMPONENT
===================================================== */

export default function WhyChooseUs() {
  return (
    <section
      className="
        overflow-hidden
        bg-[#fffdfb]
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
        <div
          className="
            grid
            grid-cols-1
            items-center
            gap-12
            lg:grid-cols-[0.92fr_1.08fr]
            lg:gap-16
            xl:gap-20
          "
        >
          {/* =================================================
              LEFT IMAGE AREA
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: -40,
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
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              relative
              min-h-[500px]
              sm:min-h-[600px]
              lg:min-h-[680px]
            "
          >
            {/* BACKGROUND SHAPE */}

            <div
              className="
                absolute
                bottom-[2%]
                left-[4%]
                h-[90%]
                w-[88%]
                rounded-[30px_150px_30px_30px]
                bg-[#f4e6e1]
              "
            />

            {/* =========================================
                MAIN IMAGE
            ========================================== */}

            <div
              className="
                absolute
                bottom-[7%]
                left-0
                top-0
                w-[86%]
                overflow-hidden
                rounded-[26px_140px_26px_26px]
                shadow-[0_25px_60px_rgba(70,30,30,0.13)]
              "
            >
              <Image
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=90"
                alt="Bakery preparation"
                fill
                sizes="(max-width: 1024px) 90vw, 42vw"
                className="
                  object-cover
                  transition-transform
                  duration-1000
                  hover:scale-[1.04]
                "
              />

              {/* IMAGE OVERLAY */}

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-[#281916]/55
                  via-transparent
                  to-transparent
                "
              />

              {/* BOTTOM IMAGE TEXT */}

              <div
                className="
                  absolute
                  bottom-6
                  left-6
                  right-6
                  z-10
                "
              >
                <p
                  className="
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[2.5px]
                    text-white/60
                  "
                >
                  Alibros Bakery
                </p>

                <h3
                  className="
                    mt-2
                    max-w-[300px]
                    font-serif
                    text-[22px]
                    font-medium
                    leading-[1.2]
                    text-white
                    sm:text-[25px]
                  "
                >
                  Thoughtfully baked for every sweet moment.
                </h3>
              </div>
            </div>

            {/* =========================================
                SMALL CAKE IMAGE
            ========================================== */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
                delay: 0.3,
              }}
              className="
                absolute
                bottom-0
                right-0
                z-20

                h-[180px]
                w-[160px]

                overflow-hidden
                rounded-[22px]

                border-[6px]
                border-[#fffdfb]

                shadow-[0_18px_45px_rgba(70,30,30,0.17)]

                sm:h-[220px]
                sm:w-[195px]

                lg:h-[230px]
                lg:w-[205px]
              "
            >
              <Image
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=90"
                alt="Alibros Bakery cake"
                fill
                sizes="210px"
                className="object-cover"
              />
            </motion.div>

            {/* =========================================
                TOP FLOATING BADGE
            ========================================== */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.7,
                rotate: -12,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
                rotate: 5,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.55,
                delay: 0.4,
              }}
              className="
                absolute
                right-[3%]
                top-[8%]
                z-30

                flex
                h-[100px]
                w-[100px]
                flex-col
                items-center
                justify-center

                rounded-full
                bg-[#9a1e2f]

                text-center
                text-white

                shadow-[0_15px_35px_rgba(154,30,47,0.25)]

                sm:right-[6%]
              "
            >
              <Sparkles size={16} />

              <span
                className="
                  mt-2
                  text-[7px]
                  font-bold
                  uppercase
                  leading-[1.5]
                  tracking-[1.3px]
                "
              >
                Made
                <br />
                With Care
              </span>
            </motion.div>

            {/* =========================================
                CHECK LABEL
            ========================================== */}

            <motion.div
              initial={{
                opacity: 0,
                x: -20,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
                delay: 0.5,
              }}
              className="
                absolute
                left-[5%]
                top-[5%]
                z-30

                flex
                items-center
                gap-2

                rounded-full

                border
                border-white/30

                bg-white/90

                px-4
                py-2.5

                shadow-[0_10px_25px_rgba(40,20,20,0.12)]

                backdrop-blur-md
              "
            >
              <span
                className="
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-full
                  bg-[#9a1e2f]
                  text-white
                "
              >
                <Check size={12} strokeWidth={3} />
              </span>

              <span
                className="
                  text-[9px]
                  font-bold
                  text-[#4b3732]
                "
              >
                Fresh & Carefully Prepared
              </span>
            </motion.div>

            {/* DOT DECORATION */}

            <div
              className="
                absolute
                bottom-[8%]
                left-[-10px]

                hidden
                grid-cols-4
                gap-[7px]

                sm:grid
              "
            >
              {Array.from({
                length: 16,
              }).map((_, index) => (
                <span
                  key={index}
                  className="
                    h-[3px]
                    w-[3px]
                    rounded-full
                    bg-[#9a1e2f]/25
                  "
                />
              ))}
            </div>
          </motion.div>

          {/* =================================================
              RIGHT CONTENT
          ================================================== */}

          <div>
            {/* SMALL LABEL */}

            <motion.div
              initial={{
                opacity: 0,
                x: 20,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
              }}
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

                  bg-[#f4e0e2]
                  text-[#9a1e2f]
                "
              >
                <CakeSlice size={13} />
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
                Why Alibros
              </span>
            </motion.div>

            {/* HEADING */}

            <motion.h2
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
                delay: 0.08,
              }}
              className="
                max-w-[620px]

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
              Why Choose
              <br />

              <span className="italic text-[#9a1e2f]">
                Alibros Bakery?
              </span>
            </motion.h2>

            {/* DESCRIPTION */}

            <motion.p
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
                duration: 0.5,
                delay: 0.15,
              }}
              className="
                mt-5
                max-w-[580px]

                text-[12px]
                leading-6
                text-[#796762]

                sm:text-[13px]
              "
            >
              Whether you&apos;re choosing a simple bakery
              treat or planning a custom cake for a special
              celebration, we focus on making the experience
              simple, thoughtful and delicious.
            </motion.p>

            {/* =================================================
                REASONS LIST
            ================================================== */}

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.1,
              }}
              className="
                mt-8
                border-t
                border-[#eadbd5]
              "
            >
              {reasons.map((reason) => {
                const Icon = reason.icon;

                return (
                  <motion.div
                    key={reason.id}
                    variants={itemVariants}
                    className="
                      group
                      grid
                      grid-cols-[42px_1fr]
                      gap-4

                      border-b
                      border-[#eadbd5]

                      py-4

                      sm:grid-cols-[50px_1fr_auto]
                      sm:items-center
                      sm:py-5
                    "
                  >
                    {/* ICON */}

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center

                        rounded-full

                        bg-[#f5e5e4]
                        text-[#9a1e2f]

                        transition-all
                        duration-300

                        group-hover:bg-[#9a1e2f]
                        group-hover:text-white

                        sm:h-11
                        sm:w-11
                      "
                    >
                      <Icon
                        size={17}
                        strokeWidth={1.7}
                      />
                    </div>

                    {/* TEXT */}

                    <div>
                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >
                        <h3
                          className="
                            font-serif
                            text-[18px]
                            font-semibold
                            text-[#392925]

                            transition-colors
                            duration-300

                            group-hover:text-[#9a1e2f]

                            sm:text-[20px]
                          "
                        >
                          {reason.title}
                        </h3>

                        <span
                          className="
                            text-[7px]
                            font-bold
                            tracking-[1px]
                            text-[#b49c95]
                          "
                        >
                          {reason.number}
                        </span>
                      </div>

                      <p
                        className="
                          mt-1.5
                          max-w-[480px]
                          text-[9px]
                          leading-[1.7]
                          text-[#89756f]

                          sm:text-[10px]
                          lg:text-[11px]
                        "
                      >
                        {reason.description}
                      </p>
                    </div>

                    {/* ARROW */}

                    <div
                      className="
                        hidden
                        h-8
                        w-8
                        items-center
                        justify-center

                        rounded-full

                        border
                        border-[#eadbd5]

                        text-[#9a1e2f]

                        transition-all
                        duration-300

                        group-hover:border-[#9a1e2f]
                        group-hover:bg-[#9a1e2f]
                        group-hover:text-white

                        sm:flex
                      "
                    >
                      <ArrowRight
                        size={13}
                        className="
                          transition-transform
                          duration-300
                          group-hover:translate-x-0.5
                        "
                      />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* =================================================
                CTA
            ================================================== */}

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
                duration: 0.5,
                delay: 0.25,
              }}
              className="
                mt-7
                flex
                flex-col
                gap-4

                rounded-[20px]

                bg-[#f7efeb]

                px-5
                py-5

                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:px-6
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
                  Something sweet?
                </p>

                <p
                  className="
                    mt-1
                    font-serif
                    text-[18px]
                    font-medium
                    text-[#392824]

                    sm:text-[20px]
                  "
                >
                  Discover what&apos;s baking.
                </p>
              </div>

              <Link
                href="/menu"
                className="
                  group

                  inline-flex
                  items-center
                  justify-center
                  gap-2

                  rounded-full

                  bg-[#9a1e2f]

                  px-5
                  py-3

                  text-[10px]
                  font-semibold
                  text-white

                  transition-all
                  duration-300

                  hover:-translate-y-0.5
                  hover:bg-[#7f1827]
                "
              >
                Explore Menu

                <ArrowRight
                  size={13}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}