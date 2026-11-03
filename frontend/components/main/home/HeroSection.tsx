"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CakeSlice,
  Croissant,
  Cookie,
  Sparkles,
} from "lucide-react";

/* =====================================================
   SLIDER DATA
===================================================== */

const slides = [
  {
    id: 1,
    tag: "Alibros Artisan Bakery",
    title: "Happiness,",
    highlight: "Freshly Baked.",
    description:
      "Discover handcrafted cakes, creamy pastries, cupcakes, cookies and fresh breads — lovingly baked for every special moment.",
    image: "/images/home/hero-cake.webp",
    smallText: "Cakes • Pastries • Cupcakes",
    type: "cake",
  },
  {
    id: 2,
    tag: "Fresh From The Oven",
    title: "Warm Bakes,",
    highlight: "Beautiful Moments.",
    description:
      "From flaky pastries to soft breads and delicious cookies, enjoy fresh bakery favourites made with quality ingredients.",
    image: "/images/home/hero-pastry.webp",
    smallText: "Pastries • Breads • Cookies",
    type: "pastry",
  },
  {
    id: 3,
    tag: "Celebrate With Alibros",
    title: "Made Special,",
    highlight: "Just For You.",
    description:
      "Make birthdays, anniversaries and celebrations unforgettable with beautiful custom cakes crafted specially for you.",
    //  image: "/images/home/hero-pastry.webp",
      image: "/images/home/hero-custom-cak.webp",
    smallText: "Birthday • Anniversary • Custom",
    type: "custom",
  },
];

