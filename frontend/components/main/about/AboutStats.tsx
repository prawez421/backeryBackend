"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  CakeSlice,
  ChefHat,
  Grid2X2,
  Heart,
  Sparkles,
} from "lucide-react";

/* =====================================================
   STATS DATA
===================================================== */

const stats = [
  {
    id: 1,
    value: 8,
    suffix: "",
    label: "Product Categories",
    description:
      "Cakes, pastries, cupcakes, cookies, breads, desserts, snacks and more.",
    icon: Grid2X2,
  },
  {
    id: 2,
    value: 7,
    suffix: "+",
    label: "Cake Collections",
    description:
      "Birthday, anniversary, wedding, chocolate, photo, designer and bento cakes.",
    icon: CakeSlice,
  },
  {
    id: 3,
    value: 6,
    suffix: "",
    label: "Baking Steps",
    description:
      "From choosing ingredients to preparation, baking, finishing and quality checking.",
    icon: ChefHat,
  },
  {
    id: 4,
    value: 100,
    suffix: "%",
    label: "Made With Care",
    description:
      "Thoughtful preparation and attention to detail throughout the baking process.",
    icon: Heart,
  },
];

/* =====================================================
   COUNTER COMPONENT
===================================================== */

function Counter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const element = counterRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) {
          return;
        }

        startedRef.current = true;

        const duration = 1400;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
          const progress = Math.min(
            (currentTime - startTime) / duration,
            1
          );

          /* smooth easing */
          const easedProgress =
            1 - Math.pow(1 - progress, 3);

          const currentValue = Math.round(
            value * easedProgress
          );

          setCount(currentValue);

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);

        observer.disconnect();
      },
      {
        threshold: 0.35,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [value]);

  return (
    <span ref={counterRef}>
      {count}
      {suffix}
    </span>
  );
}

/* =====================================================
   ANIMATION
===================================================== */

const containerVariants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
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
   MAIN COMPONENT
===================================================== */

export default function AboutStats() {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#f7efeb]
        py-14
        sm:py-16
        lg:py-20
      "
    >
      {/* ==========================================
          BACKGROUND DECORATION
      =========================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-[180px]
          -top-[200px]
          h-[420px]
          w-[420px]
          rounded-full
          border
          border-[#9a1e2f]/[0.06]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-[220px]
          right-[-170px]
          h-[450px]
          w-[450px]
          rounded-full
          border
          border-[#9a1e2f]/[0.06]
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
            mb-10
            max-w-[680px]
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
              border-[#e4d0ca]

              bg-white/70

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
              Alibros At A Glance
            </span>
          </div>

          {/* HEADING */}

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
            More Than Just
            <br />

            <span className="italic text-[#9a1e2f]">
              Something Sweet.
            </span>
          </h2>

          {/* DESCRIPTION */}

          <p
            className="
              mx-auto
              mt-4
              max-w-[540px]

              text-[11px]
              leading-6
              text-[#806c66]

              sm:text-[12px]
            "
          >
            A quick look at the variety, creativity and
            thoughtful process behind the Alibros Bakery
            experience.
          </p>
        </motion.div>

        {/* =================================================
            STATS
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
            grid
            grid-cols-1
            overflow-hidden

            rounded-[28px]

            border
            border-[#e6d5cf]

            bg-[#fffdfb]

            shadow-[0_15px_45px_rgba(70,30,30,0.06)]

            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.id}
                variants={cardVariants}
                className={`
                  group
                  relative

                  min-h-[290px]

                  overflow-hidden

                  px-6
                  py-7

                  sm:px-7
                  sm:py-8

                  ${
                    index !== stats.length - 1
                      ? "lg:border-r lg:border-[#eadbd5]"
                      : ""
                  }

                  ${
                    index < 2
                      ? "sm:border-b sm:border-[#eadbd5] lg:border-b-0"
                      : ""
                  }

                  ${
                    index % 2 === 0
                      ? "sm:border-r sm:border-[#eadbd5]"
                      : ""
                  }

                  lg:border-b-0
                `}
              >
                {/* =====================================
                    LARGE BACKGROUND NUMBER
                ====================================== */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -bottom-[25px]
                    -right-[5px]

                    font-serif
                    text-[115px]
                    font-semibold
                    leading-none

                    text-[#9a1e2f]/[0.035]

                    transition-all
                    duration-500

                    group-hover:-translate-x-2
                    group-hover:-translate-y-2
                    group-hover:text-[#9a1e2f]/[0.06]
                  "
                >
                  {stat.value}
                </div>

                {/* =====================================
                    TOP
                ====================================== */}

                <div
                  className="
                    relative
                    z-10
                    flex
                    items-center
                    justify-between
                  "
                >
                  {/* ICON */}

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center

                      rounded-[14px]

                      bg-[#f4e1e1]

                      text-[#9a1e2f]

                      transition-all
                      duration-300

                      group-hover:-rotate-3
                      group-hover:bg-[#9a1e2f]
                      group-hover:text-white
                    "
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.7}
                    />
                  </div>

                  {/* NUMBER */}

                  <span
                    className="
                      text-[8px]
                      font-bold
                      tracking-[1.5px]
                      text-[#b29a94]
                    "
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* =====================================
                    COUNTER
                ====================================== */}

                <div
                  className="
                    relative
                    z-10
                    mt-7

                    font-serif
                    text-[50px]
                    font-medium
                    leading-none
                    tracking-[-2px]

                    text-[#281b18]

                    sm:text-[55px]
                    lg:text-[58px]
                  "
                >
                  <Counter
                    value={stat.value}
                    suffix={stat.suffix}
                  />
                </div>

                {/* LABEL */}

                <h3
                  className="
                    relative
                    z-10
                    mt-3

                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[1.5px]

                    text-[#9a1e2f]
                  "
                >
                  {stat.label}
                </h3>

                {/* DESCRIPTION */}

                <p
                  className="
                    relative
                    z-10

                    mt-3
                    max-w-[270px]

                    text-[9px]
                    leading-[1.8]

                    text-[#86736d]

                    sm:text-[10px]
                  "
                >
                  {stat.description}
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
        </motion.div>

        {/* =================================================
            BOTTOM MESSAGE
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
            duration: 0.55,
          }}
          className="
            mt-6

            flex
            flex-col
            gap-4

            rounded-[20px]

            bg-[#9a1e2f]

            px-6
            py-5

            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-8
          "
        >
          {/* LEFT */}

          <div
            className="
              flex
              items-center
              gap-4
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center

                rounded-full

                bg-white/10

                text-white
              "
            >
              <Heart
                size={16}
                strokeWidth={1.7}
              />
            </div>

            <div>
              <p
                className="
                  text-[7px]
                  font-bold
                  uppercase
                  tracking-[2px]
                  text-white/55
                "
              >
                What Really Matters
              </p>

              <p
                className="
                  mt-1
                  font-serif
                  text-[17px]
                  font-medium
                  text-white

                  sm:text-[20px]
                "
              >
                Every bake should feel{" "}

                <span className="italic text-[#ffd0cd]">
                  worth sharing.
                </span>
              </p>
            </div>
          </div>

          {/* RIGHT */}

          <div
            className="
              flex
              items-center
              gap-2

              text-[8px]
              font-bold
              uppercase
              tracking-[2px]

              text-white/60
            "
          >
            <CakeSlice size={13} />

            Alibros Bakery
          </div>
        </motion.div>
      </div>
    </section>
  );
}