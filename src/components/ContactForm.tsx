"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";

interface ContactFormData {
  fullName: string;
  phone: string;
  email: string;
  message: string;
  preferredContactMethod: "phone" | "email";
}

export default function ContactForm() {
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
      <div>
        <label className='block mb-2 font-bold'>איך ניצור איתך קשר?</label>
        <div className='space-y-2'>
          <label className='flex items-center gap-2'>
            <input
              type='radio'
              value='phone'
              {...register("preferredContactMethod", {
                required: "יש לבחור דרך יצירת קשר",
              })}
              />
            טלפון
          </label>
          <label className='flex items-center gap-2'>
            <input
              type='radio'
              value='email'
              {...register("preferredContactMethod", {
                required: "יש לבחור דרך יצירת קשר",
              })}
              />
            אימייל
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
        שלח הודעה
      </button>

      {isSubmitted && (
        <p className='text-green-600 mt-4 text-center'>
          ההודעה נשלחה בהצלחה! נחזור אליכם בהקדם.
        </p>
      )}

      {errorMessage && (
        <p className='text-red-500 mt-4 text-center'>{errorMessage}</p>
      )}
    </form>
  );
}
