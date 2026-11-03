"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import {
  ArrowUpRight,
  Clock3,
  MapPin,
  Navigation,
  Phone,
  Sparkles,
} from "lucide-react";

export default function BakeryLocation() {
  return (
    <section
      id="location"
      className="
        relative
        overflow-hidden
        bg-[#f7efeb]
        py-12
        sm:py-14
        lg:py-16
      "
    >
      {/* =========================================
          BACKGROUND DECORATION
      ========================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-[190px]
          -top-[180px]
          h-[420px]
          w-[420px]
          rounded-full
          border
          border-[#9a1e2f]/[0.05]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-[200px]
          -right-[180px]
          h-[440px]
          w-[440px]
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
        {/* =========================================
            SECTION HEADING
        ========================================== */}

        <div
          className="
            mb-8
            grid
            grid-cols-1
            gap-5
            lg:grid-cols-[1fr_420px]
            lg:items-end
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              x: -25,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-[#f3dfe0]
                  text-[#9a1e2f]
                "
              >
                <MapPin size={13} />
              </span>

              <span
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[2.7px]
                  text-[#9a1e2f]
                "
              >
                Find Our Location
              </span>
            </div>

            <h2
              className="
                font-serif
                text-[34px]
                font-medium
                leading-[1.08]
                tracking-[-1px]
                text-[#281b18]

                sm:text-[40px]
                lg:text-[46px]
              "
            >
              Come Say Hello,
              <br />

              <span className="italic text-[#9a1e2f]">
                We&apos;d Love To Meet You.
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{
              opacity: 0,
              x: 25,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            className="
              text-[11px]
              leading-6
              text-[#806d67]
              sm:text-[12px]
              lg:text-[13px]
            "
          >
            Visit Alibros Infotech Pvt Ltd. Use the map below
            to find our location and plan your visit.
          </motion.p>
        </div>

        {/* =========================================
            LOCATION CARD
        ========================================== */}

        <div
          className="
            grid
            grid-cols-1
            overflow-hidden
            rounded-[30px]
            border
            border-[#e5d4ce]
            bg-white
            shadow-[0_18px_55px_rgba(70,30,30,0.07)]

            lg:grid-cols-[1.25fr_0.75fr]
          "
        >
          {/* =====================================
              LEFT - REAL GOOGLE MAP
          ====================================== */}

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
              amount: 0.15,
            }}
            transition={{
              duration: 0.65,
            }}
            className="
              relative
              min-h-[380px]
              overflow-hidden
              bg-[#eee6e1]

              sm:min-h-[430px]
              lg:min-h-[520px]
            "
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3659.693720091569!2d85.46547937388229!3d23.471509899428707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f4fb0072937b57%3A0xb54354dd2dfbc4be!2sAlibros%20Infotech%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1791264639978!5m2!1sen!2sin"
              title="Alibros Infotech Pvt Ltd Location"
              className="
                absolute
                inset-0
                h-full
                w-full
                border-0
              "
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </motion.div>

          {/* =====================================
              RIGHT - LOCATION DETAILS
          ====================================== */}

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
              amount: 0.15,
            }}
            transition={{
              duration: 0.65,
            }}
            className="
              relative
              overflow-hidden
              bg-[#fffdfb]
              px-6
              py-8

              sm:px-8
              sm:py-9

              lg:px-9
              lg:py-10
            "
          >
            {/* DECORATION */}

            <div
              className="
                pointer-events-none
                absolute
                -right-[120px]
                -top-[130px]
                h-[280px]
                w-[280px]
                rounded-full
                border
                border-[#9a1e2f]/[0.05]
              "
            />

            <div className="relative z-10">
              {/* LABEL */}

              <div
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-[#f5e4e4]
                  px-3.5
                  py-2
                "
              >
                <Sparkles
                  size={11}
                  className="text-[#9a1e2f]"
                />

                <span
                  className="
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[1.7px]
                    text-[#9a1e2f]
                  "
                >
                  Visit Us
                </span>
              </div>

              {/* TITLE */}

              <h3
                className="
                  font-serif
                  text-[28px]
                  font-semibold
                  leading-[1.1]
                  text-[#30211d]
                  sm:text-[32px]
                "
              >
                Alibros
                <br />

                <span className="italic text-[#9a1e2f]">
                  Infotech Pvt Ltd.
                </span>
              </h3>

              <p
                className="
                  mt-4
                  max-w-[360px]
                  text-[10px]
                  leading-[1.8]
                  text-[#83706a]
                "
              >
                Use the map to locate us easily. You can also
                open Google Maps directly to get directions
                from your current location.
              </p>

              {/* =================================
                  INFO
              ================================== */}

              <div className="mt-7 space-y-3">
                <LocationInfo
                  icon={<MapPin size={16} />}
                  label="Location"
                  value="Alibros Infotech Pvt Ltd"
                />

                <LocationInfo
                  icon={<Phone size={16} />}
                  label="Phone"
                  value="+91 XXXXX XXXXX"
                />

                <LocationInfo
                  icon={<Clock3 size={16} />}
                  label="Opening Hours"
                  value="Monday - Saturday"
                />
              </div>

              {/* DIVIDER */}

              <div className="my-6 h-px bg-[#eadbd5]" />

              {/* =================================
                  DIRECTIONS
              ================================== */}

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
                  Need Directions?
                </p>

                <p
                  className="
                    mt-2
                    text-[9px]
                    leading-[1.7]
                    text-[#8b7872]
                  "
                >
                  Open the location in Google Maps and get
                  directions directly.
                </p>

                <Link
                  href="https://www.google.com/maps/search/?api=1&query=Alibros%20Infotech%20Pvt%20Ltd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    group
                    mt-5
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-[16px]
                    bg-[#9a1e2f]
                    px-5
                    py-4
                    text-white
                    shadow-[0_10px_25px_rgba(154,30,47,0.16)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#7e1726]
                  "
                >
                  <div className="flex items-center gap-3">
                    <Navigation size={15} />

                    <div>
                      <p
                        className="
                          text-[7px]
                          uppercase
                          tracking-[1.5px]
                          text-white/60
                        "
                      >
                        Open In Maps
                      </p>

                      <p
                        className="
                          mt-0.5
                          font-serif
                          text-[14px]
                          font-semibold
                        "
                      >
                        Get Directions
                      </p>
                    </div>
                  </div>

                  <span
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      bg-white/10
                      transition-all
                      duration-300

                      group-hover:bg-white
                      group-hover:text-[#9a1e2f]
                    "
                  >
                    <ArrowUpRight
                      size={14}
                      className="
                        transition-transform
                        duration-300
                        group-hover:rotate-45
                      "
                    />
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* =====================================================
   LOCATION INFO
===================================================== */

function LocationInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        group
        flex
        items-center
        gap-4
        rounded-[16px]
        border
        border-[#eadbd5]
        bg-[#fffaf7]
        px-4
        py-3.5
        transition-all
        duration-300

        hover:border-[#dcbeb8]
        hover:bg-white
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
          rounded-[12px]
          bg-[#f3dfe0]
          text-[#9a1e2f]
          transition-all
          duration-300

          group-hover:bg-[#9a1e2f]
          group-hover:text-white
        "
      >
        {icon}
      </div>

      <div>
        <p
          className="
            text-[7px]
            font-bold
            uppercase
            tracking-[1.4px]
            text-[#a08c86]
          "
        >
          {label}
        </p>

        <p
          className="
            mt-1
            text-[9px]
            font-semibold
            leading-[1.5]
            text-[#493631]
          "
        >
          {value}
        </p>
      </div>
    </div>
  );
}