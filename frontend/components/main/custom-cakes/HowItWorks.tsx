"use client";

import { motion } from "framer-motion";
import {
  CalendarHeart,
  Palette,
  Send,
  MessageCircleMore,
  ChefHat,
  PackageCheck,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Choose Occasion",
    description:
      "Tell us what you're celebrating — birthday, wedding, anniversary or any special moment.",
    icon: CalendarHeart,
  },
  {
    number: "02",
    title: "Customize Your Cake",
    description:
      "Choose your flavour, weight, shape, colours, theme and personal cake message.",
    icon: Palette,
  },
  {
    number: "03",
    title: "Send Your Request",
    description:
      "Share your cake idea and upload a reference design if you already have one.",
    icon: Send,
  },
  {
    number: "04",
    title: "We Confirm",
    description:
      "Our team reviews your request and confirms the design, availability and final price.",
    icon: MessageCircleMore,
  },
  {
    number: "05",
    title: "Freshly Baked",
    description:
      "Your custom cake is freshly baked, decorated and prepared with attention to every detail.",
    icon: ChefHat,
  },
  {
    number: "06",
    title: "Pickup or Delivery",
    description:
      "Collect your cake from Alibros Bakery or choose delivery for your special celebration.",
    icon: PackageCheck,
  },
];

export default function HowItWorks() {
  const scrollToForm = () => {
    document
      .getElementById("custom-cake-form")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

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
      {/* =========================================
          DECORATION
      ========================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-[220px]
          top-[100px]
          h-[450px]
          w-[450px]
          rounded-full
          bg-[#f4e5e1]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-[180px]
          bottom-[40px]
          h-[380px]
          w-[380px]
          rounded-full
          border
          border-[#ead6d0]
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1400px]
          px-5
          sm:px-8
          lg:px-12
        "
      >
        {/* =========================================
            TOP
        ========================================== */}

        <div
          className="
            mb-12
            grid
            grid-cols-1
            gap-6

            lg:grid-cols-[1fr_420px]
            lg:items-end
          "
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[3px]
                text-[#9a1e2f]
              "
            >
              How It Works
            </p>

            <h2
              className="
                mt-3
                max-w-[650px]
                font-serif
                text-[35px]
                font-medium
                leading-[1.08]
                tracking-[-1px]
                text-[#281a17]

                sm:text-[43px]
                lg:text-[50px]
              "
            >
              Your Dream Cake,
              <br />

              <span className="italic text-[#9a1e2f]">
                Made Simple.
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            className="
              max-w-[420px]
              text-[11px]
              leading-[1.9]
              text-[#806d67]

              sm:text-[12px]
            "
          >
            From your first idea to the final celebration,
            creating a custom cake with Alibros Bakery is
            simple and stress-free.
          </motion.p>
        </div>

        {/* =========================================
            STEPS
        ========================================== */}

        <div
          className="
            grid
            grid-cols-1
            overflow-hidden
            rounded-[28px]
            border
            border-[#ead8d2]
            bg-white

            md:grid-cols-2
            lg:grid-cols-3
          "
        >
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
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
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.07,
                }}
                className="
                  group
                  relative
                  min-h-[250px]
                  overflow-hidden
                  border-b
                  border-[#ead8d2]
                  p-6

                  sm:p-7

                  md:border-r

                  lg:min-h-[270px]
                  lg:p-8

                  [&:nth-child(2n)]:md:border-r-0
                  [&:nth-child(3n)]:lg:border-r-0

                  [&:nth-last-child(-n+2)]:md:border-b-0
                  [&:nth-last-child(-n+3)]:lg:border-b-0

                  transition-colors
                  duration-300
                  hover:bg-[#f9efeb]
                "
              >
                {/* HUGE BACKGROUND NUMBER */}

                <span
                  className="
                    pointer-events-none
                    absolute
                    -right-2
                    -top-7

                    font-serif
                    text-[100px]
                    font-bold
                    leading-none
                    text-[#9a1e2f]/[0.045]

                    transition-all
                    duration-500

                    group-hover:-translate-x-2
                    group-hover:text-[#9a1e2f]/[0.08]

                    lg:text-[120px]
                  "
                >
                  {step.number}
                </span>

                {/* ICON */}

                <div
                  className="
                    relative
                    z-10
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#e5cbc5]
                    bg-[#fff8f5]
                    text-[#9a1e2f]

                    transition-all
                    duration-300

                    group-hover:border-[#9a1e2f]
                    group-hover:bg-[#9a1e2f]
                    group-hover:text-white
                  "
                >
                  <Icon
                    size={17}
                    strokeWidth={1.7}
                  />
                </div>

                {/* STEP LABEL */}

                <p
                  className="
                    relative
                    z-10
                    mt-7
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[2px]
                    text-[#b28d85]
                  "
                >
                  Step {step.number}
                </p>

                {/* TITLE */}

                <h3
                  className="
                    relative
                    z-10
                    mt-2
                    font-serif
                    text-[21px]
                    font-semibold
                    text-[#35231f]

                    lg:text-[23px]
                  "
                >
                  {step.title}
                </h3>

                {/* DESCRIPTION */}

                <p
                  className="
                    relative
                    z-10
                    mt-3
                    max-w-[320px]
                    text-[10px]
                    leading-[1.8]
                    text-[#806d67]

                    lg:text-[11px]
                  "
                >
                  {step.description}
                </p>

                {/* BOTTOM LINE */}

                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-[3px]
                    w-0
                    bg-[#9a1e2f]

                    transition-all
                    duration-500

                    group-hover:w-full
                  "
                />
              </motion.div>
            );
          })}
        </div>

        {/* =========================================
            BOTTOM CTA
        ========================================== */}

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
            duration: 0.6,
          }}
          className="
            mt-8
            flex
            flex-col
            gap-5
            rounded-[22px]
            bg-[#281a17]
            px-6
            py-6

            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-8
          "
        >
          <div>
            <p
              className="
                text-[8px]
                font-bold
                uppercase
                tracking-[2px]
                text-[#e0a5a3]
              "
            >
              Ready To Create?
            </p>

            <h3
              className="
                mt-1
                font-serif
                text-[21px]
                font-medium
                text-white

                sm:text-[24px]
              "
            >
              Let&apos;s make your celebration sweeter.
            </h3>
          </div>

          <button
            type="button"
            onClick={scrollToForm}
            className="
              group
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-full
              bg-[#9a1e2f]
              px-6
              py-3.5
              text-[10px]
              font-semibold
              text-white

              transition-all
              duration-300

              hover:-translate-y-0.5
              hover:bg-[#b32b40]

              sm:w-auto
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
        </motion.div>
      </div>
    </section>
  );
}