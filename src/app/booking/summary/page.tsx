"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { calculatePrice } from "@/utils/calculatePrice";

interface BookingInfo {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}

interface PersonalDetails {
  fullName: string;
  phone: string;
  email: string;
  specialRequests?: string;
}

export default function BookingSummaryPage() {
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [priceDetails, setPriceDetails] = useState<{
    totalPrice: number;
    nights: number;
    discount: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalDetails>();

  const router = useRouter();

  useEffect(() => {
    const cookieData = Cookies.get("bookingInfo");
    if (cookieData) {
      const parsed = JSON.parse(cookieData);
      setBookingInfo(parsed);

      const adults = Number(parsed.adults) || 0;
      const children = Number(parsed.children) || 0;
      const totalGuests = adults + children;

      if (
        parsed.checkIn &&
        parsed.checkOut &&
        totalGuests > 0 &&
        totalGuests <= 6
      ) {
        const price = calculatePrice({
          checkIn: new Date(parsed.checkIn),
          checkOut: new Date(parsed.checkOut),
          adults,
          children,
        });
        setPriceDetails(price);
      } else if (totalGuests > 6) {
        console.error("תפוסה מירבית היא 6 אנשים.");
      }
    }
  }, []);
  

  const onSubmit = async (data: PersonalDetails) => {
    
    const bookingInfo = JSON.parse(Cookies.get("bookingInfo") || "{}");

    const payload = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      checkIn: bookingInfo.checkIn,
      checkOut: bookingInfo.checkOut,
      adults: bookingInfo.adults,
      children: bookingInfo.children,
      specialRequests: data.specialRequests,
    };

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("ההזמנה נשלחה בהצלחה!");
      Cookies.set("confirmedBooking", JSON.stringify(payload), { expires: 7 });

      Cookies.remove("bookingInfo"); 
      router.push("/booking/confirmation");
    } else {
      const result = await res.json();
      alert(result.message || "שגיאה בשליחת ההזמנה");
    }
  };
  

  return (
    <main className='flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-10'>
      <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg border'>
        <h1 className='text-3xl font-bold text-green-700 mb-6 text-center'>
          סיכום ההזמנה שלך
        </h1>

        {bookingInfo ? (
          <div className='space-y-4 text-lg mb-6'>
            <div className='flex justify-between border-b pb-2'>
              <span className='font-semibold text-gray-600'>תאריך כניסה:</span>
              <span>
                {new Date(bookingInfo.checkIn).toLocaleDateString("he-IL")}
              </span>
            </div>

            <div className='flex justify-between border-b pb-2'>
              <span className='font-semibold text-gray-600'>תאריך יציאה:</span>
              <span>
                {new Date(bookingInfo.checkOut).toLocaleDateString("he-IL")}
              </span>
            </div>

            <div className='flex justify-between border-b pb-2'>
              <span className='font-semibold text-gray-600'>מבוגרים:</span>
              <span>{bookingInfo.adults}</span>
            </div>

            <div className='flex justify-between border-b pb-2'>
              <span className='font-semibold text-gray-600'>ילדים:</span>
              <span>{bookingInfo.children}</span>
            </div>

            {priceDetails && (
              <div className='flex justify-between border-b pb-2 mt-2'>
                <span className='font-semibold text-gray-600'>מחיר משוער:</span>
                <span>
                  €{priceDetails.totalPrice} ({priceDetails.discount})
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className='text-red-500 text-center mb-6'>
            לא נמצאה הזמנה. אנא חזור אחורה ובדוק זמינות מחדש.
          </p>
        )}

        <h2 className='text-2xl font-bold text-green-700 mb-4 text-center'>
          הזינו את הפרטים האישיים שלכם
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label className='block mb-2 font-bold'>שם מלא:</label>
            <input
              type='text'
              {...register("fullName", { required: "יש להזין שם מלא" })}
              className='border p-2 w-full rounded'
              placeholder='הכנס שם מלא'
            />
            {errors.fullName && (
              <p className='text-red-500'>{errors.fullName.message}</p>
            )}
          </div>
          <div>
            <label className='block mb-2 font-bold'>טלפון:</label>
            <input
              type='tel'
              {...register("phone", { required: "יש להזין מספר טלפון" })}
              className='border p-2 w-full rounded placeholder:text-right'
              placeholder='הכנס מספר טלפון'
            />
            {errors.phone && (
              <p className='text-red-500'>{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className='block mb-2 font-bold'>אימייל:</label>
            <input
              type='email'
              {...register("email", { required: "יש להזין כתובת אימייל" })}
              className='border p-2 w-full rounded'
              placeholder='הכנס כתובת אימייל'
            />
            {errors.email && (
              <p className='text-red-500'>{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className='block mb-2 font-bold'>בקשות מיוחדות:</label>
            <textarea
              {...register("specialRequests")}
              className='border p-2 w-full rounded'
              rows={3}
              placeholder='כאן אפשר לכתוב בקשות מיוחדות...'
            />
          </div>

          <button
            type='submit'
            className='bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded text-lg font-semibold w-full'
          >
            אשר הזמנה
          </button>
          <div className='mt-6 text-center'>
            <button
              type='button'
              onClick={() => router.push("/booking")}
              className='bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded text-sm font-semibold'
            >
              ערוך הזמנה
            </button>

            <button
              type='button'
              onClick={() => router.push("/")}
              className='block mt-3 underline text-green-700 hover:text-green-900 text-sm'
            >
              חזרה לדף הבית
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
