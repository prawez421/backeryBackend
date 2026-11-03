"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import {
  ArrowUpRight,
  CakeSlice,
  CircleHelp,
  Mail,
  MessageCircle,
} from "lucide-react";

/* =====================================================
   FAQ DATA
===================================================== */

const faqs = [
  {
    id: 1,
    category: "Custom Cakes",
    question: "Do you make custom cakes?",
    answer:
      "Yes. You can share your celebration type, preferred cake size, flavour, theme, colours and design requirements through our custom cake enquiry.",
  },
  {
    id: 2,
    category: "Cake Options",
    question: "Do you have eggless cakes?",
    answer:
      "Eggless preference can be included while submitting your cake enquiry. Availability can depend on the selected cake, flavour and other requirements.",
  },
  {
    id: 3,
    category: "Ordering",
    question: "How early should I order a custom cake?",
    answer:
      "It is better to enquire in advance, especially for detailed custom, designer or celebration cakes. The required preparation time can vary depending on the design and size.",
  },
  {
    id: 4,
    category: "Delivery",
    question: "Do you offer cake delivery?",
    answer:
      "Delivery availability can depend on your location, order type and selected delivery date. Contact the bakery with your delivery details to confirm availability.",
  },
  {
    id: 5,
    category: "Design",
    question: "Can I choose my own cake design?",
    answer:
      "Yes. You can describe your preferred theme, colours, decoration and other design ideas while sending a custom cake enquiry.",
  },
  {
    id: 6,
    category: "Reference",
    question: "Can I send a reference image for my cake?",
    answer:
      "Yes. A reference image can help explain the style and design you are looking for. The final result may vary depending on size, ingredients and practical design requirements.",
  },
  {
    id: 7,
    category: "Bulk Orders",
    question: "Do you accept bulk bakery orders?",
    answer:
      "You can contact us regarding bulk requirements for cakes, cupcakes, pastries, cookies or other bakery products. Availability and preparation time can depend on the quantity.",
  },
  {
    id: 8,
    category: "Order Support",
    question: "How can I ask about an existing order?",
    answer:
      "Use the contact form and select the relevant enquiry type, or contact the bakery directly. Include your order details so the enquiry can be identified easily.",
  },
];

/* =====================================================
   COMPONENT
===================================================== */

