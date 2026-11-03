"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CakeSlice,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Mail,
  MessageSquare,
  Phone,
  Sparkles,
  User,
  Wallet,
} from "lucide-react";

/* =====================================================
   TYPES
===================================================== */

type FormData = {
  name: string;
  email: string;
  phone: string;
  enquiryType: string;
  message: string;

  eventDate: string;
  cakeSize: string;
  flavour: string;
  cakeType: string;
  budget: string;
};

/* =====================================================
   OPTIONS
===================================================== */

const enquiryOptions = [
  "General Enquiry",
  "Cake Order",
  "Custom Cake",
  "Birthday Cake",
  "Wedding Cake",
  "Bulk Order",
  "Delivery Enquiry",
  "Feedback",
  "Other",
];

const cakeSizes = [
  "0.5 KG",
  "1 KG",
  "1.5 KG",
  "2 KG",
  "3 KG",
  "4 KG",
  "5 KG+",
];

const flavours = [
  "Chocolate",
  "Vanilla",
  "Black Forest",
  "Red Velvet",
  "Butterscotch",
  "Pineapple",
  "Strawberry",
  "Other",
];

/* =====================================================
   COMPONENT
===================================================== */

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    enquiryType: "",
    message: "",

    eventDate: "",
    cakeSize: "",
    flavour: "",
    cakeType: "",
    budget: "",
  });

  const [submitted, setSubmitted] = useState(false);

  /* =====================================================
     SHOW CUSTOM CAKE FIELDS
  ===================================================== */

  const showCakeFields = [
    "Custom Cake",
    "Birthday Cake",
    "Wedding Cake",
  ].includes(formData.enquiryType);

  /* =====================================================
     HANDLE CHANGE
  ===================================================== */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSubmitted(false);
  };

  /* =====================================================
     HANDLE SUBMIT
  ===================================================== */

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    /*
      Abhi frontend demo hai.

      Baad me yahan Laravel API connect kar sakte ho:

      await API.post("/contact", formData);
    */

    console.log("Contact Form:", formData);

    setSubmitted(true);
  };

  return (
    <section
      id="contact-form"
      className="
        relative
        overflow-hidden
        bg-[#f7efeb]
        py-14
        sm:py-16
        lg:py-20
      "
    >
      {/* =========================================
          BACKGROUND
      ========================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-[220px]
          bottom-[-220px]
          h-[480px]
          w-[480px]
          rounded-full
          border
          border-[#9a1e2f]/[0.06]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-[180px]
          -top-[180px]
          h-[400px]
          w-[400px]
          rounded-full
          border
          border-[#9a1e2f]/[0.06]
        "
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div
          className="
            grid
            grid-cols-1
            overflow-hidden
            rounded-[30px]
            border
            border-[#e5d3cd]
            bg-white
            shadow-[0_20px_60px_rgba(70,30,30,0.07)]
            lg:grid-cols-[0.7fr_1.3fr]
          "
        >
          {/* =================================================
              LEFT CONTENT
          ================================================== */}

          <div
            className="
              relative
              overflow-hidden
              bg-[#281916]
              px-6
              py-9
              text-white

              sm:px-9
              sm:py-11

              lg:px-10
              lg:py-12

              xl:px-12
            "
          >
            {/* DECORATIONS */}

            <div
              className="
                pointer-events-none
                absolute
                -left-[130px]
                -top-[140px]
                h-[300px]
                w-[300px]
                rounded-full
                border
                border-white/[0.06]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-[130px]
                -right-[100px]
                h-[280px]
                w-[280px]
                rounded-full
                border
                border-white/[0.06]
              "
            />

            <motion.div
              initial={{
                opacity: 0,
                x: -30,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
              }}
              className="relative z-10"
            >
              {/* LABEL */}

              <div
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/10
                  bg-white/[0.05]
                  px-4
                  py-2
                "
              >
                <MessageSquare
                  size={12}
                  className="text-[#e9aaa7]"
                />

                <span
                  className="
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[2.3px]
                    text-[#e9aaa7]
                  "
                >
                  Send A Message
                </span>
              </div>

              {/* HEADING */}

              <h2
                className="
                  font-serif
                  text-[34px]
                  font-medium
                  leading-[1.08]
                  tracking-[-1px]

                  sm:text-[40px]
                  lg:text-[44px]
                "
              >
                Tell Us What
                <br />
                You&apos;re{" "}
                <span className="italic text-[#e9aaa7]">
                  Looking For.
                </span>
              </h2>

              <p
                className="
                  mt-5
                  max-w-[390px]
                  text-[10px]
                  leading-6
                  text-white/50
                  sm:text-[11px]
                "
              >
                Have a question about our bakery, products or
                custom cakes? Fill in the form and share the
                details of your enquiry.
              </p>

              {/* DIVIDER */}

              <div className="my-8 h-px bg-white/10" />

              {/* MINI INFO */}

              <div className="space-y-5">
                <InfoItem
                  icon={<Mail size={15} />}
                  title="General Enquiry"
                  text="Questions about bakery products"
                />

                <InfoItem
                  icon={<CakeSlice size={15} />}
                  title="Custom Cake"
                  text="Tell us about your celebration"
                />

                <InfoItem
                  icon={<Phone size={15} />}
                  title="Order Support"
                  text="Questions about an existing order"
                />
              </div>

              {/* TIP CARD */}

              <div
                className="
                  mt-9
                  rounded-[18px]
                  border
                  border-white/10
                  bg-white/[0.05]
                  p-4
                "
              >
                <div className="flex gap-3">
                  <Sparkles
                    size={15}
                    className="mt-0.5 shrink-0 text-[#e9aaa7]"
                  />

                  <div>
                    <p
                      className="
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[1.5px]
                        text-[#e9aaa7]
                      "
                    >
                      Custom Cake Tip
                    </p>

                    <p
                      className="
                        mt-1.5
                        text-[9px]
                        leading-[1.7]
                        text-white/45
                      "
                    >
                      Share your event date, preferred flavour,
                      cake size and design idea so your enquiry
                      has the important details.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* =================================================
              RIGHT FORM
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 35,
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
              px-5
              py-8

              sm:px-8
              sm:py-10

              lg:px-10
              lg:py-12

              xl:px-12
            "
          >
            {/* FORM HEADER */}

            <div className="mb-7">
              <p
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[2.3px]
                  text-[#9a1e2f]
                "
              >
                Contact Form
              </p>

              <h3
                className="
                  mt-2
                  font-serif
                  text-[26px]
                  font-semibold
                  text-[#30211d]

                  sm:text-[30px]
                "
              >
                How can we help?
              </h3>

              <p
                className="
                  mt-2
                  text-[10px]
                  leading-5
                  text-[#88746e]
                "
              >
                Fields marked with * are required.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* =====================================
                  NAME + EMAIL
              ====================================== */}

              <div
                className="
                  grid
                  grid-cols-1
                  gap-5
                  sm:grid-cols-2
                "
              >
                <FormField
                  label="Full Name"
                  required
                  icon={<User size={14} />}
                >
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    className={inputClass}
                  />
                </FormField>

                <FormField
                  label="Email Address"
                  required
                  icon={<Mail size={14} />}
                >
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className={inputClass}
                  />
                </FormField>
              </div>

              {/* =====================================
                  PHONE + ENQUIRY
              ====================================== */}

              <div
                className="
                  mt-5
                  grid
                  grid-cols-1
                  gap-5
                  sm:grid-cols-2
                "
              >
                <FormField
                  label="Phone Number"
                  icon={<Phone size={14} />}
                >
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className={inputClass}
                  />
                </FormField>

                <FormField
                  label="Enquiry Type"
                  required
                  icon={<MessageSquare size={14} />}
                >
                  <div className="relative">
                    <select
                      name="enquiryType"
                      value={formData.enquiryType}
                      onChange={handleChange}
                      required
                      className={`${inputClass} appearance-none pr-10`}
                    >
                      <option value="">
                        Select enquiry type
                      </option>

                      {enquiryOptions.map((option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={14}
                      className="
                        pointer-events-none
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-[#9a1e2f]
                      "
                    />
                  </div>
                </FormField>
              </div>

              {/* =================================================
                  CUSTOM CAKE FIELDS
              ================================================== */}

              {showCakeFields && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    y: 0,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                  className="
                    mt-6
                    overflow-hidden
                    rounded-[20px]
                    border
                    border-[#ead8d2]
                    bg-[#fff8f5]
                    p-5
                  "
                >
                  {/* HEADER */}

                  <div
                    className="
                      mb-5
                      flex
                      items-start
                      gap-3
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
                      "
                    >
                      <CakeSlice size={14} />
                    </div>

                    <div>
                      <h4
                        className="
                          font-serif
                          text-[17px]
                          font-semibold
                          text-[#382621]
                        "
                      >
                        Tell us about your cake
                      </h4>

                      <p
                        className="
                          mt-1
                          text-[9px]
                          text-[#8a7771]
                        "
                      >
                        Add a few details to help describe
                        what you&apos;re planning.
                      </p>
                    </div>
                  </div>

                  {/* EVENT + SIZE */}

                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-4
                      sm:grid-cols-2
                    "
                  >
                    <FormField
                      label="Event Date"
                      icon={<CalendarDays size={13} />}
                    >
                      <input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </FormField>

                    <FormField
                      label="Cake Size"
                      icon={<CakeSlice size={13} />}
                    >
                      <div className="relative">
                        <select
                          name="cakeSize"
                          value={formData.cakeSize}
                          onChange={handleChange}
                          className={`${inputClass} appearance-none pr-9`}
                        >
                          <option value="">
                            Select size
                          </option>

                          {cakeSizes.map((size) => (
                            <option
                              key={size}
                              value={size}
                            >
                              {size}
                            </option>
                          ))}
                        </select>

                        <ChevronDown
                          size={13}
                          className="
                            pointer-events-none
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            text-[#9a1e2f]
                          "
                        />
                      </div>
                    </FormField>
                  </div>

                  {/* FLAVOUR + CAKE TYPE */}

                  <div
                    className="
                      mt-4
                      grid
                      grid-cols-1
                      gap-4
                      sm:grid-cols-2
                    "
                  >
                    <FormField
                      label="Preferred Flavour"
                      icon={<Sparkles size={13} />}
                    >
                      <div className="relative">
                        <select
                          name="flavour"
                          value={formData.flavour}
                          onChange={handleChange}
                          className={`${inputClass} appearance-none pr-9`}
                        >
                          <option value="">
                            Select flavour
                          </option>

                          {flavours.map((flavour) => (
                            <option
                              key={flavour}
                              value={flavour}
                            >
                              {flavour}
                            </option>
                          ))}
                        </select>

                        <ChevronDown
                          size={13}
                          className="
                            pointer-events-none
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            text-[#9a1e2f]
                          "
                        />
                      </div>
                    </FormField>

                    <FormField
                      label="Cake Preference"
                      icon={<CakeSlice size={13} />}
                    >
                      <div className="relative">
                        <select
                          name="cakeType"
                          value={formData.cakeType}
                          onChange={handleChange}
                          className={`${inputClass} appearance-none pr-9`}
                        >
                          <option value="">
                            Select preference
                          </option>

                          <option value="Egg">
                            With Egg
                          </option>

                          <option value="Eggless">
                            Eggless
                          </option>
                        </select>

                        <ChevronDown
                          size={13}
                          className="
                            pointer-events-none
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            text-[#9a1e2f]
                          "
                        />
                      </div>
                    </FormField>
                  </div>

                  {/* BUDGET */}

                  <div className="mt-4">
                    <FormField
                      label="Approx. Budget"
                      icon={<Wallet size={13} />}
                    >
                      <input
                        type="text"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        placeholder="Example: ₹1,500 - ₹2,500"
                        className={inputClass}
                      />
                    </FormField>
                  </div>
                </motion.div>
              )}

              {/* =====================================
                  MESSAGE
              ====================================== */}

              <div className="mt-5">
                <FormField
                  label="Your Message"
                  required
                  icon={<MessageSquare size={14} />}
                >
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder={
                      showCakeFields
                        ? "Tell us about your cake theme, colours, design or other requirements..."
                        : "Write your message here..."
                    }
                    className={`
                      ${inputClass}
                      min-h-[130px]
                      resize-none
                      py-3.5
                    `}
                  />
                </FormField>
              </div>

              {/* =====================================
                  SUCCESS
              ====================================== */}

              {submitted && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="
                    mt-5
                    flex
                    items-start
                    gap-3
                    rounded-[15px]
                    border
                    border-green-200
                    bg-green-50
                    px-4
                    py-3
                  "
                >
                  <CheckCircle2
                    size={17}
                    className="
                      mt-0.5
                      shrink-0
                      text-green-600
                    "
                  />

                  <div>
                    <p
                      className="
                        text-[10px]
                        font-semibold
                        text-green-800
                      "
                    >
                      Form data is ready.
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[8px]
                        leading-4
                        text-green-700
                      "
                    >
                      This is currently a frontend demo.
                      Connect the form to your backend API to
                      actually save or send enquiries.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* =====================================
                  SUBMIT
              ====================================== */}

              <div
                className="
                  mt-6
                  flex
                  flex-col
                  gap-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <p
                  className="
                    max-w-[330px]
                    text-[8px]
                    leading-4
                    text-[#9a8781]
                  "
                >
                  Please make sure your contact details are
                  correct before submitting your enquiry.
                </p>

                <button
                  type="submit"
                  className="
                    group
                    inline-flex
                    items-center
                    justify-center
                    gap-2.5

                    rounded-full

                    bg-[#9a1e2f]

                    px-6
                    py-3.5

                    text-[10px]
                    font-bold
                    text-white

                    shadow-[0_9px_25px_rgba(154,30,47,0.2)]

                    transition-all
                    duration-300

                    hover:-translate-y-0.5
                    hover:bg-[#7d1725]

                    sm:px-7
                  "
                >
                  Send Message

                  <ArrowRight
                    size={14}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* =====================================================
   FORM FIELD COMPONENT
===================================================== */

function FormField({
  label,
  icon,
  required = false,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className="
          mb-2
          flex
          items-center
          gap-2
          text-[9px]
          font-semibold
          text-[#57423c]
        "
      >
        {icon && (
          <span className="text-[#9a1e2f]">
            {icon}
          </span>
        )}

        {label}

        {required && (
          <span className="text-[#9a1e2f]">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

/* =====================================================
   INFO ITEM
===================================================== */

function InfoItem({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          border-white/10
          bg-white/[0.05]
          text-[#e9aaa7]
        "
      >
        {icon}
      </div>

      <div>
        <p
          className="
            text-[10px]
            font-semibold
            text-white
          "
        >
          {title}
        </p>

        <p
          className="
            mt-0.5
            text-[8px]
            text-white/40
          "
        >
          {text}
        </p>
      </div>
    </div>
  );
}

/* =====================================================
   INPUT STYLE
===================================================== */

const inputClass = `
  w-full
  rounded-[13px]
  border
  border-[#e6d7d1]
  bg-[#fffdfb]
  px-4
  py-3
  text-[10px]
  text-[#392823]
  outline-none
  transition-all
  duration-300

  placeholder:text-[#b4a39d]

  focus:border-[#9a1e2f]
  focus:ring-2
  focus:ring-[#9a1e2f]/10
`;