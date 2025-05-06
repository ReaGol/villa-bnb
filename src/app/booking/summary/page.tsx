"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

interface BookingInfo {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  specialRequests: string;
}

interface PersonalDetails {
  fullName: string;
  phone: string;
  email: string;
}

export default function BookingSummaryPage() {
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalDetails>();

  useEffect(() => {
    const cookieData = Cookies.get("bookingInfo");
    if (cookieData) {
      setBookingInfo(JSON.parse(cookieData));
    }
  }, []);

const router = useRouter();

const onSubmit = (data: PersonalDetails) => {
  const combinedData = {
    ...bookingInfo,
    ...data,
  };

  console.log("🚀 הזמנה הושלמה:", combinedData);

  Cookies.set("confirmedBooking", JSON.stringify(combinedData), {
    expires: 7,
  });

  router.push("/booking/confirmation");


 };

  return (
    <main className='flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-10'>
      <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg border border-green-400'>
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

            <div className='border-b pb-2'>
              <span className='font-semibold text-gray-600 block mb-1'>
                בקשות מיוחדות:
              </span>
              <p className='text-gray-700 whitespace-pre-wrap'>
                {bookingInfo.specialRequests?.trim() !== ""
                  ? bookingInfo.specialRequests
                  : "אין"}
              </p>
            </div>
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

          <button
            type='submit'
            className='bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded text-lg font-semibold w-full'
          >
            אשר הזמנה
          </button>
        </form>
      </div>
    </main>
  );
}
