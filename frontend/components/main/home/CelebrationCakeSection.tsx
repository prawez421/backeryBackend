"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  Sparkles,
  Heart,
} from "lucide-react";

export default function CelebrationCakeSection() {
  return (
    <section className="overflow-hidden bg-[#fff9f6] ">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-[#f0e0d1]
            bg-[#fff2d8]
          "
        >
          {/* Decorative background */}
          <div
            className="
              absolute
              -right-20
              -top-20
              h-[300px]
              w-[300px]
              rounded-full
              bg-[#f7dcae]/50
              blur-[2px]
            "
          />

          <div
            className="
              absolute
              -bottom-24
              left-[40%]
              h-[250px]
              w-[250px]
              rounded-full
              bg-white/40
              blur-[10px]
            "
          />

          <div className="relative z-10 grid min-h-[450px] grid-cols-1 lg:grid-cols-2">

            {/* ==============================
                LEFT IMAGE
            ============================== */}
            <motion.div
              initial={{
                opacity: 0,
                x: -70,
                scale: 0.94,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                relative
                min-h-[350px]
                overflow-hidden
                sm:min-h-[420px]
                lg:min-h-[500px]
              "
            >
              <Image
                src="/images/home/chocolate-cake.webp"
                alt="Custom celebration chocolate cake"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="
                  object-cover
                  transition-transform
                  duration-[1200ms]
                  hover:scale-105
                "
              />

              {/* Gradient */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-black/5
                  via-transparent
                  to-[#fff2d8]/20
                "
              />

              {/* Play button */}
              <motion.button
                type="button"
                aria-label="Watch celebration cake video"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.5,
                  type: "spring",
                  stiffness: 180,
                }}
                whileHover={{
                  scale: 1.12,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                className="
                  absolute
                  left-1/2
                  top-1/2
                  flex
                  h-[70px]
                  w-[70px]
                  -translate-x-1/2
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  border-[5px]
                  border-white/40
                  bg-white
                  text-[#8f1728]
                  shadow-[0_15px_40px_rgba(0,0,0,0.18)]
                "
              >
                <Play
                  size={23}
                  fill="currentColor"
                  className="ml-1"
                />
              </motion.button>

              {/* Small floating badge */}
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
                  delay: 0.6,
                  duration: 0.5,
                }}
                className="
                  absolute
                  bottom-5
                  left-5
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-white/95
                  px-4
                  py-2
                  text-[11px]
                  font-semibold
                  text-[#8f1728]
                  shadow-lg
                  backdrop-blur-md
                "
              >
                <Heart
                  size={13}
                  fill="currentColor"
                />

                Made for your moments
              </motion.div>
            </motion.div>

            {/* ==============================
                RIGHT CONTENT
            ============================== */}
            <motion.div
              initial={{
                opacity: 0,
                x: 60,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                flex
                flex-col
                justify-center
                px-7
                py-12
                sm:px-12
                lg:px-14
                xl:px-20
              "
            >
              {/* Small heading */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.3,
                  duration: 0.5,
                }}
                className="
                  mb-4
                  flex
                  items-center
                  gap-2
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[2.5px]
                  text-[#9a1e2f]
                "
              >
                <Sparkles size={14} />

                Watch & Enjoy
              </motion.div>

              {/* Heading */}
              <h2
                className="
                  max-w-[500px]
                  font-serif
                  text-[38px]
                  font-semibold
                  leading-[1.1]
                  tracking-[-1px]
                  text-[#261b18]
                  sm:text-[44px]
                  lg:text-[50px]
                "
              >
                Custom
                <br />

                <span className="italic text-[#9a1e2f]">
                  Celebration Cakes
                </span>
              </h2>

              {/* Description */}
              <p
                className="
                  mt-6
                  max-w-[470px]
                  text-[14px]
                  leading-7
                  text-[#73625c]
                "
              >
                Unique designs for birthdays, weddings, anniversaries
                and every special occasion. Tell us your idea and
                we&apos;ll turn it into something delicious.
              </p>

              {/* Small features */}
              <div className="mt-7 flex flex-wrap gap-3">
                {[
                  "100% Eggless",
                  "Custom Design",
                  "Freshly Baked",
                ].map((feature) => (
                  <span
                    key={feature}
                    className="
                      rounded-full
                      border
                      border-[#e8cfae]
                      bg-white/60
                      px-4
                      py-2
                      text-[10px]
                      font-semibold
                      text-[#76584d]
                    "
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Button */}
              <div className="mt-8">
                <Link
                  href="/custom-cakes"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-[#8f1728]
                    px-7
                    py-3.5
                    text-[13px]
                    font-semibold
                    text-white
                    shadow-[0_10px_25px_rgba(143,23,40,0.18)]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-[#761221]
                  "
                >
                  See Collection

                  <ArrowRight
                    size={15}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}