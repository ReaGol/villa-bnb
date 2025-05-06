"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface BookingConfirmation {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  specialRequests: string;
  fullName: string;
  phone: string;
  email: string;
}

export default function BookingConfirmationPage() {
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const data = Cookies.get("confirmedBooking");
    if (data) {
      setConfirmation(JSON.parse(data));
    }
  }, []);

  return (
    <main className='flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-10'>
      <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg border border-green-400'>
        <h1 className='text-3xl font-bold text-green-700 mb-6 text-center'>
          תודה על הזמנתך! ניצור עמך קשר בהקדם 💚
        </h1>

        {confirmation ? (
          <div className='space-y-4 text-lg'>
            <div className='flex justify-between border-b pb-2'>
              <span className='font-semibold text-gray-600'>תאריך כניסה:</span>
              <span>
                {new Date(confirmation.checkIn).toLocaleDateString("he-IL")}
              </span>
            </div>

            <div className='flex justify-between border-b pb-2'>
              <span className='font-semibold text-gray-600'>תאריך יציאה:</span>
              <span>
                {new Date(confirmation.checkOut).toLocaleDateString("he-IL")}
              </span>
            </div>

            <div className='flex justify-between border-b pb-2'>
              <span className='font-semibold text-gray-600'>מבוגרים:</span>
              <span>{confirmation.adults}</span>
            </div>

            <div className='flex justify-between border-b pb-2'>
              <span className='font-semibold text-gray-600'>ילדים:</span>
              <span>{confirmation.children}</span>
            </div>

            <div className='border-b pb-2'>
              <span className='font-semibold text-gray-600 block mb-1'>
                בקשות מיוחדות:
              </span>
              <p className='text-gray-700 whitespace-pre-wrap'>
                {confirmation.specialRequests?.trim() !== ""
                  ? confirmation.specialRequests
                  : "אין"}
              </p>
            </div>

            <div className='border-b pb-2 mt-4'>
              <span className='font-semibold text-gray-600 block mb-1'>
                שם מלא:
              </span>
              <p>{confirmation.fullName}</p>
            </div>

            <div className='border-b pb-2'>
              <span className='font-semibold text-gray-600 block mb-1'>
                טלפון:
              </span>
              <p>{confirmation.phone}</p>
            </div>

            <div className='border-b pb-2'>
              <span className='font-semibold text-gray-600 block mb-1'>
                אימייל:
              </span>
              <p>{confirmation.email}</p>
            </div>
          </div>
        ) : (
          <p className='text-red-500 text-center'>
            לא נמצאה הזמנה. אנא חזור לדף הבית.
          </p>
        )}

        <div className='mt-8 text-center'>
          <button
            onClick={() => router.push("/")}
            className='bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded text-lg font-semibold'
          >
            חזרה לדף הבית
          </button>
        </div>
      </div>
    </main>
  );
}
