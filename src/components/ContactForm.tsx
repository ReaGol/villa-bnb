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

interface ContactFormProps {
  locale?: string;
}

export default function ContactForm() {
  const t = useTranslations("contact");
  const { locale } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          message: data.message,
          phone: data.phone,
          preferredContactMethod: data.preferredContactMethod,
        }),
      });

      
      if (res.ok) {
        
        setIsSubmitted(true);
        setErrorMessage("");
        reset();
        console.log({
          fullName: data.fullName,
          email: data.email,
          message: data.message,
          phone: data.phone,
          preferredContactMethod: data.preferredContactMethod,
        });
      } else {
        const result = await res.json();
        setErrorMessage(result.message || "שגיאה בשליחת ההודעה");
      }
    } catch (err) {
      console.error("שגיאה בשליחת ההודעה:", err);
      setErrorMessage("שגיאה בשרת. נסה שוב מאוחר יותר.");
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div>
        <label className='block mb-2 font-bold'>{t("form.name") + ":"}</label>
        <input
          type='text'
          {...register("fullName", { required: t("form.name") + " " + t("form.required") })}
          className='border p-2 w-full rounded'
          placeholder={t("form.name")}
        />
        {errors.fullName && (
          <p className='text-red-500 text-sm'>{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className='block mb-2 font-bold'>{t("form.phone") + ":"}</label>
        <input
          type='tel'
          {...register("phone", { required: t("form.phone") + " " + t("form.required") })}
          className={`border p-2 w-full rounded ${locale === 'en' ? 'text-left ltr placeholder:text-left' : 'text-right rtl placeholder:text-right'}`}
          placeholder={t("form.phone")}
          dir={locale === 'en' ? 'ltr' : 'rtl'}
        />
        {errors.phone && (
          <p className='text-red-500 text-sm'>{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className='block mb-2 font-bold'>{t("form.email") + ":"}</label>
        <input
          type='email'
          {...register("email", {
            required: t("form.email") + " " + t("form.required"),
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t("form.invalidEmail"),
            },
          })}
          className='border p-2 w-full rounded'
          placeholder={t("form.email")}
        />
        {errors.email && (
          <p className='text-red-500 text-sm'>{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className='block mb-2 font-bold'>{t("form.message") + ":"}</label>
        <textarea
          {...register("message", { required: t("form.message") + " " + t("form.required") })}
          className='border p-2 w-full rounded'
          rows={4}
          placeholder={t("form.messagePlaceholder")}
        />
        {errors.message && (
          <p className='text-red-500 text-sm'>{errors.message.message}</p>
        )}
      </div>
      <div>
        <label className='block mb-2 font-bold'>{t("form.preferredContactMethodLabel")}</label>
        <div className='space-y-2'>
          <label className='flex items-center gap-2'>
            <input
              type='radio'
              value='phone'
              {...register("preferredContactMethod", {
                required: t("form.preferredContactMethodRequired"),
              })}
            />
            {t("form.phone")}
          </label>
          <label className='flex items-center gap-2'>
            <input
              type='radio'
              value='email'
              {...register("preferredContactMethod", {
                required: t("form.preferredContactMethodRequired"),
              })}
            />
            {t("form.email")}
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
        className='bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded text-lg font-semibold w-full'
      >
        {t("form.submit")}
      </button>

      {isSubmitted && (
        <p className='text-green-600 mt-4 text-center'>
          {t("successMessage")}
        </p>
      )}

      {errorMessage && (
        <p className='text-red-500 mt-4 text-center'>{errorMessage}</p>
      )}
    </form>
  );
}
