"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CakeSlice,
  CalendarDays,
  Clock3,
  Upload,
  User,
  Phone,
  Mail,
  Palette,
  MessageSquare,
  Truck,
  Store,
  Send,
  ImagePlus,
  Check,
} from "lucide-react";

/* =====================================================
   TYPES
===================================================== */

type DeliveryType = "delivery" | "pickup";

interface FormData {
  name: string;
  phone: string;
  email: string;

  occasion: string;
  flavour: string;
  weight: string;
  shape: string;
  cakeType: string;

  theme: string;
  colors: string;
  cakeMessage: string;

  requiredDate: string;
  requiredTime: string;

  deliveryType: DeliveryType;
  address: string;

  instructions: string;
}

/* =====================================================
   OPTIONS
===================================================== */

const occasions = [
  "Birthday",
  "Anniversary",
  "Wedding",
  "Baby Shower",
  "Engagement",
  "Kids Birthday",
  "Corporate Event",
  "Other",
];

const flavours = [
  "Chocolate",
  "Black Forest",
  "Red Velvet",
  "Butterscotch",
  "Vanilla",
  "Pineapple",
  "Strawberry",
  "Custom / Other",
];

const weights = [
  "500g",
  "1 Kg",
  "1.5 Kg",
  "2 Kg",
  "3 Kg",
  "5 Kg+",
];

const shapes = [
  "Round",
  "Square",
  "Heart",
  "Rectangle",
  "Custom Shape",
];

/* =====================================================
   COMPONENT
===================================================== */

