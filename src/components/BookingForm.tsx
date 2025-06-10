"use client";

import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { DatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const DatePicker = dynamic<DatePickerProps>(
  () =>
    import("react-datepicker").then(
      (mod) => mod.default as unknown as React.ComponentType<DatePickerProps>
    ),
  { ssr: false }
);

interface BookingFormData {
  dateRange: [Date | null, Date | null];
  adults: number;
  children: number;
}

interface Booking {
  checkIn: string;
  checkOut: string;
}

function getDatesBetween(start: Date, end: Date): Date[] {
  const dateArray: Date[] = [];
  const currentDate = new Date(start);
  while (currentDate <= end) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dateArray;
}

export default function BookingForm() {
  const t = useTranslations("booking");
  const {
    register,
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<BookingFormData>();

  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUnavailableDates = async () => {
      try {
        const res = await fetch("/api/unavailable-dates");
        const data: Booking[] = await res.json();

        const allDates: Date[] = [];
        data.forEach((booking) => {
          const start = new Date(booking.checkIn);
          const end = new Date(booking.checkOut);
          allDates.push(...getDatesBetween(start, end));
        });

        setUnavailableDates(allDates);
      } catch (err) {
        console.error("שגיאה בטעינת תאריכים תפוסים:", err);
      }
    };

    fetchUnavailableDates();
  }, []);

  const onSubmit = async (data: BookingFormData) => {
    const adults = Number(data.adults) || 0;
    const children = Number(data.children) || 0;
    const totalGuests = adults + children;

    if (adults < 1) {
      setError("adults", {
        type: "manual",
        message: t("validation.minAdults"),
      });
      return;
    }

    if (totalGuests > 6) {
      setError("children", {
        type: "manual",
        message: t("validation.maxGuests"),
      });
      return;
    }
    const [checkIn, checkOut] = data.dateRange;

    if (!checkIn || !checkOut) {
      setError("dateRange", {
        type: "manual",
        message: t("validation.dateRangeRequired"),
      });
      return;
    }

    if (checkIn > checkOut) {
      setError("dateRange", {
        type: "manual",
        message: t("validation.invalidDateRange"),
      });
      return;
    }

    const msPerDay = 1000 * 60 * 60 * 24;
    const nights = Math.round(
      (checkOut.getTime() - checkIn.getTime()) / msPerDay
    );

    if (nights < 3) {
      setError("dateRange", {
        type: "manual",
        message: t("validation.minNights"),
      });
      return;
    }

    Cookies.set(
      "bookingInfo",
      JSON.stringify({
        checkIn: data.dateRange[0]?.toISOString() || "",
        checkOut: data.dateRange[1]?.toISOString() || "",
        adults: data.adults,
        children: data.children,
        fullName: "",
        phone: "",
        email: "",
        specialRequests: "",
        priceDetails: null,
      }),
      { expires: 7 }
    );

    router.push("/booking/summary");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-6 max-w-lg mx-auto bg-white p-6 rounded shadow'
    >
      <div>
        <label className='block mb-4 font-bold text-center text-xl'>
          {t("form.range")}
        </label>
        <div className='flex justify-center'>
          <div className='w-full max-w-lg bg-white rounded-lg p-4 shadow'>
            <Controller
              name='dateRange'
              control={control}
              rules={{ required: t("validation.dateRangeRequired") }}
              render={({ field }) => (
                <DatePicker
                  selectsRange
                  startDate={field.value?.[0]}
                  endDate={field.value?.[1]}
                  onChange={(update: [Date | null, Date | null]) => {
                    field.onChange(update);
                    if (update[0] && update[1]) {
                      let current = new Date(update[0]);
                      current.setHours(0, 0, 0, 0);
                      const end = new Date(update[1]);
                      end.setHours(0, 0, 0, 0);
                      let hasUnavailable = false;
                      while (current <= end) {
                        if (
                          unavailableDates.some(
                            (d) =>
                              d.getFullYear() === current.getFullYear() &&
                              d.getMonth() === current.getMonth() &&
                              d.getDate() === current.getDate()
                          )
                        ) {
                          hasUnavailable = true;
                          break;
                        }
                        current.setDate(current.getDate() + 1);
                      }
                      if (hasUnavailable) {
                        setError("dateRange", {
                          type: "manual",
                          message: t("validation.unavailableDates"),
                        });
                        field.onChange([null, null]);
                        return;
                      } else {
                        clearErrors("dateRange");
                      }
                    }
                  }}
                  minDate={new Date()}
                  excludeDates={unavailableDates}
                  inline
                  dateFormat='dd/MM/yyyy'
                  placeholderText={t("form.range")}
                  className='border p-2 w-full'
                />
              )}
            />
            {errors.dateRange && (
              <p className='text-red-500 text-center mt-2'>
                {errors.dateRange.message}
              </p>
            )}
          </div>
        </div>
      </div>
      <div>
        <label className='block mb-2 font-bold'>
          {t("form.adults") + ":"}
        </label>
        <input
          type='number'
          {...register("adults", {
            required: t("validation.adultsRequired"),
            min: 1,
          })}
          className='border p-2 w-full rounded'
          min={1}
          max={6}
          placeholder={t("form.adultsPlaceholder")}
        />
        {errors.adults && (
          <p className='text-red-500'>{errors.adults.message}</p>
        )}
      </div>
      <div>
        <label className='block mb-2 font-bold'>
          {t("form.children") + ":"}
        </label>
        <input
          type='number'
          {...register("children", {
            required: t("validation.childrenRequired"),
            min: 0,
          })}
          className='border p-2 w-full rounded'
          min={0}
          max={6}
          placeholder={t("form.childrenPlaceholder")}
        />
        {errors.children && (
          <p className='text-red-500'>{errors.children.message}</p>
        )}
      </div>
      <button
        type='submit'
        className='bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded text-lg font-semibold w-full'
      >
        {t("form.submit")}
      </button>
    </form>
  );
}
