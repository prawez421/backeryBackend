"use client";

import { motion } from "framer-motion";

import {
  Wheat,
  CookingPot,
  ChefHat,
  CakeSlice,
  BadgeCheck,
  PackageCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

/* =====================================================
   PROCESS DATA
===================================================== */

const processSteps = [
  {
    id: 1,
    number: "01",
    title: "Choose Ingredients",
    shortTitle: "Ingredients",
    description:
      "Every bake begins with carefully selected ingredients for better taste, texture and freshness.",
    icon: Wheat,
  },
  {
    id: 2,
    number: "02",
    title: "Prepare With Care",
    shortTitle: "Prepare",
    description:
      "Ingredients are measured, mixed and prepared carefully according to each recipe.",
    icon: CookingPot,
  },
  {
    id: 3,
    number: "03",
    title: "Bake Fresh",
    shortTitle: "Bake",
    description:
      "Our cakes, breads, cookies and other treats are baked with attention to timing and texture.",
    icon: ChefHat,
  },
  {
    id: 4,
    number: "04",
    title: "Decorate & Finish",
    shortTitle: "Decorate",
    description:
      "Each product receives its finishing touches, from simple toppings to detailed cake decoration.",
    icon: CakeSlice,
  },
  {
    id: 5,
    number: "05",
    title: "Quality Check",
    shortTitle: "Check",
    description:
      "Before an order is ready, we check its presentation, finishing and overall quality.",
    icon: BadgeCheck,
  },
  {
    id: 6,
    number: "06",
    title: "Ready For You",
    shortTitle: "Ready",
    description:
      "Your freshly prepared order is packed carefully and made ready for pickup or delivery.",
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
      staggerChildren: 0.12,
    },
  },
};

const stepVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.55,
      ease: "easeOut" as const,
    },
  },
};

/* =====================================================
   COMPONENT
===================================================== */