/* =====================================================
   HERO SECTION
===================================================== */

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  /* =====================================================
     AUTO SLIDER
  ===================================================== */

  useEffect(() => {
    if (paused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(timer);
  }, [paused]);

  /* =====================================================
     NEXT SLIDE
  ===================================================== */

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  };

  /* =====================================================
     PREVIOUS SLIDE
  ===================================================== */

  const previousSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  const slide = slides[currentSlide];

  return (
    <section className="bg-[#fff9f6] px-3 py-3 sm:px-5 sm:py-4 lg:px-8 lg:py-4">
      {/* =================================================
          HERO CONTAINER
      ================================================== */}

      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="
          relative
          mx-auto
          w-full
          max-w-[1450px]
          overflow-hidden

          rounded-[24px]
          border
          border-[#efe1dc]
          bg-[#fffaf7]

          shadow-[0_15px_45px_rgba(70,30,30,0.06)]

          sm:rounded-[26px]

          lg:h-[480px]
          lg:min-h-[480px]
          lg:max-h-[480px]

          xl:rounded-[28px]
        "
      >
        {/* =================================================
            BACKGROUND DECORATION
        ================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            -left-[100px]
            -top-[100px]

            h-[260px]
            w-[260px]

            rounded-full
            bg-[#f8e7e2]
            blur-[80px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            bottom-[-140px]
            left-[28%]

            h-[300px]
            w-[300px]

            rounded-full
            bg-[#f7e5e0]
            blur-[90px]
          "
        />

        {/* =================================================
            CURRENT SLIDE
        ================================================== */}

        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.45,
            }}
            className="
              grid
              grid-cols-1

              lg:h-full
              lg:grid-cols-[47%_53%]
            "
          >
            {/* =================================================
                LEFT CONTENT
            ================================================== */}

            <div
              className="
                relative
                z-30

                flex
                flex-col
                justify-center

                px-6
                py-9

                sm:px-9
                sm:py-10

                lg:h-full
                lg:px-10
                lg:py-6

                xl:px-14

                2xl:px-16
              "
            >
              {/* =========================
                  TAG
              ========================== */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.45,
                  delay: 0.1,
                }}
                className="mb-4 flex items-center gap-2.5"
              >
                <span
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center

                    rounded-full
                    bg-[#f8e5e8]
                    text-[#a71930]
                  "
                >
                  <Sparkles size={14} />
                </span>

                <span
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[2px]
                    text-[#a71930]

                    sm:text-[10px]
                    sm:tracking-[2.5px]
                  "
                >
                  {slide.tag}
                </span>
              </motion.div>

              {/* =========================
                  HEADING
              ========================== */}

              <motion.h1
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.55,
                  delay: 0.15,
                }}
                className="
                  max-w-[600px]

                  font-serif
                  text-[38px]
                  font-semibold
                  leading-[1.03]
                  tracking-[-1.4px]
                  text-[#211816]

                  min-[380px]:text-[41px]

                  sm:text-[46px]

                  lg:text-[45px]

                  xl:text-[50px]

                  2xl:text-[54px]
                "
              >
                {slide.title}

                <br />

                <span className="italic text-[#a71930]">
                  {slide.highlight}
                </span>
              </motion.h1>

              {/* =========================
                  DESCRIPTION
              ========================== */}

              <motion.p
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.23,
                }}
                className="
                  mt-4
                  max-w-[470px]

                  text-[12px]
                  leading-[21px]
                  text-[#71635f]

                  sm:text-[13px]
                  sm:leading-6

                  xl:text-[14px]
                "
              >
                {slide.description}
              </motion.p>

              {/* =========================
                  CATEGORY TEXT
              ========================== */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.45,
                  delay: 0.3,
                }}
                className="mt-4 flex items-center gap-2.5"
              >
                <span className="h-px w-7 bg-[#a71930]" />

                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[1.4px]
                    text-[#8a7771]

                    sm:text-[10px]
                  "
                >
                  {slide.smallText}
                </p>
              </motion.div>

              {/* =========================
                  BUTTONS
              ========================== */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.45,
                  delay: 0.37,
                }}
                className="mt-6 flex flex-wrap gap-2.5"
              >
                <Link
                  href="/menu"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-2

                    rounded-full
                    bg-[#a71930]

                    px-5
                    py-2.5

                    text-[11px]
                    font-semibold
                    text-white

                    shadow-[0_8px_20px_rgba(167,25,48,0.18)]

                    transition-all
                    duration-300

                    hover:-translate-y-[2px]
                    hover:bg-[#841326]

                    sm:px-6
                    sm:py-3
                    sm:text-[12px]
                  "
                >
                  Explore Menu

                  <ArrowRight
                    size={14}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </Link>

                <Link
                  href="/custom-cakes"
                  className="
                    inline-flex
                    items-center
                    justify-center

                    rounded-full
                    border
                    border-[#d6b8b1]
                    bg-white

                    px-5
                    py-2.5

                    text-[11px]
                    font-semibold
                    text-[#4c3935]

                    transition-all
                    duration-300

                    hover:-translate-y-[2px]
                    hover:border-[#a71930]
                    hover:text-[#a71930]

                    sm:px-6
                    sm:py-3
                    sm:text-[12px]
                  "
                >
                  Custom Cake
                </Link>
              </motion.div>
            </div>

            {/* =================================================
                RIGHT IMAGE AREA
            ================================================== */}

            <div
              className="
                relative

                min-h-[360px]
                overflow-hidden

                sm:min-h-[400px]

                lg:h-full
                lg:min-h-0
              "
            >
              {/* =========================
                  OUTER SOFT CIRCLE
              ========================== */}

              <motion.div
                initial={{
                  scale: 0.75,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  duration: 0.7,
                }}
                className="
                  absolute
                  left-1/2
                  top-1/2

                  h-[300px]
                  w-[300px]

                  -translate-x-1/2
                  -translate-y-1/2

                  rounded-full
                  bg-[#f3dfda]

                  min-[400px]:h-[330px]
                  min-[400px]:w-[330px]

                  sm:h-[360px]
                  sm:w-[360px]

                  lg:h-[390px]
                  lg:w-[390px]

                  xl:h-[410px]
                  xl:w-[410px]
                "
              />

              {/* =========================
                  OUTLINE CIRCLE
              ========================== */}

              <motion.div
                initial={{
                  scale: 0.75,
                  opacity: 0,
                  rotate: -15,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  rotate: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.08,
                }}
                className="
                  absolute
                  left-1/2
                  top-1/2

                  h-[275px]
                  w-[275px]

                  -translate-x-1/2
                  -translate-y-1/2

                  rounded-full
                  border
                  border-[#d9b3ab]

                  min-[400px]:h-[305px]
                  min-[400px]:w-[305px]

                  sm:h-[335px]
                  sm:w-[335px]

                  lg:h-[360px]
                  lg:w-[360px]

                  xl:h-[380px]
                  xl:w-[380px]
                "
              />

              {/* =========================
                  BURGUNDY CIRCLE
              ========================== */}

              <motion.div
                initial={{
                  scale: 0.75,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.15,
                }}
                className="
                  absolute
                  left-1/2
                  top-1/2

                  h-[225px]
                  w-[225px]

                  -translate-x-1/2
                  -translate-y-1/2

                  rounded-full
                  bg-[#a71930]

                  shadow-[0_25px_60px_rgba(167,25,48,0.18)]

                  min-[400px]:h-[245px]
                  min-[400px]:w-[245px]

                  sm:h-[275px]
                  sm:w-[275px]

                  lg:h-[300px]
                  lg:w-[300px]

                  xl:h-[315px]
                  xl:w-[315px]
                "
              />

              {/* =================================================
                  PRODUCT IMAGE
                  
                  FIX:
                  sizes prop single line me rakha hai.
              ================================================== */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 50,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.75,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  absolute
                  bottom-[-10px]
                  left-1/2
                  z-20

                  h-[320px]
                  w-[320px]

                  -translate-x-1/2

                  min-[400px]:h-[340px]
                  min-[400px]:w-[340px]

                  sm:h-[375px]
                  sm:w-[375px]

                  lg:bottom-[-15px]
                  lg:h-[395px]
                  lg:w-[395px]

                  xl:h-[420px]
                  xl:w-[420px]
                "
              >
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={slide.image}
                    alt={`${slide.title} ${slide.highlight}`}
                    fill
                    priority={currentSlide === 0}
                    sizes="(max-width: 640px) 320px, (max-width: 1024px) 375px, 420px"
                    className="object-contain object-bottom"
                  />
                </motion.div>
              </motion.div>

              {/* =========================
                  LEFT FLOATING CARD
              ========================== */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: [0, -5, 0],
                }}
                transition={{
                  opacity: {
                    delay: 0.6,
                    duration: 0.4,
                  },

                  x: {
                    delay: 0.6,
                    duration: 0.4,
                  },

                  y: {
                    delay: 1,
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="
                  absolute
                  left-[4%]
                  top-[16%]
                  z-30

                  hidden
                  items-center
                  gap-2.5

                  rounded-[15px]
                  border
                  border-white/80
                  bg-white/90

                  px-3
                  py-2.5

                  shadow-[0_12px_30px_rgba(60,20,20,0.09)]
                  backdrop-blur-md

                  sm:flex
                "
              >
                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center

                    rounded-full
                    bg-[#f8e5e8]
                    text-[#a71930]
                  "
                >
                  {slide.type === "pastry" ? (
                    <Croissant size={16} />
                  ) : (
                    <CakeSlice size={16} />
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-bold text-[#211816]">
                    Freshly Made
                  </p>

                  <p className="mt-[1px] text-[8px] text-[#8b7b76]">
                    Baked with love
                  </p>
                </div>
              </motion.div>

              {/* =========================
                  RIGHT FLOATING CARD
              ========================== */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: 20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: [0, 5, 0],
                }}
                transition={{
                  opacity: {
                    delay: 0.7,
                    duration: 0.4,
                  },

                  x: {
                    delay: 0.7,
                    duration: 0.4,
                  },

                  y: {
                    delay: 1.1,
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="
                  absolute
                  bottom-[17%]
                  right-[4%]
                  z-30

                  hidden
                  items-center
                  gap-2.5

                  rounded-[15px]
                  border
                  border-white/80
                  bg-white/90

                  px-3
                  py-2.5

                  shadow-[0_12px_30px_rgba(60,20,20,0.09)]
                  backdrop-blur-md

                  sm:flex
                "
              >
                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center

                    rounded-full
                    bg-[#f8e5e8]
                    text-[#a71930]
                  "
                >
                  <Cookie size={15} />
                </div>

                <div>
                  <p className="text-[10px] font-bold text-[#211816]">
                    Delicious Treats
                  </p>

                  <p className="mt-[1px] text-[8px] text-[#8b7b76]">
                    Made for every moment
                  </p>
                </div>
              </motion.div>

              {/* =========================
                  PRODUCT SHADOW
              ========================== */}

              <div
                className="
                  absolute
                  bottom-[8px]
                  left-1/2
                  z-10

                  h-[35px]
                  w-[45%]

                  -translate-x-1/2

                  rounded-full
                  bg-black/10
                  blur-[25px]
                "
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* =================================================
            SLIDER CONTROLS
        ================================================== */}

        <div
          className="
            absolute
            bottom-3
            left-1/2
            z-40

            flex
            -translate-x-1/2
            items-center
            gap-2

            lg:bottom-4
          "
        >
          {/* PREVIOUS */}

          <button
            type="button"
            onClick={previousSlide}
            aria-label="Previous slide"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center

              rounded-full
              border
              border-[#e4d2cc]

              bg-white
              text-[#5c4944]

              shadow-sm

              transition-all
              duration-300

              hover:border-[#a71930]
              hover:bg-[#a71930]
              hover:text-white
            "
          >
            <ArrowLeft size={13} />
          </button>

          {/* DOTS */}

          <div
            className="
              flex
              items-center
              gap-1.5

              rounded-full
              border
              border-[#eadbd6]

              bg-white/90

              px-2.5
              py-2

              shadow-sm
              backdrop-blur-md
            "
          >
            {slides.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`
                  h-[5px]
                  rounded-full
                  transition-all
                  duration-300

                  ${
                    currentSlide === index
                      ? "w-5 bg-[#a71930]"
                      : "w-[5px] bg-[#d8c4be] hover:bg-[#b98e84]"
                  }
                `}
              />
            ))}
          </div>

          {/* NEXT */}

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center

              rounded-full
              border
              border-[#e4d2cc]

              bg-white
              text-[#5c4944]

              shadow-sm

              transition-all
              duration-300

              hover:border-[#a71930]
              hover:bg-[#a71930]
              hover:text-white
            "
          >
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </section>
  );
}