"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Heart,
  Images,
  Sparkles,
} from "lucide-react";

/* =====================================================
   GALLERY DATA
===================================================== */

const cakeDesigns = [
  {
    id: 1,
    name: "Floral Elegance",
    category: "Wedding",
    image:
      "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=900&q=85",
    height: "h-[360px] lg:h-[430px]",
  },
  {
    id: 2,
    name: "Chocolate Dream",
    category: "Birthday",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
    height: "h-[280px] lg:h-[310px]",
  },
  {
    id: 3,
    name: "Sweet Celebration",
    category: "Anniversary",
    image:
      "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=900&q=85",
    height: "h-[330px] lg:h-[370px]",
  },
  {
    id: 4,
    name: "Birthday Magic",
    category: "Birthday",
    image:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=85",
    height: "h-[290px] lg:h-[320px]",
  },
  {
    id: 5,
    name: "Minimal Beauty",
    category: "Designer",
    image:
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=85",
    height: "h-[360px] lg:h-[420px]",
  },
  {
    id: 6,
    name: "Kids Celebration",
    category: "Kids",
    image:
      "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=900&q=85",
    height: "h-[300px] lg:h-[340px]",
  },
  {
    id: 7,
    name: "Luxury Chocolate",
    category: "Chocolate",
    image:
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=900&q=85",
    height: "h-[350px] lg:h-[400px]",
  },
  {
    id: 8,
    name: "Romantic Red Velvet",
    category: "Anniversary",
    image:
      "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=900&q=85",
    height: "h-[280px] lg:h-[320px]",
  },
];

