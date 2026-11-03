"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  PackageCheck,
  Truck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const features = [
  {
    id: 1,
    title: "Safe Packaging",
    description: "Carefully packed",
    icon: PackageCheck,
  },
  {
    id: 2,
    title: "On-time Delivery",
    description: "Fresh at your door",
    icon: Truck,
  },
  {
    id: 3,
    title: "Hygienic & Fresh",
    description: "Made with care",
    icon: ShieldCheck,
  },
];

export default function FreshDeliverySection() {
  return (
    <section className="overflow-hidden bg-[#fff9f6] py-5 lg:py-5">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-[#e7e0f1]
            bg-[#f0ebfa]
          "
        >
          {/* Decorative backgrounds */}
          <div
            className="
              absolute
              -left-[100px]
              -top-[100px]
              h-[320px]
              w-[320px]
              rounded-full
              bg-white/40
            "
          />

          <div
            className="
              absolute
              -bottom-[160px]
              right-[15%]
              h-[400px]
              w-[400px]
              rounded-full
              bg-[#ded4f2]/60
              blur-[10px]
            "
          />

          <div
            className="
              relative
              z-10
              grid
              min-h-[520px]
              grid-cols-1
              lg:grid-cols-[0.9fr_1.1fr]
            "
          >
            {/* ==============================
                LEFT CONTENT
            ============================== */}

            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                flex
                flex-col
                justify-center
                px-7
                py-14
                sm:px-12
                lg:px-14
                xl:px-20
              "
            >
              {/* Small title */}
              <div
                className="
                  mb-4
                  flex
                  items-center
                  gap-2
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[2.5px]
                  text-[#8f1728]
                "
              >
                <Sparkles size={14} />

                Freshly Baked
              </div>

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
                Made Daily,
                <br />

                <span className="italic text-[#8f1728]">
                  Delivered with Care
                </span>
              </h2>

              {/* Description */}
              <p
                className="
                  mt-6
                  max-w-[470px]
                  text-[14px]
                  leading-7
                  text-[#71676f]
                "
              >
                We bake fresh every day using quality ingredients and
                deliver every order with love and care directly to your
                doorstep.
              </p>

              {/* ==============================
                  FEATURES
              ============================== */}

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.12,
                    },
                  },
                }}
                className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3"
              >
                {features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <motion.div
                      key={feature.id}
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: 20,
                        },

                        visible: {
                          opacity: 1,
                          y: 0,

                          transition: {
                            duration: 0.5,
                          },
                        },
                      }}
                      whileHover={{
                        y: -5,
                      }}
                      className="
                        group
                        rounded-[18px]
                        border
                        border-white/70
                        bg-white/65
                        p-4
                        shadow-[0_8px_25px_rgba(60,40,80,0.05)]
                        backdrop-blur-sm
                      "
                    >
                      <div
                        className="
                          mb-3
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-full
                          bg-[#f9e8eb]
                          text-[#8f1728]
                          transition-all
                          duration-300
                          group-hover:bg-[#8f1728]
                          group-hover:text-white
                        "
                      >
                        <Icon
                          size={18}
                          strokeWidth={1.7}
                        />
                      </div>

                      <h3
                        className="
                          text-[12px]
                          font-bold
                          text-[#2b2220]
                        "
                      >
                        {feature.title}
                      </h3>

                      <p
                        className="
                          mt-1
                          text-[10px]
                          text-[#80747b]
                        "
                      >
                        {feature.description}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* ==============================
                RIGHT IMAGE
            ============================== */}

            <div
              className="
                relative
                min-h-[450px]
                overflow-hidden
                lg:min-h-full
              "
            >
              {/* Background circle */}
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.7,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                }}
                className="
                  absolute
                  bottom-[-130px]
                  left-1/2
                  h-[570px]
                  w-[570px]
                  -translate-x-1/2
                  rounded-full
                  bg-[#e4dcf4]
                "
              />

              {/* dotted decoration */}
              <div
                className="
                  absolute
                  right-[12%]
                  top-[15%]
                  grid
                  grid-cols-4
                  gap-2
                  opacity-40
                "
              >
                {Array.from({ length: 16 }).map((_, index) => (
                  <span
                    key={index}
                    className="
                      h-[4px]
                      w-[4px]
                      rounded-full
                      bg-[#8f1728]
                    "
                  />
                ))}
              </div>

              {/* Delivery Image */}
              <motion.div
                initial={{
                  opacity: 0,
                  x: 70,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  absolute
                  bottom-0
                  left-1/2
                  h-[430px]
                  w-[430px]
                  -translate-x-1/2
                  sm:h-[500px]
                  sm:w-[500px]
                  lg:h-[520px]
                  lg:w-[520px]
                  xl:h-[570px]
                  xl:w-[570px]
                "
              >
                <motion.div
                  animate={{
                    y: [0, -7, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative h-full w-full"
                >
                  <Image
                    src="/images/home/delivery-person.webp"
                    alt="Fresh bakery delivery"
                    fill
                    sizes="(max-width: 768px) 430px, 570px"
                    className="object-contain object-bottom"
                  />
                </motion.div>
              </motion.div>

              {/* Floating Fresh Badge */}
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.6,
                  type: "spring",
                }}
                className="
                  absolute
                  left-[8%]
                  top-[20%]
                  rounded-[18px]
                  bg-white
                  px-5
                  py-3
                  shadow-[0_12px_35px_rgba(60,40,80,0.12)]
                "
              >
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[1px]
                    text-[#8b7d88]
                  "
                >
                  Today&apos;s Bake
                </p>

                <p
                  className="
                    mt-1
                    font-serif
                    text-[18px]
                    font-bold
                    text-[#8f1728]
                  "
                >
                  100% Fresh
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}