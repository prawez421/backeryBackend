"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Quote,
  Star,
} from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Aarohi Sharma",
    location: "Motera, Ahmedabad",
    image: "/images/home/customer-1.png",
    rating: 5,
    review:
      "The cake was not only beautiful but tasted amazing! Everything was fresh, soft and perfectly balanced. The whole family loved it.",
  },
  {
    id: 2,
    name: "Arjun Mehta",
    location: "Ahmedabad",
    image: "/images/home/customer-2.png",
    rating: 5,
    review:
      "Fresh pastries, beautiful presentation and really good service. The order arrived safely and right on time.",
  },
  {
    id: 3,
    name: "Rajesh Patel",
    location: "Motera, Ahmedabad",
    image: "/images/home/customer-3.png",
    rating: 5,
    review:
      "We ordered a celebration cake for our family event and everyone loved it. The design and taste were both excellent.",
  },
  {
    id: 4,
    name: "Ananya Verma",
    location: "Ahmedabad",
    image: "/images/home/customer-4.png",
    rating: 5,
    review:
      "One of my favourite places for cakes and desserts. Beautiful cakes, fresh ingredients and lovely packaging.",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // ============================
  // AUTO SLIDE
  // ============================
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrent((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const testimonial = testimonials[current];

  return (
    <section className="overflow-hidden bg-[#fff9f6] py-4 lg:py-5">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">

        {/* ============================
            HEADING
        ============================ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-[650px] text-center"
        >
          <p
            className="
              mb-3
              text-[10px]
              font-bold
              uppercase
              tracking-[3px]
              text-[#9a1e2f]
            "
          >
            Customer Love
          </p>

          <h2
            className="
              font-serif
              text-[34px]
              font-semibold
              tracking-[-1px]
              text-[#251b18]
              sm:text-[40px]
              lg:text-[46px]
            "
          >
            What Our{" "}
            <span className="italic text-[#9a1e2f]">
              Customers Say
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-[520px]
              text-[13px]
              leading-6
              text-[#786a65]
              sm:text-[14px]
            "
          >
            Sweet words from the people who make our baking
            journey even more special.
          </p>
        </motion.div>

        {/* ============================
            TESTIMONIAL CARD
        ============================ */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="
            relative
            overflow-hidden
            rounded-[30px]
            border
            border-[#eee1dc]
            bg-white
            shadow-[0_20px_60px_rgba(80,35,35,0.08)]
          "
        >
          {/* Decorations */}
          <div
            className="
              absolute
              -left-24
              -top-24
              h-[300px]
              w-[300px]
              rounded-full
              bg-[#fbeaec]
            "
          />

          <div
            className="
              absolute
              -bottom-32
              -right-24
              h-[350px]
              w-[350px]
              rounded-full
              bg-[#fff1dc]
            "
          />

          <div
            className="
              relative
              z-10
              grid
              min-h-[480px]
              grid-cols-1
              lg:grid-cols-[0.8fr_1.2fr]
            "
          >
            {/* ============================
                CUSTOMER IMAGE
            ============================ */}
            <div
              className="
                relative
                flex
                min-h-[370px]
                items-center
                justify-center
                p-8
                lg:min-h-[480px]
                lg:p-12
              "
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonial.id}
                  initial={{
                    opacity: 0,
                    scale: 0.85,
                    x: -30,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    x: 30,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="
                    relative
                    h-[260px]
                    w-[260px]
                    sm:h-[300px]
                    sm:w-[300px]
                  "
                >
                  {/* Outer ring */}
                  <div
                    className="
                      absolute
                      inset-[-10px]
                      rounded-full
                      border
                      border-dashed
                      border-[#d9b3aa]
                    "
                  />

                  {/* Image */}
                  <div
                    className="
                      relative
                      h-full
                      w-full
                      overflow-hidden
                      rounded-full
                      border-[7px]
                      border-white
                      bg-[#f5e9e5]
                      shadow-[0_20px_50px_rgba(80,30,30,0.15)]
                    "
                  >
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  </div>

                  {/* Quote badge */}
                  <motion.div
                    animate={{
                      y: [0, -6, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="
                      absolute
                      -bottom-2
                      right-3
                      flex
                      h-[58px]
                      w-[58px]
                      items-center
                      justify-center
                      rounded-full
                      border-[4px]
                      border-white
                      bg-[#98182c]
                      text-white
                      shadow-lg
                    "
                  >
                    <Quote
                      size={23}
                      fill="currentColor"
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ============================
                REVIEW CONTENT
            ============================ */}
            <div
              className="
                flex
                flex-col
                justify-center
                px-7
                pb-12
                pt-3
                sm:px-12
                lg:px-10
                lg:py-14
                xl:px-16
              "
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonial.id}
                  initial={{
                    opacity: 0,
                    x: 40,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -40,
                  }}
                  transition={{
                    duration: 0.45,
                  }}
                >
                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {Array.from({
                      length: testimonial.rating,
                    }).map((_, index) => (
                      <motion.div
                        key={index}
                        initial={{
                          opacity: 0,
                          scale: 0,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        transition={{
                          delay: index * 0.06,
                        }}
                      >
                        <Star
                          size={18}
                          fill="#e4a126"
                          className="text-[#e4a126]"
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Review */}
                  <p
                    className="
                      mt-7
                      max-w-[620px]
                      font-serif
                      text-[22px]
                      leading-[1.65]
                      text-[#332725]
                      sm:text-[25px]
                      lg:text-[28px]
                    "
                  >
                    “{testimonial.review}”
                  </p>

                  {/* Customer */}
                  <div className="mt-8">
                    <h3
                      className="
                        text-[15px]
                        font-bold
                        text-[#251b18]
                      "
                    >
                      {testimonial.name}
                    </h3>

                    <p
                      className="
                        mt-1
                        text-[11px]
                        text-[#8a7a75]
                      "
                    >
                      {testimonial.location}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* ============================
                  CONTROLS
              ============================ */}
              <div
                className="
                  mt-9
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-5
                "
              >
                {/* Dots */}
                <div className="flex items-center gap-2">
                  {testimonials.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => setCurrent(index)}
                      aria-label={`Go to testimonial ${index + 1}`}
                      className={`
                        h-[7px]
                        rounded-full
                        transition-all
                        duration-300
                        ${
                          current === index
                            ? "w-7 bg-[#98182c]"
                            : "w-[7px] bg-[#dfcfca] hover:bg-[#bfa9a3]"
                        }
                      `}
                    />
                  ))}
                </div>

                {/* Arrows */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={prevSlide}
                    aria-label="Previous testimonial"
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#e5d7d2]
                      bg-white
                      text-[#98182c]
                      transition-colors
                      hover:border-[#98182c]
                      hover:bg-[#98182c]
                      hover:text-white
                    "
                  >
                    <ArrowLeft size={17} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={nextSlide}
                    aria-label="Next testimonial"
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      bg-[#98182c]
                      text-white
                      shadow-[0_8px_20px_rgba(152,24,44,0.2)]
                      transition-colors
                      hover:bg-[#761221]
                    "
                  >
                    <ArrowRight size={17} />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}