/* =====================================================
   ANIMATIONS
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

export default function CakeDesignGallery() {
  const selectDesign = (design: string) => {
    console.log("Selected cake design:", design);

    document
      .getElementById("custom-cake-form")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <section
      id="design-gallery"
      className="
        overflow-hidden
        bg-[#fffaf7]
        py-12
        sm:py-16
        lg:py-20
      "
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">

        {/* =================================================
            HEADING
        ================================================== */}

        <div
          className="
            mb-10
            grid
            grid-cols-1
            gap-6
            lg:grid-cols-[1fr_420px]
            lg:items-end
          "
        >
          {/* LEFT */}

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
              amount: 0.3,
            }}
            transition={{
              duration: 0.6,
            }}
          >
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
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-[#f4e0e2]
                  text-[#9a1e2f]
                "
              >
                <Images size={14} />
              </span>

              <span
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[2.5px]
                  text-[#9a1e2f]
                  sm:text-[10px]
                "
              >
                Cake Inspiration
              </span>
            </div>

            <h2
              className="
                max-w-[650px]
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
              Find A Design You{" "}
              <span className="italic text-[#9a1e2f]">
                Love.
              </span>
            </h2>
          </motion.div>

          {/* RIGHT */}

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
          >
            <p
              className="
                text-[12px]
                leading-6
                text-[#806d67]
                sm:text-[13px]
              "
            >
              Browse some cake inspiration for your
              celebration. Like a design? Select it and
              share your own colours, flavour and
              customization with us.
            </p>
          </motion.div>
        </div>

        {/* =================================================
            TOP DIVIDER
        ================================================== */}

        <div className="mb-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#eadbd5]" />

          <div
            className="
              flex
              items-center
              gap-2
              text-[9px]
              font-semibold
              uppercase
              tracking-[2px]
              text-[#9f8982]
            "
          >
            <Sparkles
              size={11}
              className="text-[#9a1e2f]"
            />

            Alibros Inspirations
          </div>

          <div className="h-px flex-1 bg-[#eadbd5]" />
        </div>

        {/* =================================================
            MASONRY GALLERY
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
            columns-1
            gap-4
            sm:columns-2
            lg:columns-3
            xl:columns-4
          "
        >
          {cakeDesigns.map((cake, index) => (
            <motion.div
              key={cake.id}
              variants={cardVariants}
              className="
                mb-4
                break-inside-avoid
              "
            >
              <button
                type="button"
                onClick={() => selectDesign(cake.name)}
                className="
                  group
                  relative
                  block
                  w-full
                  overflow-hidden
                  rounded-[22px]
                  bg-[#eee1dc]
                  text-left
                  shadow-[0_8px_25px_rgba(70,30,30,0.06)]
                "
              >
                {/* =========================================
                    IMAGE
                ========================================== */}

                <div
                  className={`
                    relative
                    w-full
                    overflow-hidden
                    ${cake.height}
                  `}
                >
                  <Image
                    src={cake.image}
                    alt={`${cake.name} custom cake design`}
                    fill
                    sizes="
                      (max-width: 640px) 100vw,
                      (max-width: 1024px) 50vw,
                      (max-width: 1280px) 33vw,
                      25vw
                    "
                    className="
                      object-cover
                      transition-transform
                      duration-700
                      ease-out
                      group-hover:scale-[1.07]
                    "
                  />

                  {/* OVERLAY */}

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-[#180b0d]/80
                      via-transparent
                      to-black/5
                    "
                  />

                  {/* NUMBER */}

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
                      border-white/20
                      bg-black/10
                      px-2
                      text-[8px]
                      font-semibold
                      text-white
                      backdrop-blur-md
                    "
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* HEART */}

                  <div
                    className="
                      absolute
                      right-4
                      top-4
                      flex
                      h-9
                      w-9
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
                    <Heart size={14} />
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
                      p-5
                    "
                  >
                    <span
                      className="
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[2px]
                        text-white/60
                      "
                    >
                      {cake.category}
                    </span>

                    <div
                      className="
                        mt-1
                        flex
                        items-end
                        justify-between
                        gap-3
                      "
                    >
                      <h3
                        className="
                          font-serif
                          text-[20px]
                          font-semibold
                          text-white
                          sm:text-[21px]
                        "
                      >
                        {cake.name}
                      </h3>

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
                          transition-all
                          duration-300
                          group-hover:rotate-45
                          group-hover:bg-white
                          group-hover:text-[#9a1e2f]
                        "
                      >
                        <ArrowUpRight size={13} />
                      </span>
                    </div>

                    {/* SELECT TEXT */}

                    <div
                      className="
                        max-h-0
                        overflow-hidden
                        opacity-0
                        transition-all
                        duration-500
                        group-hover:mt-3
                        group-hover:max-h-10
                        group-hover:opacity-100
                      "
                    >
                      <span
                        className="
                          text-[9px]
                          font-medium
                          text-white/75
                        "
                      >
                        Use this as inspiration →
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* =================================================
            CUSTOM IDEA CARD
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
          viewport={{ once: true }}
          transition={{
            duration: 0.55,
          }}
          className="
            mt-8
            overflow-hidden
            rounded-[24px]
            bg-[#281916]
          "
        >
          <div
            className="
              relative
              flex
              flex-col
              gap-6
              px-6
              py-7
              sm:px-8
              lg:flex-row
              lg:items-center
              lg:justify-between
              lg:px-10
            "
          >
            {/* DECORATION */}

            <div
              className="
                absolute
                -right-[80px]
                -top-[100px]
                h-[240px]
                w-[240px]
                rounded-full
                border
                border-white/10
              "
            />

            {/* TEXT */}

            <div className="relative z-10">
              <p
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[2.5px]
                  text-[#d8aaa5]
                "
              >
                Have your own idea?
              </p>

              <h3
                className="
                  mt-2
                  font-serif
                  text-[25px]
                  font-medium
                  text-white
                  sm:text-[29px]
                "
              >
                Already Have A Cake{" "}
                <span className="italic text-[#e4aaa8]">
                  Reference?
                </span>
              </h3>

              <p
                className="
                  mt-2
                  max-w-[620px]
                  text-[10px]
                  leading-5
                  text-white/60
                  sm:text-[11px]
                "
              >
                Upload your own cake photo in the custom cake
                form and tell us what you&apos;d like changed.
              </p>
            </div>

            {/* BUTTON */}

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("custom-cake-form")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="
                group
                relative
                z-10
                inline-flex
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-full
                bg-white
                px-6
                py-3
                text-[10px]
                font-semibold
                text-[#9a1e2f]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#fff0ee]
                sm:text-[11px]
              "
            >
              Upload My Design

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
          </div>
        </motion.div>
      </div>
    </section>
  );
}