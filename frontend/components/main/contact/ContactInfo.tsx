"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CakeSlice,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";

/* =====================================================
   CONTACT INFO DATA

   IMPORTANT:
   Apna real address, phone aur email yahan change karna.
===================================================== */

const contactItems = [
  {
    id: 1,
    number: "01",
    title: "Visit Our Bakery",
    label: "Our Location",
    description:
      "Visit Alibros Bakery and discover fresh cakes, pastries, breads and more.",
    value: "Add your bakery address here",
    href: "#location",
    linkText: "View Location",
    icon: MapPin,
  },
  {
    id: 2,
    number: "02",
    title: "Call Us",
    label: "Bakery Enquiries",
    description:
      "Have a question about products, availability or an order? Give us a call.",
    value: "+91 XXXXX XXXXX",
    href: "tel:+91XXXXXXXXXX",
    linkText: "Call Bakery",
    icon: Phone,
  },
  {
    id: 3,
    number: "03",
    title: "Email Us",
    label: "Send A Message",
    description:
      "Send your questions, feedback or bakery enquiries and we'll get back to you.",
    value: "hello@alibrosbakery.com",
    href: "mailto:hello@alibrosbakery.com",
    linkText: "Send Email",
    icon: Mail,
  },
  {
    id: 4,
    number: "04",
    title: "Custom Cake",
    label: "Plan Your Cake",
    description:
      "Planning a birthday, anniversary or celebration? Tell us about your cake idea.",
    value: "Custom Cake Enquiry",
    href: "/custom-cakes",
    linkText: "Start Enquiry",
    icon: CakeSlice,
  },
];

/* =====================================================
   ANIMATION
===================================================== */

const containerVariants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.1,
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
   MAIN COMPONENT
===================================================== */