export default function OurProcess() {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#F5E9E5]
        py-14
        sm:py-16
        lg:py-20
      "
    >
      {/* =================================================
          BACKGROUND DECORATION
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-[220px]
          -top-[250px]
          h-[520px]
          w-[520px]
          rounded-full
          border
          border-[#9a1e2f]/[0.06]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-[280px]
          -right-[180px]
          h-[560px]
          w-[560px]
          rounded-full
          border
          border-[#9a1e2f]/[0.06]
        "
      />

      {/* SOFT CENTER CIRCLE */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[420px]
          w-[420px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#ead4cf]/30
          blur-[100px]
        "
      />

      {/* =================================================
          MAIN CONTAINER
      ================================================== */}

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
        {/* =================================================
            HEADING
        ================================================== */}

        <motion.div
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
            amount: 0.3,
          }}
          transition={{
            duration: 0.6,
          }}
          className="
            mx-auto
            mb-12
            max-w-[720px]
            text-center
          "
        >
          {/* LABEL */}

          <div
            className="
              mb-4
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#dcbdb7]
              bg-[#fffaf7]/70
              px-4
              py-2
            "
          >
            <Sparkles
              size={12}
              className="text-[#9a1e2f]"
            />

            <span
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[2.5px]
                text-[#9a1e2f]
              "
            >
              Behind Every Bake
            </span>
          </div>

          {/* TITLE */}

          <h2
            className="
              font-serif
              text-[35px]
              font-medium
              leading-[1.08]
              tracking-[-1px]
              text-[#2f211d]

              sm:text-[43px]
              lg:text-[50px]
            "
          >
            From Ingredients To
            <br />

            <span className="italic text-[#9a1e2f]">
              Something Delicious.
            </span>
          </h2>

          {/* SMALL LINE */}

          <div
            className="
              mx-auto
              mt-5
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <span className="h-px w-7 bg-[#9a1e2f]/35" />

            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#9a1e2f]
              "
            />

            <span className="h-px w-7 bg-[#9a1e2f]/35" />
          </div>

          {/* DESCRIPTION */}

          <p
            className="
              mx-auto
              mt-4
              max-w-[560px]
              text-[11px]
              leading-6
              text-[#75615b]

              sm:text-[12px]
            "
          >
            Every Alibros Bakery creation follows a simple
            journey — thoughtful preparation, fresh baking,
            careful finishing and a final quality check.
          </p>
        </motion.div>

        {/* =================================================
            DESKTOP / TABLET PROCESS
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
            relative
            hidden
            grid-cols-3
            gap-x-5
            gap-y-12

            md:grid
            xl:grid-cols-6
          "
        >
          {/* BASE LINE */}

          <div
            className="
              absolute
              left-[7%]
              right-[7%]
              top-[39px]
              hidden
              h-px
              bg-[#cfaaa3]

              xl:block
            "
          />

          {/* ANIMATED LINE */}

          <motion.div
            initial={{
              scaleX: 0,
            }}
            whileInView={{
              scaleX: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 1.4,
              ease: "easeOut",
            }}
            style={{
              transformOrigin: "left",
            }}
            className="
              absolute
              left-[7%]
              right-[7%]
              top-[39px]
              hidden
              h-px
              bg-[#9a1e2f]

              xl:block
            "
          />

          {/* STEPS */}

          {processSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.id}
                variants={stepVariants}
                className="
                  group
                  relative
                  text-center
                "
              >
                {/* =====================================
                    ICON CIRCLE
                ====================================== */}

                <div
                  className="
                    relative
                    z-20
                    mx-auto

                    flex
                    h-[78px]
                    w-[78px]
                    items-center
                    justify-center

                    rounded-full

                    border
                    border-[#dfcbc5]

                    bg-[#fffaf7]

                    shadow-[0_12px_35px_rgba(90,50,40,0.07)]

                    transition-all
                    duration-300

                    group-hover:-translate-y-2
                    group-hover:border-[#9a1e2f]
                    group-hover:bg-[#9a1e2f]

                    group-hover:shadow-[0_15px_35px_rgba(154,30,47,0.15)]
                  "
                >
                  <Icon
                    size={23}
                    strokeWidth={1.6}
                    className="
                      text-[#9a1e2f]

                      transition-all
                      duration-300

                      group-hover:scale-110
                      group-hover:text-white
                    "
                  />

                  {/* NUMBER */}

                  <span
                    className="
                      absolute
                      -right-1
                      -top-1

                      flex
                      h-6
                      min-w-6
                      items-center
                      justify-center

                      rounded-full

                      border
                      border-[#e2c8c2]

                      bg-[#2f211d]

                      px-1

                      text-[7px]
                      font-bold
                      text-white

                      shadow-[0_3px_10px_rgba(60,30,20,0.15)]
                    "
                  >
                    {step.number}
                  </span>
                </div>

                {/* =====================================
                    CONTENT
                ====================================== */}

                <div className="mt-6">
                  <span
                    className="
                      text-[7px]
                      font-bold
                      uppercase
                      tracking-[2px]
                      text-[#a06f66]
                    "
                  >
                    Step {step.number}
                  </span>

                  <h3
                    className="
                      mt-2
                      font-serif
                      text-[18px]
                      font-semibold
                      text-[#35231f]

                      transition-colors
                      duration-300

                      group-hover:text-[#9a1e2f]

                      lg:text-[19px]
                    "
                  >
                    {step.title}
                  </h3>

                  <p
                    className="
                      mx-auto
                      mt-2
                      max-w-[220px]

                      text-[9px]
                      leading-[1.8]
                      text-[#806d67]

                      lg:text-[10px]
                    "
                  >
                    {step.description}
                  </p>
                </div>

                {/* ARROW */}

                {index !== processSteps.length - 1 && (
                  <ArrowRight
                    size={13}
                    className="
                      absolute
                      -right-[13px]
                      top-[33px]

                      hidden
                      text-[#ad766d]

                      xl:block
                    "
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* =================================================
            MOBILE PROCESS
        ================================================== */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.05,
          }}
          className="
            relative
            md:hidden
          "
        >
          {/* VERTICAL LINE */}

          <div
            className="
              absolute
              bottom-[40px]
              left-[25px]
              top-[40px]
              w-px
              bg-[#cfaaa3]
            "
          />

          {processSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.id}
                variants={stepVariants}
                className={`
                  relative
                  flex
                  gap-4

                  ${
                    index !== processSteps.length - 1
                      ? "pb-7"
                      : ""
                  }
                `}
              >
                {/* MOBILE ICON */}

                <div
                  className="
                    relative
                    z-20

                    flex
                    h-[51px]
                    w-[51px]
                    shrink-0
                    items-center
                    justify-center

                    rounded-full

                    border
                    border-[#dcbdb7]

                    bg-[#fffaf7]

                    text-[#9a1e2f]

                    shadow-[0_8px_20px_rgba(90,50,40,0.08)]
                  "
                >
                  <Icon
                    size={18}
                    strokeWidth={1.6}
                  />

                  <span
                    className="
                      absolute
                      -right-1
                      -top-1

                      flex
                      h-[18px]
                      min-w-[18px]
                      items-center
                      justify-center

                      rounded-full

                      bg-[#9a1e2f]

                      px-1

                      text-[6px]
                      font-bold
                      text-white
                    "
                  >
                    {step.number}
                  </span>
                </div>

                {/* MOBILE CARD */}

                <div
                  className="
                    flex-1

                    rounded-[18px]

                    border
                    border-[#dfcbc5]

                    bg-[#fffaf7]/80

                    p-4

                    shadow-[0_8px_25px_rgba(80,40,30,0.05)]
                  "
                >
                  <span
                    className="
                      text-[7px]
                      font-bold
                      uppercase
                      tracking-[2px]
                      text-[#9a1e2f]
                    "
                  >
                    {step.shortTitle}
                  </span>

                  <h3
                    className="
                      mt-1.5
                      font-serif
                      text-[18px]
                      font-semibold
                      text-[#35231f]
                    "
                  >
                    {step.title}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-[9px]
                      leading-[1.8]
                      text-[#806d67]
                    "
                  >
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* =================================================
            BOTTOM BRAND MESSAGE
        ================================================== */}

        <motion.div
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
            duration: 0.55,
            delay: 0.2,
          }}
          className="
            mt-12
            overflow-hidden

            rounded-[24px]

            border
            border-[#dfcbc5]

            bg-[#fffaf7]/75

            shadow-[0_15px_40px_rgba(80,40,30,0.05)]
          "
        >
          <div
            className="
              flex
              flex-col
              gap-6

              px-6
              py-6

              sm:px-8

              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            {/* =====================================
                LEFT MESSAGE
            ====================================== */}

            <div
              className="
                flex
                items-start
                gap-4
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

                  bg-[#9a1e2f]

                  text-white

                  shadow-[0_8px_20px_rgba(154,30,47,0.15)]
                "
              >
                <CakeSlice
                  size={18}
                  strokeWidth={1.6}
                />
              </div>

              {/* TEXT */}

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
                  Our Simple Philosophy
                </p>

                <h3
                  className="
                    mt-1
                    font-serif
                    text-[19px]
                    font-medium
                    text-[#35231f]

                    sm:text-[22px]
                  "
                >
                  Care in every step.

                  <span className="italic text-[#9a1e2f]">
                    {" "}
                    Joy in every bite.
                  </span>
                </h3>
              </div>
            </div>

            {/* =====================================
                MINI PROCESS
            ====================================== */}

            <div
              className="
                flex
                max-w-full
                items-center
                gap-2
                overflow-x-auto

                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              {["Mix", "Bake", "Finish", "Enjoy"].map(
                (item, index) => (
                  <div
                    key={item}
                    className="
                      flex
                      shrink-0
                      items-center
                      gap-2
                    "
                  >
                    <span
                      className="
                        rounded-full

                        border
                        border-[#ddc4be]

                        bg-[#F5E9E5]

                        px-3
                        py-2

                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[1px]
                        text-[#725c56]

                        transition-all
                        duration-300

                        hover:border-[#9a1e2f]
                        hover:bg-[#9a1e2f]
                        hover:text-white
                      "
                    >
                      {item}
                    </span>

                    {index !== 3 && (
                      <ArrowRight
                        size={10}
                        className="text-[#9a1e2f]/60"
                      />
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}