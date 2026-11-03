"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

/* =====================================================
   OCCASIONS DATA
===================================================== */

const occasions = [
  {
    id: 1,
    name: "Birthday",
    subtitle: "Make birthdays sweeter",
    image:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    name: "Anniversary",
    subtitle: "Celebrate your love",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "Wedding",
    subtitle: "For your beautiful day",
    image:
      "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "Baby Shower",
    subtitle: "Welcome little happiness",
    image:
      "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    name: "Engagement",
    subtitle: "Begin forever sweetly",
    image:
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    name: "Kids Birthday",
    subtitle: "Fun cakes for little stars",
    image:
      "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 7,
    name: "Corporate Event",
    subtitle: "Celebrate every milestone",
    image:
      "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 8,
    name: "Something Else",
    subtitle: "Tell us your special idea",
    image:
      "https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=900&q=85",
  },
];

/* =====================================================
   ANIMATION
===================================================== */

const containerVariants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
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

export default function CakeOccasions() {
  const handleOccasion = (occasion: string) => {
    /*
      Abhi form nahi bana hai.

      Next CustomCakeForm.tsx banne ke baad
      yahan selected occasion form me bhej sakte hain.
    */

    console.log("Selected occasion:", occasion);

    document
      .getElementById("custom-cake-form")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

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
        {/* =================================================
            TOP CONTENT
        ================================================== */}

        <div
          className="
            mb-9
            grid
            grid-cols-1
            gap-5
            border-b
            border-[#eadbd5]
            pb-7

            lg:grid-cols-2
            lg:items-end
          "
        >
          {/* LEFT */}

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
              amount: 0.3,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            {/* SMALL TITLE */}

            <div
              className="
                mb-3
                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  bg-[#f4e0e2]
                  text-[#9a1e2f]
                "
              >
                <Sparkles size={12} />
              </span>

              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[2.5px]
                  text-[#9a1e2f]

                  sm:text-[10px]
                "
              >
                Choose Your Occasion
              </p>
            </div>

            {/* HEADING */}

            <h2
              className="
                max-w-[620px]
                font-serif
                text-[34px]
                font-medium
                leading-[1.08]
                tracking-[-1px]
                text-[#281b18]

                sm:text-[42px]
                lg:text-[48px]
              "
            >
              What Are You{" "}
              <span className="italic text-[#9a1e2f]">
                Celebrating?
              </span>
            </h2>
          </motion.div>

          {/* RIGHT DESCRIPTION */}

          <motion.div
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
              amount: 0.3,
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            className="
              lg:flex
              lg:justify-end
            "
          >
            <p
              className="
                max-w-[480px]
                text-[12px]
                leading-6
                text-[#806e68]

                sm:text-[13px]

                lg:text-right
              "
            >
              Every celebration deserves its own cake.
              Choose your occasion and tell us how you want
              your special cake to look.
            </p>
          </motion.div>
        </div>

        {/* =================================================
            OCCASION GRID
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
            gap-4

            min-[500px]:grid-cols-2

            lg:grid-cols-4
          "
        >
          {occasions.map((occasion, index) => {
            /*
              First aur fifth cards ko thoda taller
              rakha hai taaki normal equal-card grid
              jaisa boring design na lage.
            */

            const largeCard =
              index === 0 || index === 5;

            return (
              <motion.button
                key={occasion.id}
                variants={cardVariants}
                type="button"
                onClick={() =>
                  handleOccasion(occasion.name)
                }
                whileHover={{
                  y: -6,
                }}
                className={`
                  group
                  relative
                  w-full
                  overflow-hidden
                  rounded-[24px]
                  bg-[#eee0db]
                  text-left
                  shadow-[0_8px_28px_rgba(70,30,30,0.06)]
                  transition-shadow
                  duration-300

                  hover:shadow-[0_18px_45px_rgba(70,30,30,0.14)]

                  ${
                    largeCard
                      ? "h-[330px] lg:h-[370px]"
                      : "h-[300px] lg:h-[330px]"
                  }
                `}
              >
                {/* =========================================
                    IMAGE
                ========================================== */}

                <Image
                  src={occasion.image}
                  alt={`${occasion.name} custom cake`}
                  fill
                  sizes="
                    (max-width: 500px) 100vw,
                    (max-width: 1024px) 50vw,
                    25vw
                  "
                  className="
                    object-cover
                    transition-transform
                    duration-700
                    ease-out

                    group-hover:scale-[1.08]
                  "
                />

                {/* DARK GRADIENT */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#1c0c0e]/85
                    via-black/15
                    to-transparent
                  "
                />

                {/* =========================================
                    NUMBER
                ========================================== */}

                <div
                  className="
                    absolute
                    left-4
                    top-4

                    flex
                    h-8
                    min-w-8
                    items-center
                    justify-center

                    rounded-full
                    border
                    border-white/25

                    bg-black/10

                    px-2

                    text-[9px]
                    font-semibold
                    text-white

                    backdrop-blur-md
                  "
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* =========================================
                    ARROW
                ========================================== */}

                <div
                  className="
                    absolute
                    right-4
                    top-4

                    flex
                    h-10
                    w-10
                    translate-y-2
                    items-center
                    justify-center

                    rounded-full

                    bg-white
                    text-[#9a1e2f]

                    opacity-0

                    shadow-lg

                    transition-all
                    duration-300

                    group-hover:translate-y-0
                    group-hover:opacity-100
                  "
                >
                  <ArrowUpRight size={16} />
                </div>

                {/* =========================================
                    CONTENT
                ========================================== */}

                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    z-10

                    p-5
                    sm:p-6
                  "
                >
                  {/* SMALL TEXT */}

                  <p
                    className="
                      mb-1.5

                      text-[8px]
                      font-bold
                      uppercase
                      tracking-[2px]
                      text-white/60
                    "
                  >
                    Custom Cake For
                  </p>

                  {/* NAME */}

                  <div
                    className="
                      flex
                      items-end
                      justify-between
                      gap-4
                    "
                  >
                    <div>
                      <h3
                        className="
                          font-serif
                          text-[22px]
                          font-semibold
                          text-white

                          sm:text-[24px]
                        "
                      >
                        {occasion.name}
                      </h3>

                      <p
                        className="
                          mt-1
                          text-[10px]
                          text-white/70

                          sm:text-[11px]
                        "
                      >
                        {occasion.subtitle}
                      </p>
                    </div>

                    {/* MOBILE ARROW */}

                    <span
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center

                        rounded-full

                        border
                        border-white/30

                        text-white

                        lg:hidden
                      "
                    >
                      <ArrowUpRight size={13} />
                    </span>
                  </div>

                  {/* HOVER LINE */}

                  <div
                    className="
                      mt-4
                      h-px
                      w-0
                      bg-white

                      transition-all
                      duration-500

                      group-hover:w-full
                    "
                  />
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* =================================================
            BOTTOM TEXT
        ================================================== */}

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
            duration: 0.5,
          }}
          className="
            mt-7
            flex
            flex-col
            gap-3
            rounded-[18px]
            border
            border-[#eadbd5]
            bg-[#f8efeb]
            px-5
            py-4

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p
            className="
              text-[10px]
              leading-5
              text-[#796761]

              sm:text-[11px]
            "
          >
            Can&apos;t find your occasion? No problem —
            choose{" "}
            <span className="font-semibold text-[#9a1e2f]">
              Something Else
            </span>{" "}
            and tell us your idea.
          </p>

          <button
            type="button"
            onClick={() =>
              handleOccasion("Something Else")
            }
            className="
              group
              flex
              shrink-0
              items-center
              gap-2

              text-[10px]
              font-bold
              text-[#9a1e2f]

              sm:text-[11px]
            "
          >
            Tell Us Your Idea

            <ArrowUpRight
              size={13}
              className="
                transition-transform
                duration-300

                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
              "
            />
          </button>
        </motion.div>
      </div>
    </section>
  );
}