export default function CustomCakeForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",

    occasion: "",
    flavour: "",
    weight: "",
    shape: "",
    cakeType: "Eggless",

    theme: "",
    colors: "",
    cakeMessage: "",

    requiredDate: "",
    requiredTime: "",

    deliveryType: "delivery",
    address: "",

    instructions: "",
  });

  const [referenceImage, setReferenceImage] =
    useState<File | null>(null);

  /* ===================================================
     INPUT CHANGE
  =================================================== */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ===================================================
     SUBMIT
  =================================================== */

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    console.log("Custom Cake Request:", {
      ...formData,
      referenceImage,
    });

    /*
      Later Laravel API:

      const data = new FormData();

      data.append("name", formData.name);
      data.append("phone", formData.phone);
      ...

      if (referenceImage) {
        data.append("reference_image", referenceImage);
      }

      await API.post("/custom-cake-requests", data);
    */
  };

  return (
    <section
      id="custom-cake-form"
      className="
        overflow-hidden
        bg-[#f7eeea]
        py-12
        sm:py-16
        lg:py-20
      "
    >
      <div className="mx-auto max-w-[1350px] px-5 sm:px-8 lg:px-12">

        {/* =================================================
            HEADING
        ================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="
            mx-auto
            mb-10
            max-w-[720px]
            text-center
          "
        >
          <div
            className="
              mb-3
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#e4cbc5]
              bg-white/60
              px-3
              py-2
            "
          >
            <Palette
              size={13}
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
              Design Your Cake
            </span>
          </div>

          <h2
            className="
              font-serif
              text-[34px]
              font-medium
              leading-tight
              tracking-[-1px]
              text-[#281b18]
              sm:text-[43px]
              lg:text-[50px]
            "
          >
            Tell Us About Your{" "}
            <span className="italic text-[#9a1e2f]">
              Dream Cake
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-[570px]
              text-[12px]
              leading-6
              text-[#806d67]
              sm:text-[13px]
            "
          >
            Share your cake details and design idea.
            Our bakery team will review your request and
            contact you to confirm the design and final price.
          </p>
        </motion.div>

        {/* =================================================
            FORM CARD
        ================================================== */}

        <motion.form
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.65 }}
          onSubmit={handleSubmit}
          className="
            overflow-hidden
            rounded-[28px]
            border
            border-[#ead8d2]
            bg-white
            shadow-[0_20px_60px_rgba(70,30,30,0.08)]
          "
        >
          {/* =================================================
              01 CUSTOMER DETAILS
          ================================================== */}

          <FormSection
            number="01"
            title="Your Details"
            description="Tell us how we can contact you."
          >
            <div
              className="
                grid
                grid-cols-1
                gap-4
                md:grid-cols-2
                lg:grid-cols-3
              "
            >
              <InputField
                label="Your Name"
                name="name"
                value={formData.name}
                placeholder="Enter your full name"
                icon={<User size={15} />}
                onChange={handleChange}
                required
              />

              <InputField
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                placeholder="Enter phone number"
                icon={<Phone size={15} />}
                onChange={handleChange}
                required
              />

              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                placeholder="Enter email (optional)"
                icon={<Mail size={15} />}
                onChange={handleChange}
              />
            </div>
          </FormSection>

          {/* =================================================
              02 CAKE DETAILS
          ================================================== */}

          <FormSection
            number="02"
            title="Cake Details"
            description="Choose the basic details of your cake."
          >
            <div
              className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
                lg:grid-cols-4
              "
            >
              <SelectField
                label="Occasion"
                name="occasion"
                value={formData.occasion}
                options={occasions}
                placeholder="Select occasion"
                onChange={handleChange}
                required
              />

              <SelectField
                label="Flavour"
                name="flavour"
                value={formData.flavour}
                options={flavours}
                placeholder="Select flavour"
                onChange={handleChange}
                required
              />

              <SelectField
                label="Cake Weight"
                name="weight"
                value={formData.weight}
                options={weights}
                placeholder="Select weight"
                onChange={handleChange}
                required
              />

              <SelectField
                label="Cake Shape"
                name="shape"
                value={formData.shape}
                options={shapes}
                placeholder="Select shape"
                onChange={handleChange}
                required
              />
            </div>

            {/* EGG / EGGLESS */}

            <div className="mt-5">
              <label
                className="
                  mb-2
                  block
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[1px]
                  text-[#67534d]
                "
              >
                Cake Preference
              </label>

              <div className="flex flex-wrap gap-2">
                {["Eggless", "With Egg"].map((type) => {
                  const active =
                    formData.cakeType === type;

                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          cakeType: type,
                        }))
                      }
                      className={`
                        flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        px-4
                        py-2.5
                        text-[10px]
                        font-semibold
                        transition-all
                        duration-300

                        ${
                          active
                            ? "border-[#9a1e2f] bg-[#9a1e2f] text-white"
                            : "border-[#e5d5d0] bg-[#fffaf8] text-[#715e58] hover:border-[#9a1e2f]"
                        }
                      `}
                    >
                      {active && <Check size={12} />}

                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
          </FormSection>

          {/* =================================================
              03 DESIGN
          ================================================== */}

          <FormSection
            number="03"
            title="Cake Design"
            description="Tell us how you want your cake to look."
          >
            <div
              className="
                grid
                grid-cols-1
                gap-4
                md:grid-cols-2
              "
            >
              <InputField
                label="Theme / Design"
                name="theme"
                value={formData.theme}
                placeholder="e.g. Football, Floral, Princess..."
                icon={<Palette size={15} />}
                onChange={handleChange}
              />

              <InputField
                label="Preferred Colors"
                name="colors"
                value={formData.colors}
                placeholder="e.g. Pink, White & Gold"
                icon={<Palette size={15} />}
                onChange={handleChange}
              />
            </div>

            <div className="mt-4">
              <InputField
                label="Message on Cake"
                name="cakeMessage"
                value={formData.cakeMessage}
                placeholder='e.g. "Happy Birthday Ayaan"'
                icon={<MessageSquare size={15} />}
                onChange={handleChange}
              />
            </div>

            {/* =========================================
                IMAGE UPLOAD
            ========================================== */}

            <div className="mt-5">
              <label
                className="
                  mb-2
                  block
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[1px]
                  text-[#67534d]
                "
              >
                Reference Image
              </label>

              <label
                className="
                  group
                  flex
                  min-h-[150px]
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center

                  rounded-[18px]

                  border
                  border-dashed
                  border-[#d9bbb4]

                  bg-[#fff9f7]

                  px-5
                  py-6

                  text-center

                  transition-all
                  duration-300

                  hover:border-[#9a1e2f]
                  hover:bg-[#fff5f3]
                "
              >
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) =>
                    setReferenceImage(
                      e.target.files?.[0] || null
                    )
                  }
                />

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center

                    rounded-full

                    bg-[#f5e1e3]
                    text-[#9a1e2f]

                    transition-transform
                    duration-300

                    group-hover:scale-105
                  "
                >
                  {referenceImage ? (
                    <ImagePlus size={18} />
                  ) : (
                    <Upload size={18} />
                  )}
                </div>

                {referenceImage ? (
                  <>
                    <p
                      className="
                        mt-3
                        text-[11px]
                        font-semibold
                        text-[#9a1e2f]
                      "
                    >
                      {referenceImage.name}
                    </p>

                    <p
                      className="
                        mt-1
                        text-[9px]
                        text-[#93817b]
                      "
                    >
                      Click to choose another image
                    </p>
                  </>
                ) : (
                  <>
                    <p
                      className="
                        mt-3
                        text-[11px]
                        font-semibold
                        text-[#4d3b36]
                      "
                    >
                      Upload Your Cake Inspiration
                    </p>

                    <p
                      className="
                        mt-1
                        text-[9px]
                        text-[#998781]
                      "
                    >
                      PNG, JPG or WEBP
                    </p>
                  </>
                )}
              </label>
            </div>
          </FormSection>

          {/* =================================================
              04 DATE + DELIVERY
          ================================================== */}

          <FormSection
            number="04"
            title="When & How?"
            description="Tell us when and how you need your cake."
          >
            <div
              className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
              "
            >
              <InputField
                label="Required Date"
                name="requiredDate"
                type="date"
                value={formData.requiredDate}
                icon={<CalendarDays size={15} />}
                onChange={handleChange}
                required
              />

              <InputField
                label="Preferred Time"
                name="requiredTime"
                type="time"
                value={formData.requiredTime}
                icon={<Clock3 size={15} />}
                onChange={handleChange}
                required
              />
            </div>

            {/* DELIVERY TYPE */}

            <div className="mt-5">
              <label
                className="
                  mb-2
                  block
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[1px]
                  text-[#67534d]
                "
              >
                Receive Your Cake
              </label>

              <div
                className="
                  grid
                  grid-cols-1
                  gap-3
                  sm:grid-cols-2
                "
              >
                <DeliveryOption
                  title="Home Delivery"
                  description="Deliver the cake to my address"
                  icon={<Truck size={18} />}
                  active={
                    formData.deliveryType === "delivery"
                  }
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      deliveryType: "delivery",
                    }))
                  }
                />

                <DeliveryOption
                  title="Store Pickup"
                  description="I'll collect it from the bakery"
                  icon={<Store size={18} />}
                  active={
                    formData.deliveryType === "pickup"
                  }
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      deliveryType: "pickup",
                    }))
                  }
                />
              </div>
            </div>

            {/* ADDRESS */}

            {formData.deliveryType === "delivery" && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <TextAreaField
                  label="Delivery Address"
                  name="address"
                  value={formData.address}
                  placeholder="House / Flat, Street, Area, City, Pincode..."
                  onChange={handleChange}
                  required
                />
              </motion.div>
            )}
          </FormSection>

          {/* =================================================
              05 SPECIAL INSTRUCTIONS
          ================================================== */}

          <FormSection
            number="05"
            title="Anything Else?"
            description="Add any special instructions for our baker."
            last
          >
            <TextAreaField
              label="Special Instructions"
              name="instructions"
              value={formData.instructions}
              placeholder="Tell us anything else about the design, decoration, ingredients or delivery..."
              onChange={handleChange}
            />

            {/* NOTICE */}

            <div
              className="
                mt-5
                flex
                items-start
                gap-3

                rounded-[16px]

                bg-[#f8eeeb]

                px-4
                py-3
              "
            >
              <CakeSlice
                size={16}
                className="
                  mt-0.5
                  shrink-0
                  text-[#9a1e2f]
                "
              />

              <p
                className="
                  text-[10px]
                  leading-5
                  text-[#796660]

                  sm:text-[11px]
                "
              >
                Submitting this form sends a{" "}
                <strong className="text-[#4c3934]">
                  custom cake request
                </strong>
                . Final price depends on cake size, flavour,
                design and customization. Our team will
                confirm the details before your order is
                finalized.
              </p>
            </div>

            {/* SUBMIT */}

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
                  max-w-[430px]
                  text-[9px]
                  leading-5
                  text-[#9a8983]

                  sm:text-[10px]
                "
              >
                Please make sure your phone number and
                required date are correct before submitting.
              </p>

              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                className="
                  group

                  inline-flex
                  items-center
                  justify-center
                  gap-2

                  rounded-full

                  bg-[#9a1e2f]

                  px-7
                  py-3.5

                  text-[11px]
                  font-semibold
                  text-white

                  shadow-[0_9px_22px_rgba(154,30,47,0.22)]

                  transition-all
                  duration-300

                  hover:-translate-y-0.5
                  hover:bg-[#781724]

                  sm:text-[12px]
                "
              >
                Submit Cake Request

                <Send
                  size={14}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </motion.button>
            </div>
          </FormSection>
        </motion.form>
      </div>
    </section>
  );
}

/* =====================================================
   FORM SECTION
===================================================== */

function FormSection({
  number,
  title,
  description,
  children,
  last = false,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`
        p-5
        sm:p-7
        lg:p-9

        ${
          !last
            ? "border-b border-[#eee2dd]"
            : ""
        }
      `}
    >
      <div
        className="
          mb-6
          flex
          items-start
          gap-4
        "
      >
        <span
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center

            rounded-full

            bg-[#9a1e2f]

            text-[9px]
            font-bold
            text-white
          "
        >
          {number}
        </span>

        <div>
          <h3
            className="
              font-serif
              text-[20px]
              font-semibold
              text-[#2c1e1a]

              sm:text-[22px]
            "
          >
            {title}
          </h3>

          <p
            className="
              mt-1
              text-[10px]
              text-[#907e78]

              sm:text-[11px]
            "
          >
            {description}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}

/* =====================================================
   INPUT FIELD
===================================================== */

function InputField({
  label,
  name,
  value,
  placeholder,
  type = "text",
  icon,
  onChange,
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label
        className="
          mb-2
          block
          text-[10px]
          font-bold
          text-[#66524c]
        "
      >
        {label}

        {required && (
          <span className="ml-1 text-[#9a1e2f]">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {icon && (
          <span
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-[#9a1e2f]
            "
          >
            {icon}
          </span>
        )}

        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          required={required}
          onChange={onChange}
          className={`
            h-[50px]
            w-full
            rounded-[14px]
            border
            border-[#e5d7d2]
            bg-[#fffaf8]
            pr-4
            text-[11px]
            text-[#3f302c]
            outline-none
            transition-all
            placeholder:text-[#b0a09a]
            focus:border-[#9a1e2f]
            focus:bg-white
            focus:shadow-[0_5px_18px_rgba(154,30,47,0.08)]

            ${icon ? "pl-11" : "pl-4"}
          `}
        />
      </div>
    </div>
  );
}

/* =====================================================
   SELECT FIELD
===================================================== */

function SelectField({
  label,
  name,
  value,
  options,
  placeholder,
  onChange,
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label
        className="
          mb-2
          block
          text-[10px]
          font-bold
          text-[#66524c]
        "
      >
        {label}

        {required && (
          <span className="ml-1 text-[#9a1e2f]">
            *
          </span>
        )}
      </label>

      <select
        name={name}
        value={value}
        required={required}
        onChange={onChange}
        className="
          h-[50px]
          w-full
          rounded-[14px]
          border
          border-[#e5d7d2]
          bg-[#fffaf8]
          px-4
          text-[11px]
          text-[#594640]
          outline-none
          transition-all
          focus:border-[#9a1e2f]
          focus:bg-white
        "
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* =====================================================
   TEXTAREA
===================================================== */

function TextAreaField({
  label,
  name,
  value,
  placeholder,
  onChange,
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label
        className="
          mb-2
          block
          text-[10px]
          font-bold
          text-[#66524c]
        "
      >
        {label}

        {required && (
          <span className="ml-1 text-[#9a1e2f]">
            *
          </span>
        )}
      </label>

      <textarea
        name={name}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        rows={4}
        className="
          w-full
          resize-none
          rounded-[14px]
          border
          border-[#e5d7d2]
          bg-[#fffaf8]
          px-4
          py-3
          text-[11px]
          leading-5
          text-[#3f302c]
          outline-none
          transition-all
          placeholder:text-[#b0a09a]
          focus:border-[#9a1e2f]
          focus:bg-white
          focus:shadow-[0_5px_18px_rgba(154,30,47,0.08)]
        "
      />
    </div>
  );
}

/* =====================================================
   DELIVERY OPTION
===================================================== */

function DeliveryOption({
  title,
  description,
  icon,
  active,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        items-center
        gap-3
        rounded-[16px]
        border
        p-4
        text-left
        transition-all
        duration-300

        ${
          active
            ? "border-[#9a1e2f] bg-[#fff3f3]"
            : "border-[#e7dad5] bg-[#fffaf8] hover:border-[#d5b7b0]"
        }
      `}
    >
      <span
        className={`
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-full

          ${
            active
              ? "bg-[#9a1e2f] text-white"
              : "bg-[#f3e3e0] text-[#9a1e2f]"
          }
        `}
      >
        {icon}
      </span>

      <div className="flex-1">
        <p
          className="
            text-[11px]
            font-semibold
            text-[#44332e]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1
            text-[9px]
            text-[#92817b]
          "
        >
          {description}
        </p>
      </div>

      <span
        className={`
          flex
          h-5
          w-5
          items-center
          justify-center
          rounded-full
          border

          ${
            active
              ? "border-[#9a1e2f] bg-[#9a1e2f] text-white"
              : "border-[#cfbdb7]"
          }
        `}
      >
        {active && <Check size={11} />}
      </span>
    </button>
  );
}