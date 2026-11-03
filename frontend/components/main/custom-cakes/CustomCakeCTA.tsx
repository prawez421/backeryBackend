"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CakeSlice,
  Sparkles,
  Upload,
} from "lucide-react";

export default function CustomCakeCTA() {
  const scrollToForm = () => {
    document
      .getElementById("custom-cake-form")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  const scrollToGallery = () => {
    document
      .getElementById("design-gallery")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <section
      className="
        overflow-hidden
        bg-[#fffaf7]
        px-4
        py-12
        sm:px-6
        sm:py-16
        lg:px-10
        lg:py-20
      "
    >
      <div
        className="
          relative
          mx-auto
          max-w-[1400px]
          overflow-hidden
          rounded-[30px]
          bg-[#9a1e2f]
        "
      >
        {/* ==========================================
            BACKGROUND DECORATIONS
        =========================================== */}

        <div
          className="
            pointer-events-none
            absolute
            -left-[130px]
            -top-[170px]
            h-[380px]
            w-[380px]
            rounded-full
            border
            border-white/10
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -left-[60px]
            -top-[100px]
            h-[240px]
            w-[240px]
            rounded-full
            border
            border-white/10
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            bottom-[-220px]
            left-[35%]
            h-[420px]
            w-[420px]
            rounded-full
            bg-white/[0.04]
          "
        />

        {/* ==========================================
            MAIN GRID
        =========================================== */}

        <div
          className="
            relative
            z-10
            grid
            min-h-[500px]
            grid-cols-1
            lg:grid-cols-[1.15fr_0.85fr]
          "
        >
          {/* ======================================
              LEFT CONTENT
          ======================================= */}

          <div
            className="
              flex
              items-center
              px-6
              pb-10
              pt-12

              sm:px-10
              sm:py-14

              lg:px-14
              lg:py-16

              xl:px-20
            "
          >
            <div className="max-w-[700px]">

              {/* LABEL */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/20
                  bg-white/10
                  px-3
                  py-2
                "
              >
                <Sparkles
                  size={12}
                  className="text-[#ffd4d0]"
                />

                <span
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[2.5px]
                    text-white
                  "
                >
                  Made Just For You
                </span>
              </motion.div>

              {/* HEADING */}

              <motion.h2
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  max-w-[680px]
                  font-serif
                  text-[39px]
                  font-medium
                  leading-[1.03]
                  tracking-[-1.4px]
                  text-white

                  sm:text-[49px]
                  lg:text-[56px]
                  xl:text-[63px]
                "
              >
                Have A Cake Idea
                <br />

                <span className="italic text-[#ffd1cd]">
                  In Your Mind?
                </span>
              </motion.h2>

              {/* DESCRIPTION */}

              <motion.p
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.15,
                }}
                className="
                  mt-5
                  max-w-[530px]
                  text-[11px]
                  leading-6
                  text-white/70

                  sm:text-[12px]
                  lg:text-[13px]
                "
              >
                Share your idea, reference photo, favourite
                flavour and celebration details with Alibros
                Bakery. We&apos;ll help turn your idea into a
                beautiful custom cake.
              </motion.p>

              {/* ======================================
                  BUTTONS
              ======================================= */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.25,
                }}
                className="
                  mt-7
                  flex
                  flex-col
                  gap-3
                  min-[430px]:flex-row
                  min-[430px]:flex-wrap
                "
              >
                {/* PRIMARY */}

                <button
                  type="button"
                  onClick={scrollToForm}
                  className="
                    group
                    inline-flex
                    items-center
                    justify-center
                    gap-2

                    rounded-full

                    bg-white

                    px-6
                    py-3.5

                    text-[10px]
                    font-bold
                    text-[#9a1e2f]

                    shadow-[0_10px_25px_rgba(40,10,15,0.18)]

                    transition-all
                    duration-300

                    hover:-translate-y-0.5
                    hover:bg-[#fff0ed]

                    sm:text-[11px]
                  "
                >
                  Design My Cake

                  <ArrowRight
                    size={14}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </button>

                {/* SECONDARY */}

                <button
                  type="button"
                  onClick={scrollToGallery}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2

                    rounded-full

                    border
                    border-white/25

                    bg-white/10

                    px-6
                    py-3.5

                    text-[10px]
                    font-semibold
                    text-white

                    backdrop-blur-md

                    transition-all
                    duration-300

                    hover:border-white
                    hover:bg-white
                    hover:text-[#9a1e2f]

                    sm:text-[11px]
                  "
                >
                  <Upload size={13} />

                  View Cake Ideas
                </button>
              </motion.div>

              {/* ======================================
                  SMALL FEATURES
              ======================================= */}

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.35,
                }}
                className="
                  mt-8
                  flex
                  flex-wrap
                  gap-x-6
                  gap-y-3
                  border-t
                  border-white/15
                  pt-5
                "
              >
                <SmallFeature text="Choose Your Flavour" />
                <SmallFeature text="Custom Design" />
                <SmallFeature text="Personal Message" />
              </motion.div>
            </div>
          </div>

          {/* ======================================
              RIGHT IMAGE AREA
          ======================================= */}

          <div
            className="
              relative
              min-h-[390px]
              overflow-hidden

              lg:min-h-full
            "
          >
            {/* LARGE CIRCLE */}

            <div
              className="
                absolute
                left-1/2
                top-1/2

                h-[390px]
                w-[390px]

                -translate-x-1/2
                -translate-y-1/2

                rounded-full

                border
                border-white/10

                sm:h-[450px]
                sm:w-[450px]

                lg:h-[480px]
                lg:w-[480px]
              "
            />

            {/* MAIN IMAGE */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.85,
                rotate: 5,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
                rotate: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                absolute
                left-1/2
                top-1/2

                h-[315px]
                w-[260px]

                -translate-x-1/2
                -translate-y-1/2

                overflow-hidden

                rounded-[130px_130px_30px_30px]

                border-[7px]
                border-white/20

                bg-white

                shadow-[0_30px_60px_rgba(45,5,15,0.25)]

                sm:h-[360px]
                sm:w-[300px]

                lg:h-[400px]
                lg:w-[325px]
              "
            >
              <Image
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=90"
                alt="Custom cake by Alibros Bakery"
                fill
                sizes="
                  (max-width: 640px) 260px,
                  (max-width: 1024px) 300px,
                  325px
                "
                className="
                  object-cover
                  object-center
                  transition-transform
                  duration-700
                  hover:scale-105
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/25
                  via-transparent
                  to-transparent
                "
              />
            </motion.div>

            {/* ======================================
                FLOATING BADGE
            ======================================= */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.7,
                rotate: -10,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
                rotate: 7,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.55,
                delay: 0.4,
              }}
              className="
                absolute
                right-[8%]
                top-[12%]

                flex
                h-[90px]
                w-[90px]
                flex-col
                items-center
                justify-center

                rounded-full

                bg-[#281916]

                text-center
                text-white

                shadow-[0_15px_35px_rgba(40,10,15,0.25)]

                sm:right-[18%]
                lg:right-[5%]
                xl:right-[13%]
              "
            >
              <CakeSlice
                size={16}
                className="mb-1 text-[#f2b9b5]"
              />

              <span
                className="
                  text-[7px]
                  font-bold
                  uppercase
                  leading-[1.5]
                  tracking-[1.3px]
                "
              >
                Your Idea
                <br />
                Our Craft
              </span>
            </motion.div>

            {/* ======================================
                FLOATING TEXT CARD
            ======================================= */}

            <motion.div
              initial={{
                opacity: 0,
                x: -25,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.5,
              }}
              className="
                absolute
                bottom-[8%]
                left-[4%]

                rounded-[17px]

                border
                border-white/20

                bg-white/10

                px-4
                py-3

                backdrop-blur-xl

                sm:left-[15%]
                lg:left-0
                xl:left-[7%]
              "
            >
              <p
                className="
                  text-[7px]
                  font-bold
                  uppercase
                  tracking-[2px]
                  text-white/55
                "
              >
                Alibros Bakery
              </p>

              <p
                className="
                  mt-1
                  font-serif
                  text-[15px]
                  font-medium
                  text-white
                "
              >
                Baked for your moment.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =====================================================
   SMALL FEATURE
===================================================== */

function SmallFeature({
  text,
}: {
  text: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-2

        text-[9px]
        font-medium
        text-white/65

        sm:text-[10px]
      "
    >
      <span
        className="
          h-[5px]
          w-[5px]
          rounded-full
          bg-[#ffd1cd]
        "
      />

      {text}
    </div>
  );
}