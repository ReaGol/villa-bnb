"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";

interface ContactFormData {
  fullName: string;
  phone: string;
  email: string;
  message: string;
}

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = (data: ContactFormData) => {
    console.log("Contact Form Data:", data);
    setIsSubmitted(true);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div>
        <label className='block mb-2 font-bold'>שם מלא:</label>
        <input
          type='text'
          {...register("fullName", { required: "נא להזין שם מלא" })}
          className='border p-2 w-full rounded'
          placeholder='הכנס את שמך המלא'
        />
        {errors.fullName && (
          <p className='text-red-500 text-sm'>{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className='block mb-2 font-bold'>טלפון:</label>
        <input
          type='tel'
          {...register("phone", { required: "נא להזין מספר טלפון" })}
          className='border p-2 w-full rounded placeholder:text-right'
          placeholder='הכנס את מספר הטלפון שלך'
        />
        {errors.phone && (
          <p className='text-red-500 text-sm'>{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className='block mb-2 font-bold'>אימייל:</label>
        <input
          type='email'
          {...register("email", {
            required: "נא להזין כתובת אימייל",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "כתובת אימייל לא תקינה",
            },
          })}
          className='border p-2 w-full rounded'
          placeholder='הכנס את כתובת האימייל שלך'
        />
        {errors.email && (
          <p className='text-red-500 text-sm'>{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className='block mb-2 font-bold'>הודעה:</label>
        <textarea
          {...register("message", { required: "נא להזין הודעה" })}
          className='border p-2 w-full rounded'
          rows={4}
          placeholder='כתוב כאן את הודעתך...'
        />
        {errors.message && (
          <p className='text-red-500 text-sm'>{errors.message.message}</p>
        )}
      </div>

      <button
        type='submit'
        className='bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded text-lg font-semibold w-full'
      >
        שלח הודעה
      </button>

      {isSubmitted && (
        <p className='text-green-600 mt-4 text-center'>
           ההודעה נשלחה בהצלחה! נחזור אליכם בהקדם.
        </p>
      )}
    </form>
  );
}
