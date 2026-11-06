"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import {
  ArrowUpRight,
  CakeSlice,
  Clock3,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";

/* =====================================================
   QUICK LINKS
===================================================== */

const quickLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Menu",
    href: "/menu",
  },
  {
    name: "About Us",
    href: "/about",
  },
  {
    name: "Custom Cakes",
    href: "/custom-cakes",
  },
  {
    name: "Contact Us",
    href: "/contact",
  },
];

/* =====================================================
   BAKERY LINKS
===================================================== */

const bakeryLinks = [
  {
    name: "Cakes",
     href: "/menu?category=cakes",
  },
  {
    name: "Cupcakes",
    href: "/menu?category=cupcakes",
  },
  {
    name: "Pastries",
    href: "/menu?category=pastries",
  },
  {
    name: "Cookies",
    href: "/menu?category=cookies",
  },
  {
    name: "Breads",
    href: "/menu?category=breads",
  },
];

/* =====================================================
   FOOTER
===================================================== */

export default function Footer() {
  return (
    <footer
      className="
        relative
        overflow-hidden
        bg-[#211411]
        text-white
      "
    >
      {/* =================================================
          BACKGROUND DECORATION
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-[180px]
          -top-[180px]
          h-[380px]
          w-[380px]
          rounded-full
          border
          border-white/[0.04]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-[200px]
          -left-[180px]
          h-[380px]
          w-[380px]
          rounded-full
          bg-[#9a1e2f]/10
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-[45%]
          top-[30%]
          h-[200px]
          w-[200px]
          rounded-full
          bg-[#9a1e2f]/[0.04]
          blur-[70px]
        "
      />

      {/* =================================================
          MAIN FOOTER
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
          amount: 0.1,
        }}
        transition={{
          duration: 0.55,
        }}
        className="
          relative
          z-10
          mx-auto
          grid
          max-w-[1400px]
          grid-cols-1
          gap-9
          px-5
          py-10

          sm:px-8

          md:grid-cols-2

          lg:grid-cols-[1.4fr_0.7fr_0.8fr_1.1fr]
          lg:gap-10
          lg:px-12
          lg:py-11
        "
      >
        {/* =================================================
            BRAND
        ================================================== */}

        <div>
          <Link
            href="/"
            className="
              group
              inline-flex
              items-center
              gap-3
            "
          >
            {/* LOGO */}

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
                shadow-[0_8px_20px_rgba(154,30,47,0.2)]

                transition-transform
                duration-300

                group-hover:-rotate-6
              "
            >
              <CakeSlice
                size={19}
                strokeWidth={1.7}
              />
            </div>

            {/* BRAND NAME */}

            <div>
              <h2
                className="
                  font-serif
                  text-[26px]
                  font-semibold
                  leading-none
                  tracking-[-0.4px]
                  text-white

                  sm:text-[28px]
                "
              >
                ALIBROS
              </h2>

              <p
                className="
                  mt-1.5
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[4px]
                  text-[#dca39f]
                "
              >
                Bakery
              </p>
            </div>
          </Link>

          {/* DESCRIPTION */}

          <p
            className="
              mt-5
              max-w-[350px]
              text-[13px]
              leading-6
              text-white/50

              sm:text-[14px]
            "
          >
            Fresh cakes, pastries, breads and sweet
            creations made with quality ingredients
            for every special moment.
          </p>

          {/* SOCIAL MEDIA */}

          <div className="mt-5 flex items-center gap-3">
            <SocialLink
              href="https://www.instagram.com/"
              label="Instagram"
            >
              <FaInstagram size={16} />
            </SocialLink>

            <SocialLink
              href="https://www.facebook.com/"
              label="Facebook"
            >
              <FaFacebookF size={14} />
            </SocialLink>
          </div>
        </div>

        {/* =================================================
            QUICK LINKS
        ================================================== */}

        <FooterLinks
          title="Quick Links"
          links={quickLinks}
        />

        {/* =================================================
            OUR BAKERY
        ================================================== */}

        <FooterLinks
          title="Our Bakery"
          links={bakeryLinks}
        />

        {/* =================================================
            CONTACT
        ================================================== */}

        <div>
          <FooterHeading>
            Visit Alibros
          </FooterHeading>

          <div className="mt-5 space-y-4">
            {/* LOCATION */}

            <ContactItem
              icon={
                <MapPin
                  size={14}
                  strokeWidth={1.7}
                />
              }
              label="Location"
            >
              Ranchi, Jharkhand, India
            </ContactItem>

            {/* PHONE */}

            <ContactItem
              icon={
                <Phone
                  size={14}
                  strokeWidth={1.7}
                />
              }
              label="Call"
            >
              <a
                href="tel:+917250076595"
                className="
                  transition-colors
                  duration-300
                  hover:text-white
                "
              >
                +91 72500 76595
              </a>
            </ContactItem>

            {/* EMAIL */}

            <ContactItem
              icon={
                <Mail
                  size={14}
                  strokeWidth={1.7}
                />
              }
              label="Email"
            >
              <a
                href="mailto:prawez713@gmail.com"
                className="
                  break-all
                  transition-colors
                  duration-300
                  hover:text-white
                "
              >
                prawez713@gmail.com
              </a>
            </ContactItem>

            {/* OPENING HOURS */}

            <ContactItem
              icon={
                <Clock3
                  size={14}
                  strokeWidth={1.7}
                />
              }
              label="Hours"
            >
              Mon - Sun · 9:00 AM - 10:00 PM
            </ContactItem>
          </div>
        </div>
      </motion.div>

      {/* =================================================
          BOTTOM FOOTER
      ================================================== */}

      <div
        className="
          relative
          z-10
          border-t
          border-white/[0.07]
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-[1400px]
            flex-col
            items-center
            justify-between
            gap-3
            px-5
            py-4
            text-center

            sm:px-8

            md:flex-row
            md:text-left

            lg:px-12
          "
        >
          {/* COPYRIGHT */}

          <p
            className="
              text-[11px]
              text-white/40

              sm:text-[12px]
            "
          >
            © {new Date().getFullYear()} Alibros Bakery.
            All rights reserved.
          </p>

          {/* LEGAL LINKS */}

          <div
            className="
              flex
              items-center
              gap-4
              text-[11px]
              text-white/40

              sm:text-[12px]
            "
          >
            <Link
              href="/privacy"
              className="
                transition-colors
                duration-300
                hover:text-white
              "
            >
              Privacy Policy
            </Link>

            <span
              className="
                h-1
                w-1
                rounded-full
                bg-white/20
              "
            />

            <Link
              href="/terms"
              className="
                transition-colors
                duration-300
                hover:text-white
              "
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* =====================================================
   FOOTER HEADING
===================================================== */

function FooterHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3
        className="
          font-serif
          text-[18px]
          font-semibold
          text-white

          sm:text-[19px]
        "
      >
        {children}
      </h3>

      <div
        className="
          mt-2
          h-[2px]
          w-7
          rounded-full
          bg-[#9a1e2f]
        "
      />
    </div>
  );
}

/* =====================================================
   FOOTER LINKS
===================================================== */

function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: {
    name: string;
    href: string;
  }[];
}) {
  return (
    <div>
      <FooterHeading>
        {title}
      </FooterHeading>

      <div
        className="
          mt-5
          flex
          flex-col
          gap-3
        "
      >
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="
              group
              flex
              w-fit
              items-center
              gap-1.5

              text-[13px]
              font-medium
              text-white/55

              transition-colors
              duration-300

              hover:text-[#e8aaa7]

              sm:text-[14px]
            "
          >
            {link.name}

            <ArrowUpRight
              size={12}
              strokeWidth={1.7}
              className="
                -translate-x-1
                opacity-0

                transition-all
                duration-300

                group-hover:translate-x-0
                group-hover:opacity-100
              "
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

/* =====================================================
   CONTACT ITEM
===================================================== */

function ContactItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        group
        flex
        items-start
        gap-3
      "
    >
      {/* ICON */}

      <div
        className="
          mt-[2px]
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-full

          bg-[#9a1e2f]/20
          text-[#e8aaa7]

          transition-all
          duration-300

          group-hover:bg-[#9a1e2f]
          group-hover:text-white
        "
      >
        {icon}
      </div>

      {/* CONTENT */}

      <div>
        {/* LABEL */}

        <p
          className="
            text-[10px]
            font-medium
            uppercase
            tracking-[1px]
            text-white/35
          "
        >
          {label}
        </p>

        {/* VALUE */}

        <div
          className="
            mt-1
            text-[12px]
            leading-5
            text-white/65

            sm:text-[13px]
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   SOCIAL LINK
===================================================== */

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      whileHover={{
        y: -2,
        scale: 1.04,
      }}
      whileTap={{
        scale: 0.95,
      }}
      className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-full

        border
        border-white/10

        bg-white/[0.04]
        text-white/60

        transition-colors
        duration-300

        hover:border-[#9a1e2f]
        hover:bg-[#9a1e2f]
        hover:text-white
      "
    >
      {children}
    </motion.a>
  );
}