export default function ContactInfo() {
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
      {/* =========================================
          BACKGROUND DECORATION
      ========================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-[200px]
          top-[30px]
          h-[400px]
          w-[400px]
          rounded-full
          border
          border-[#9a1e2f]/[0.05]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-[220px]
          right-[-180px]
          h-[430px]
          w-[430px]
          rounded-full
          border
          border-[#9a1e2f]/[0.05]
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
            SECTION HEADER
        ================================================== */}

        <div
          className="
            mb-10
            grid
            grid-cols-1
            gap-5
            lg:grid-cols-[1fr_430px]
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
            {/* LABEL */}

            <div className="mb-4 flex items-center gap-3">
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
                <Sparkles size={13} />
              </span>

              <span
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[2.7px]
                  text-[#9a1e2f]
                  sm:text-[10px]
                "
              >
                Contact Alibros
              </span>
            </div>

            {/* HEADING */}

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
              We&apos;re Here To Make
              <br />

              <span className="italic text-[#9a1e2f]">
                Things Sweeter.
              </span>
            </h2>
          </motion.div>

          {/* RIGHT DESCRIPTION */}

          <motion.p
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
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            className="
              max-w-[430px]
              text-[11px]
              leading-6
              text-[#7e6b65]
              sm:text-[12px]
              lg:text-[13px]
            "
          >
            Whether you need help with a bakery product,
            custom cake or general enquiry, choose the easiest
            way to get in touch with Alibros Bakery.
          </motion.p>
        </div>

        {/* =================================================
            CONTACT CARDS
        ================================================== */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.08,
          }}
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          {contactItems.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                variants={cardVariants}
                whileHover={{
                  y: -7,
                }}
                className="
                  group
                  relative
                  min-h-[330px]
                  overflow-hidden
                  rounded-[24px]
                  border
                  border-[#eadbd5]
                  bg-[#fffaf7]
                  p-6
                  shadow-[0_10px_30px_rgba(70,30,30,0.04)]
                  transition-shadow
                  duration-300

                  hover:shadow-[0_20px_50px_rgba(70,30,30,0.09)]
                "
              >
                {/* =====================================
                    LARGE BACKGROUND NUMBER
                ====================================== */}

                <span
                  className="
                    pointer-events-none
                    absolute
                    -right-2
                    -top-7
                    font-serif
                    text-[105px]
                    font-semibold
                    leading-none
                    text-[#9a1e2f]/[0.035]

                    transition-all
                    duration-500

                    group-hover:-translate-x-2
                    group-hover:translate-y-2
                    group-hover:text-[#9a1e2f]/[0.06]
                  "
                >
                  {item.number}
                </span>

                {/* =====================================
                    TOP
                ====================================== */}

                <div
                  className="
                    relative
                    z-10
                    flex
                    items-start
                    justify-between
                  "
                >
                  {/* ICON */}

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-[15px]
                      bg-[#f3dfe0]
                      text-[#9a1e2f]

                      transition-all
                      duration-300

                      group-hover:-rotate-3
                      group-hover:bg-[#9a1e2f]
                      group-hover:text-white
                    "
                  >
                    <Icon
                      size={19}
                      strokeWidth={1.7}
                    />
                  </div>

                  {/* NUMBER */}

                  <span
                    className="
                      text-[8px]
                      font-bold
                      tracking-[1.5px]
                      text-[#b49c95]
                    "
                  >
                    / {item.number}
                  </span>
                </div>

                {/* =====================================
                    CONTENT
                ====================================== */}

                <div className="relative z-10 mt-7">
                  <p
                    className="
                      text-[8px]
                      font-bold
                      uppercase
                      tracking-[2px]
                      text-[#9a1e2f]
                    "
                  >
                    {item.label}
                  </p>

                  <h3
                    className="
                      mt-2
                      font-serif
                      text-[22px]
                      font-semibold
                      text-[#34231f]

                      transition-colors
                      duration-300

                      group-hover:text-[#9a1e2f]
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      mt-3
                      text-[10px]
                      leading-[1.8]
                      text-[#806d67]
                    "
                  >
                    {item.description}
                  </p>
                </div>

                {/* =====================================
                    VALUE
                ====================================== */}

                <div
                  className="
                    relative
                    z-10
                    mt-5
                    border-t
                    border-[#eadbd5]
                    pt-4
                  "
                >
                  <p
                    className="
                      truncate
                      text-[10px]
                      font-semibold
                      text-[#493631]
                    "
                  >
                    {item.value}
                  </p>
                </div>

                {/* =====================================
                    LINK
                ====================================== */}

                <div
                  className="
                    absolute
                    bottom-6
                    left-6
                    right-6
                    z-10
                  "
                >
                  <Link
                    href={item.href}
                    className="
                      flex
                      items-center
                      justify-between

                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[1.2px]

                      text-[#9a1e2f]
                    "
                  >
                    <span>{item.linkText}</span>

                    <span
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center

                        rounded-full

                        border
                        border-[#e5cec8]

                        transition-all
                        duration-300

                        group-hover:border-[#9a1e2f]
                        group-hover:bg-[#9a1e2f]
                        group-hover:text-white
                      "
                    >
                      <ArrowUpRight
                        size={13}
                        className="
                          transition-transform
                          duration-300
                          group-hover:rotate-45
                        "
                      />
                    </span>
                  </Link>
                </div>

                {/* =====================================
                    BOTTOM HOVER LINE
                ====================================== */}

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
            gap-5

            rounded-[22px]

            bg-[#281916]

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
                bg-[#9a1e2f]
                text-white
              "
            >
              <CakeSlice size={16} />
            </div>

            <div>
              <p
                className="
                  text-[7px]
                  font-bold
                  uppercase
                  tracking-[2px]
                  text-[#e0a5a2]
                "
              >
                Planning A Celebration?
              </p>

              <p
                className="
                  mt-1
                  font-serif
                  text-[17px]
                  text-white
                  sm:text-[19px]
                "
              >
                Tell us about your{" "}

                <span className="italic text-[#e9aaa7]">
                  dream cake.
                </span>
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
            Custom Cake Enquiry

            <ArrowUpRight
              size={13}
              className="
                transition-transform
                duration-300
                group-hover:rotate-45
              "
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}