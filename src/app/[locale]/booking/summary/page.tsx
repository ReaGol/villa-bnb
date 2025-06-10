"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { useRouter, usePathname } from "next/navigation";
import { calculatePrice } from "@/utils/calculatePrice";
import { useTranslations, useLocale } from "next-intl";

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
  const t = useTranslations("booking");
  const locale = useLocale();
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
        alert(t("validation.maxGuests"));
      }
    }
  }, []);

  const onSubmit = async (data: PersonalDetails) => {
    const bookingInfo = JSON.parse(Cookies.get("bookingInfo") || "{}");

    const checkInDate = new Date(bookingInfo.checkIn);
    const checkOutDate = new Date(bookingInfo.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today || checkOutDate < today) {
      alert(t("validation.pastDates"));
      return;
    }

    if (checkInDate > checkOutDate) {
      alert(t("validation.invalidDateRange"));
      return;
    }

    const payload = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      checkIn: bookingInfo.checkIn,
      checkOut: bookingInfo.checkOut,
      adults: bookingInfo.adults,
      children: bookingInfo.children,
      specialRequests: data.specialRequests,
      createdBy: "guest",
    };
    
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert(t("successMessage"));
      Cookies.set("confirmedBooking", JSON.stringify(payload), { expires: 7 });

      Cookies.remove("bookingInfo");
      router.push("/booking/confirmation");
    } else {
      const result = await res.json();
      alert(result.message || t("errorMessage"));
    }
  };

  return (
    <main className='flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-10'>
      <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg border'>
        <h1 className='text-3xl font-bold text-green-700 mb-6 text-center'>
          {t("summaryTitle")}
        </h1>

        {bookingInfo ? (
          <div className='space-y-4 text-lg mb-6'>
            <div className='flex justify-between border-b pb-2'>
              <span className='font-semibold text-gray-600'>{t("fields.checkIn")}</span>
              <span>
                {new Date(bookingInfo.checkIn).toLocaleDateString("he-IL")}
              </span>
            </div>

            <div className='flex justify-between border-b pb-2'>
              <span className='font-semibold text-gray-600'>{t("fields.checkOut")}</span>
              <span>
                {new Date(bookingInfo.checkOut).toLocaleDateString("he-IL")}
              </span>
            </div>

            <div className='flex justify-between border-b pb-2'>
              <span className='font-semibold text-gray-600'>{t("fields.adults")}</span>
              <span>{bookingInfo.adults}</span>
            </div>

            <div className='flex justify-between border-b pb-2'>
              <span className='font-semibold text-gray-600'>{t("fields.children")}</span>
              <span>{bookingInfo.children}</span>
            </div>

            {priceDetails && (
              <div className='flex justify-between border-b pb-2 mt-2'>
                <span className='font-semibold text-gray-600'>{t("fields.price")}</span>
                <span>
                  €{priceDetails.totalPrice}
                  {locale !== "en" && priceDetails.discount ? ` (${priceDetails.discount})` : null}
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className='text-red-500 text-center mb-6'>
            {t("summaryNotFound")}
          </p>
        )}

        <h2 className='text-2xl font-bold text-green-700 mb-4 text-center'>
          {t("personalDetailsTitle")}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label className='block mb-2 font-bold'>{t("form.fullName") + ":"}</label>
            <input
              type='text'
              {...register("fullName", { required: t("validation.fullNameRequired") })}
              className='border p-2 w-full rounded'
              placeholder={t("placeholders.fullName")}
            />
            {errors.fullName && (
              <p className='text-red-500'>{errors.fullName.message}</p>
            )}
          </div>
          <div>
            <label className='block mb-2 font-bold'>{t("form.phone") + ":"}</label>
            <input
              type='tel'
              {...register("phone", { required: t("validation.phoneRequired") })}
              className={`border p-2 w-full rounded ${locale === 'en' ? 'text-left' : 'text-right'} ${locale === 'en' ? 'ltr' : 'rtl'} placeholder:${locale === 'en' ? 'text-left' : 'text-right'}`}
              placeholder={t("placeholders.phone")}
              dir={locale === 'en' ? 'ltr' : 'rtl'}
            />
            {errors.phone && (
              <p className='text-red-500'>{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className='block mb-2 font-bold'>{t("form.email") + ":"}</label>
            <input
              type='email'
              {...register("email", { required: t("validation.emailRequired") })}
              className='border p-2 w-full rounded'
              placeholder={t("placeholders.email")}
            />
            {errors.email && (
              <p className='text-red-500'>{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className='block mb-2 font-bold'>{t("form.specialRequests") + ":"}</label>
            <textarea
              {...register("specialRequests")}
              className='border p-2 w-full rounded'
              rows={3}
              placeholder={t("placeholders.specialRequests")}
            />
          </div>

          <button
            type='submit'
            className='bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded text-lg font-semibold w-full'
          >
            {t("confirm")}
          </button>
          <div className='mt-6 text-center'>
            <button
              type='button'
              onClick={() => router.push("/booking")}
              className='bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded text-sm font-semibold'
            >
              {t("edit")}
            </button>

            <button
              type='button'
              onClick={() => router.push("/")}
              className='block mt-3 underline text-green-700 hover:text-green-900 text-sm'
            >
              {t("backToHome")}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