export default function FAQSection() {
  const [activeFaq, setActiveFaq] =
    useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setActiveFaq((current) =>
      current === id ? null : id
    );
  };

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#fffdfb]
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
          top-[80px]
          h-[450px]
          w-[450px]
          rounded-full
          border
          border-[#9a1e2f]/[0.05]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-[230px]
          -right-[180px]
          h-[470px]
          w-[470px]
          rounded-full
          border
          border-[#9a1e2f]/[0.05]
        "
      />

      {/* =================================================
          CONTAINER
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
        <div
          className="
            grid
            grid-cols-1
            gap-10

            lg:grid-cols-[0.72fr_1.28fr]
            lg:gap-14

            xl:gap-20
          "
        >
          {/* =================================================
              LEFT CONTENT
          ================================================== */}

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
              amount: 0.2,
            }}
            transition={{
              duration: 0.65,
            }}
            className="
              lg:sticky
              lg:top-[120px]
              lg:self-start
            "
          >
            {/* =============================================
                SMALL LABEL
            ============================================== */}

            <div
              className="
                mb-5
                inline-flex
                items-center
                gap-2.5
                rounded-full
                border
                border-[#e3cfca]
                bg-[#F5E9E5]
                px-4
                py-2
              "
            >
              <CircleHelp
                size={12}
                strokeWidth={1.8}
                className="text-[#9a1e2f]"
              />

              <span
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[2.4px]
                  text-[#9a1e2f]
                "
              >
                Frequently Asked Questions
              </span>
            </div>

            {/* =============================================
                HEADING
            ============================================== */}

            <h2
              className="
                max-w-[500px]
                font-serif
                text-[36px]
                font-medium
                leading-[1.07]
                tracking-[-1px]
                text-[#281b18]

                sm:text-[44px]
                lg:text-[50px]
              "
            >
              A Few Things You
              <br />

              <span className="italic text-[#9a1e2f]">
                Might Want To Know.
              </span>
            </h2>

            {/* =============================================
                DESCRIPTION
            ============================================== */}

            <p
              className="
                mt-5
                max-w-[430px]
                text-[11px]
                leading-6
                text-[#806d67]

                sm:text-[12px]
              "
            >
              Find quick answers about custom cakes,
              orders, delivery and bakery enquiries.
              If you still need help, you can send us
              a message.
            </p>

            {/* =============================================
                HELP CARD
            ============================================== */}

            <div
              className="
                relative
                mt-8
                max-w-[440px]
                overflow-hidden
                rounded-[24px]
                bg-[#281916]
                p-6
                text-white
              "
            >
              {/* DECORATION */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-[75px]
                  -top-[80px]
                  h-[190px]
                  w-[190px]
                  rounded-full
                  border
                  border-white/[0.06]
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-[90px]
                  left-[20px]
                  h-[180px]
                  w-[180px]
                  rounded-full
                  border
                  border-white/[0.05]
                "
              />

              <div className="relative z-10">
                {/* ICON */}

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    bg-[#9a1e2f]
                    text-white
                  "
                >
                  <MessageCircle
                    size={17}
                    strokeWidth={1.7}
                  />
                </div>

                {/* SMALL TITLE */}

                <p
                  className="
                    mt-5
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[2px]
                    text-[#e8aaa7]
                  "
                >
                  Still Have A Question?
                </p>

                {/* TITLE */}

                <h3
                  className="
                    mt-2
                    font-serif
                    text-[22px]
                    font-medium
                    leading-[1.3]
                  "
                >
                  We&apos;re happy to{" "}

                  <span className="italic text-[#e8aaa7]">
                    help.
                  </span>
                </h3>

                {/* DESCRIPTION */}

                <p
                  className="
                    mt-2
                    max-w-[320px]
                    text-[9px]
                    leading-[1.8]
                    text-white/50
                  "
                >
                  Send your question through our contact
                  form and include any useful order or
                  cake details.
                </p>

                {/* BUTTON */}

                <Link
                  href="#contact-form"
                  className="
                    group
                    mt-5
                    inline-flex
                    items-center
                    gap-2.5
                    rounded-full
                    border
                    border-white/15
                    bg-white/[0.06]
                    px-5
                    py-3
                    text-[9px]
                    font-bold
                    text-white

                    transition-all
                    duration-300

                    hover:border-white/30
                    hover:bg-white/10
                  "
                >
                  <Mail size={13} />

                  Send A Message

                  <ArrowUpRight
                    size={12}
                    className="
                      transition-transform
                      duration-300
                      group-hover:rotate-45
                    "
                  />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* =================================================
              RIGHT SIDE
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.1,
            }}
            transition={{
              duration: 0.65,
            }}
          >
            {/* =============================================
                QUICK ANSWERS
            ============================================== */}

            <div
              className="
                mb-4
                flex
                items-center
                gap-3
                rounded-[18px]
                border
                border-[#dfc9c3]
                bg-[#F5E9E5]
                px-5
                py-4
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#9a1e2f]
                  text-white
                  shadow-[0_5px_15px_rgba(154,30,47,0.15)]
                "
              >
                <CircleHelp
                  size={15}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p
                  className="
                    font-serif
                    text-[17px]
                    font-semibold
                    text-[#35231f]
                  "
                >
                  Quick Answers
                </p>

                <p
                  className="
                    mt-0.5
                    text-[9px]
                    text-[#8b746e]
                  "
                >
                  Click a question to see the answer.
                </p>
              </div>
            </div>

            {/* =============================================
                FAQ ACCORDION
            ============================================== */}

            <div className="space-y-2.5">
              {faqs.map((faq, index) => {
                const isOpen =
                  activeFaq === faq.id;

                return (
                  <motion.div
                    key={faq.id}
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
                      duration: 0.4,
                      delay: index * 0.04,
                    }}
                    className={`
                      overflow-hidden
                      rounded-[18px]
                      border
                      transition-all
                      duration-300

                      ${
                        isOpen
                          ? `
                              border-[#d7b6ae]
                              bg-[#fffaf8]
                              shadow-[0_10px_30px_rgba(80,40,35,0.05)]
                            `
                          : `
                              border-[#eadbd6]
                              bg-white
                              hover:border-[#d9bfb9]
                            `
                      }
                    `}
                  >
                    {/* =====================================
                        QUESTION BUTTON
                    ====================================== */}

                    <button
                      type="button"
                      onClick={() =>
                        toggleFaq(faq.id)
                      }
                      aria-expanded={isOpen}
                      className="
                        group
                        flex
                        w-full
                        items-center
                        gap-4
                        px-5
                        py-[18px]
                        text-left

                        sm:px-6
                        sm:py-5
                      "
                    >
                      {/* QUESTION */}

                      <div className="min-w-0 flex-1">
                        {/* CATEGORY */}

                        <p
                          className="
                            mb-1.5
                            text-[7px]
                            font-bold
                            uppercase
                            tracking-[1.7px]
                            text-[#9a1e2f]
                          "
                        >
                          {faq.category}
                        </p>

                        {/* TITLE */}

                        <h3
                          className={`
                            font-serif
                            text-[15px]
                            font-semibold
                            leading-[1.4]
                            transition-colors
                            duration-300

                            sm:text-[17px]

                            ${
                              isOpen
                                ? "text-[#9a1e2f]"
                                : `
                                    text-[#3b2924]
                                    group-hover:text-[#9a1e2f]
                                  `
                            }
                          `}
                        >
                          {faq.question}
                        </h3>
                      </div>

                      {/* =================================
                          PLUS ICON
                      ================================== */}

                      <div
                        className={`
                          relative
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border

                          transition-all
                          duration-300

                          ${
                            isOpen
                              ? `
                                  rotate-45
                                  border-[#9a1e2f]
                                  bg-[#9a1e2f]
                                  shadow-[0_5px_15px_rgba(154,30,47,0.15)]
                                `
                              : `
                                  border-[#dfc9c3]
                                  bg-[#F5E9E5]

                                  group-hover:border-[#9a1e2f]
                                  group-hover:bg-[#9a1e2f]
                                `
                          }
                        `}
                      >
                        {/* HORIZONTAL */}

                        <span
                          className={`
                            absolute
                            h-[1.5px]
                            w-[13px]
                            rounded-full

                            transition-colors
                            duration-300

                            ${
                              isOpen
                                ? "bg-white"
                                : `
                                    bg-[#9a1e2f]
                                    group-hover:bg-white
                                  `
                            }
                          `}
                        />

                        {/* VERTICAL */}

                        <span
                          className={`
                            absolute
                            h-[13px]
                            w-[1.5px]
                            rounded-full

                            transition-colors
                            duration-300

                            ${
                              isOpen
                                ? "bg-white"
                                : `
                                    bg-[#9a1e2f]
                                    group-hover:bg-white
                                  `
                            }
                          `}
                        />
                      </div>
                    </button>

                    {/* =====================================
                        ANSWER
                    ====================================== */}

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{
                            height: 0,
                            opacity: 0,
                          }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                          }}
                          transition={{
                            height: {
                              duration: 0.3,
                            },
                            opacity: {
                              duration: 0.2,
                            },
                          }}
                          className="overflow-hidden"
                        >
                          <div
                            className="
                              mx-5
                              border-t
                              border-[#eadbd6]
                              pb-5
                              pt-4

                              sm:mx-6
                            "
                          >
                            <p
                              className="
                                max-w-[680px]
                                text-[10px]
                                leading-[1.9]
                                text-[#78645e]

                                sm:text-[11px]
                              "
                            >
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* =============================================
                CUSTOM CAKE CTA
            ============================================== */}

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
                mt-4
                flex
                flex-col
                gap-4
                rounded-[20px]
                bg-[#9a1e2f]
                px-5
                py-5
                text-white

                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              {/* LEFT */}

              <div className="flex items-center gap-3">
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
                  "
                >
                  <CakeSlice
                    size={15}
                    strokeWidth={1.7}
                  />
                </div>

                <div>
                  <p
                    className="
                      text-[7px]
                      font-bold
                      uppercase
                      tracking-[1.5px]
                      text-white/55
                    "
                  >
                    Have A Cake Idea?
                  </p>

                  <p
                    className="
                      mt-1
                      font-serif
                      text-[15px]
                      font-medium
                    "
                  >
                    Start your custom cake enquiry.
                  </p>
                </div>
              </div>

              {/* BUTTON */}

              <Link
                href="/custom-cakes"
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-white
                  px-5
                  py-3
                  text-[9px]
                  font-bold
                  text-[#9a1e2f]

                  transition-all
                  duration-300

                  hover:-translate-y-0.5
                  hover:bg-[#fff4f1]
                "
              >
                Custom Cakes

                <ArrowUpRight
                  size={12}
                  className="
                    transition-transform
                    duration-300
                    group-hover:rotate-45
                  "
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}