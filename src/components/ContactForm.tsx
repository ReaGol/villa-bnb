"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

interface ContactFormData {
  fullName: string;
  phone: string;
  email: string;
  message: string;
  preferredContactMethod: "phone" | "email";
}

export default function ContactForm() {
  const t = useTranslations();
  const { locale } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ContactFormData>();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      if (res.ok) {
        setIsSubmitted(true);
        setErrorMessage("");
        reset();
      } else {
        const result = await res.json();
  
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            setError(field as keyof ContactFormData, {
              type: "server",
              message: Array.isArray(messages) ? messages[0] : messages,
            });
          });
        } else {
          setErrorMessage(result.message || "שגיאה בשליחת ההודעה");
        }
      }
    } catch (err) {
      console.error("שגיאה בשליחת ההודעה:", err);
      setErrorMessage("שגיאה בשרת. נסה שוב מאוחר יותר.");
    }
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div>
        <label className='block mb-2 font-bold'>
          {t("contact.form.name") + ":"}
        </label>
        <input
          type='text'
          {...register("fullName", {
            required: t("validation.fullNameRequired"),
          })}
          className='border p-2 w-full rounded'
          placeholder={t("contact.form.name")}
        />
        {errors.fullName && (
          <p className='text-red-500 text-sm'>{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className='block mb-2 font-bold'>
          {t("contact.form.phone") + ":"}
        </label>
        <input
          type='tel'
          {...register("phone", { required: t("validation.phoneRequired") })}
          className={`border p-2 w-full rounded ${
            locale === "en"
              ? "text-left ltr placeholder:text-left"
              : "text-right rtl placeholder:text-right"
          }`}
          placeholder={t("contact.form.phone")}
          dir={locale === "en" ? "ltr" : "rtl"}
        />
        {errors.phone && (
          <p className='text-red-500 text-sm'>{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className='block mb-2 font-bold'>
          {t("contact.form.email") + ":"}
        </label>
        <input
          type='email'
          {...register("email", {
            required: t("validation.emailRequired"),
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t("validation.invalidEmail"),
            },
          })}
          className='border p-2 w-full rounded'
          placeholder={t("contact.form.email")}
        />
        {errors.email && (
          <p className='text-red-500 text-sm'>{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className='block mb-2 font-bold'>
          {t("contact.form.message") + ":"}
        </label>
        <textarea
          {...register("message", {
            required: t("validation.messageRequired"),
          })}
          className='border p-2 w-full rounded'
          rows={4}
          placeholder={t("contact.form.messagePlaceholder")}
        />
        {errors.message && (
          <p className='text-red-500 text-sm'>{errors.message.message}</p>
        )}
      </div>

      <div>
        <label className='block mb-2 font-bold'>
          {t("contact.form.preferredContactMethodLabel")}
        </label>
        <div className='space-y-2'>
          <label className='flex items-center gap-2'>
            <input
              type='radio'
              value='phone'
              {...register("preferredContactMethod", {
                required: t("validation.preferredContactMethodRequired"),
              })}
            />
            {t("contact.form.phone")}
          </label>
          <label className='flex items-center gap-2'>
            <input
              type='radio'
              value='email'
              {...register("preferredContactMethod", {
                required: t("validation.preferredContactMethodRequired"),
              })}
            />
            {t("contact.form.email")}
          </label>
        </div>
        {errors.preferredContactMethod && (
          <p className='text-red-500 text-sm'>
            {errors.preferredContactMethod.message}
          </p>
        )}
      </div>

      <button
        type='submit'
        className='bg-sky-600 hover:bg-sky-700 text-white py-3 px-6 rounded text-lg font-semibold w-full'
      >
        {t("contact.form.submit")}
      </button>

      {isSubmitted && (
        <p className='text-sky-600 mt-4 text-center'>
          {t("contact.successMessage")}
        </p>
      )}

      {errorMessage && (
        <p className='text-red-500 mt-4 text-center'>{errorMessage}</p>
      )}
    </form>
  );
}
