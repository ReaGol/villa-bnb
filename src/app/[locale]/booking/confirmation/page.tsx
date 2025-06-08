"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("booking.confirmation");

  useEffect(() => {
    const data = Cookies.get("confirmedBooking");
    if (data) {
      setConfirmation(JSON.parse(data));
      Cookies.remove("bookingInfo");
      Cookies.remove("confirmedBooking");
    }
  }, []);

  return (
    <main className='flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-10'>
      <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg border'>
        <h1 className='text-3xl font-bold text-green-700 mb-6 text-center'>
          {t("title")}
        </h1>

        {confirmation ? (
          <div className='space-y-4 text-lg'>
            <div className='flex justify-between border-b pb-2'>
              <span className='font-semibold text-gray-600'>
                {t("fields.checkIn")}
              </span>
              <span>
                {new Date(confirmation.checkIn).toLocaleDateString("he-IL")}
              </span>
            </div>

            <div className='flex justify-between border-b pb-2'>
              <span className='font-semibold text-gray-600'>
                {t("fields.checkOut")}
              </span>
              <span>
                {new Date(confirmation.checkOut).toLocaleDateString("he-IL")}
              </span>
            </div>

            <div className='flex justify-between border-b pb-2'>
              <span className='font-semibold text-gray-600'>
                {t("fields.adults")}
              </span>
              <span>{confirmation.adults}</span>
            </div>

            <div className='flex justify-between border-b pb-2'>
              <span className='font-semibold text-gray-600'>
                {t("fields.children")}
              </span>
              <span>{confirmation.children}</span>
            </div>

            <div className='border-b pb-2'>
              <span className='font-semibold text-gray-600 block mb-1'>
                {t("fields.specialRequests")}
              </span>
              <p className='text-gray-700 whitespace-pre-wrap'>
                {confirmation.specialRequests?.trim() !== ""
                  ? confirmation.specialRequests
                  : t("noSpecialRequests")}
              </p>
            </div>

            <div className='border-b pb-2 mt-4'>
              <span className='font-semibold text-gray-600 block mb-1'>
                {t("fields.fullName")}
              </span>
              <p>{confirmation.fullName}</p>
            </div>

            <div className='border-b pb-2'>
              <span className='font-semibold text-gray-600 block mb-1'>
                {t("fields.phone")}
              </span>
              <p>{confirmation.phone}</p>
            </div>

            <div className='border-b pb-2'>
              <span className='font-semibold text-gray-600 block mb-1'>
                {t("fields.email")}
              </span>
              <p>{confirmation.email}</p>
            </div>
          </div>
        ) : (
          <p className='text-red-500 text-center'>{t("notFound")}</p>
        )}

        <div className='mt-8 text-center'>
          <button
            onClick={() => router.push("/")}
            className='bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded text-lg font-semibold'
          >
            {t("backToHome", { default: "Back to Home" })}
          </button>
        </div>
      </div>
    </main>
  );
}
