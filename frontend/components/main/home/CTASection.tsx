"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CakeSlice,
  Sparkles,
  Heart,
} from "lucide-react";

export default function CTASection() {
  return (
    <section className="overflow-hidden bg-[#fff9f6] py-12 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">

        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
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
            overflow-hidden
            rounded-[32px]
            bg-[#8f1728]
            shadow-[0_25px_70px_rgba(100,20,35,0.18)]
          "
        >
          {/* ==================================
              BACKGROUND DECORATIONS
          ================================== */}

          <div
            className="
              absolute
              -left-[120px]
              -top-[150px]
              h-[400px]
              w-[400px]
              rounded-full
              border
              border-white/10
            "
          />

          <div
            className="
              absolute
              -left-[60px]
              -top-[90px]
              h-[280px]
              w-[280px]
              rounded-full
              border
              border-white/10
            "
          />

          <div
            className="
              absolute
              -bottom-[180px]
              right-[15%]
              h-[450px]
              w-[450px]
              rounded-full
              bg-[#a9283b]
              opacity-60
              blur-[10px]
            "
          />

          {/* Dots */}
          <div
            className="
              absolute
              left-[48%]
              top-[12%]
              hidden
              grid-cols-5
              gap-3
              opacity-20
              lg:grid
            "
          >
            {Array.from({ length: 20 }).map((_, index) => (
              <span
                key={index}
                className="h-[4px] w-[4px] rounded-full bg-white"
              />
            ))}
          </div>

          {/* ==================================
              CONTENT GRID
          ================================== */}

          <div
            className="
              relative
              z-10
              grid
              min-h-[520px]
              grid-cols-1
              lg:grid-cols-[1.05fr_0.95fr]
            "
          >
            {/* ==================================
                LEFT CONTENT
            ================================== */}

            <motion.div
              initial={{
                opacity: 0,
                x: -60,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.7,
                delay: 0.1,
              }}
              className="
                flex
                flex-col
                justify-center
                px-7
                py-14
                sm:px-12
                lg:px-16
                xl:px-20
              "
            >
              {/* Small badge */}
              <motion.div
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
                  delay: 0.25,
                }}
                className="
                  mb-6
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/15
                  bg-white/10
                  px-4
                  py-2
                  text-[11px]
                  font-semibold
                  text-[#ffe5d7]
                  backdrop-blur-sm
                "
              >
                <Sparkles size={13} />

                Baked for Your Special Moments
              </motion.div>

              {/* Heading */}
              <h2
                className="
                  max-w-[650px]
                  font-serif
                  text-[40px]
                  font-semibold
                  leading-[1.08]
                  tracking-[-1.5px]
                  text-white
                  sm:text-[50px]
                  lg:text-[56px]
                  xl:text-[62px]
                "
              >
                Make Your
                <br />

                Celebration{" "}

                <span className="italic text-[#ffd8c4]">
                  Sweeter.
                </span>
              </h2>

              {/* Description */}
              <p
                className="
                  mt-6
                  max-w-[530px]
                  text-[13px]
                  leading-7
                  text-white/75
                  sm:text-[14px]
                "
              >
                From birthdays and anniversaries to life&apos;s
                smallest happy moments, we&apos;ll bake something
                beautiful and delicious just for you.
              </p>

              {/* Buttons */}
              <div className="mt-9 flex flex-wrap gap-3">

                {/* Order */}
                <Link href="/order">
                  <motion.span
                    whileHover={{
                      scale: 1.04,
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className="
                      group
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      bg-white
                      px-7
                      py-3.5
                      text-[13px]
                      font-bold
                      text-[#8f1728]
                      shadow-[0_10px_30px_rgba(0,0,0,0.12)]
                    "
                  >
                    Order Your Cake

                    <ArrowRight
                      size={15}
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    />
                  </motion.span>
                </Link>

                {/* Menu */}
                <Link href="/menu">
                  <motion.span
                    whileHover={{
                      scale: 1.04,
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-white/35
                      bg-white/5
                      px-7
                      py-3.5
                      text-[13px]
                      font-semibold
                      text-white
                      backdrop-blur-sm
                      transition-colors
                      hover:bg-white/10
                    "
                  >
                    <CakeSlice size={15} />

                    Explore Menu
                  </motion.span>
                </Link>
              </div>

              {/* Bottom note */}
              <div
                className="
                  mt-8
                  flex
                  items-center
                  gap-2
                  text-[11px]
                  text-white/60
                "
              >
                <Heart
                  size={13}
                  fill="currentColor"
                />

                Freshly baked with love, every single day.
              </div>
            </motion.div>

            {/* ==================================
                RIGHT CAKE IMAGE
            ================================== */}

            <div
              className="
                relative
                min-h-[420px]
                overflow-hidden
                lg:min-h-full
              "
            >
              {/* Background Circle */}
              <motion.div
                initial={{
                  scale: 0.7,
                  opacity: 0,
                }}
                whileInView={{
                  scale: 1,
                  opacity: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.8,
                }}
                className="
                  absolute
                  bottom-[-170px]
                  left-1/2
                  h-[600px]
                  w-[600px]
                  -translate-x-1/2
                  rounded-full
                  bg-[#a9283b]
                "
              />

              {/* Cake */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 60,
                  scale: 0.9,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.9,
                  delay: 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  absolute
                  bottom-0
                  left-1/2
                  h-[400px]
                  w-[400px]
                  -translate-x-1/2
                  sm:h-[470px]
                  sm:w-[470px]
                  lg:h-[500px]
                  lg:w-[500px]
                  xl:h-[550px]
                  xl:w-[550px]
                "
              >
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative h-full w-full"
                >
                  <Image
                    src="/images/home/hero-cake.webp"
                    alt="Celebration cake"
                    fill
                    sizes="(max-width: 768px) 400px, 550px"
                    className="object-contain object-bottom"
                  />
                </motion.div>
              </motion.div>

              {/* Floating badge */}
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: 0.7,
                  type: "spring",
                }}
                className="
                  absolute
                  right-[8%]
                  top-[15%]
                  flex
                  h-[90px]
                  w-[90px]
                  flex-col
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-center
                  shadow-[0_12px_35px_rgba(0,0,0,0.15)]
                "
              >
                <span
                  className="
                    font-serif
                    text-[18px]
                    font-bold
                    text-[#8f1728]
                  "
                >
                  100%
                </span>

                <span
                  className="
                    mt-1
                    text-[9px]
                    font-semibold
                    text-[#67534e]
                  "
                >
                  Eggless
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}