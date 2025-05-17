"use client";

import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { DatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Cookies from "js-cookie";

const DatePicker = dynamic<DatePickerProps>(
  () => import("react-datepicker").then((mod) => mod.default as unknown as React.ComponentType<DatePickerProps>),
  { ssr: false }
);


interface BookingFormData {
  dateRange: [Date | null, Date | null];
  adults: number;
  children: number;
}

export default function BookingForm() {
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<BookingFormData>();

  const router = useRouter();

  const disabledDates = [
    new Date(2025, 4, 10),
    new Date(2025, 4, 15),
    new Date(2025, 4, 20),
  ];

  const onSubmit = async (data: BookingFormData) => {
    const adults = Number(data.adults) || 0;
    const children = Number(data.children) || 0;
    const totalGuests = adults + children;

    if (adults < 1) {
      setError("adults", {
        type: "manual",
        message: "לפחות מבוגר אחד חייב להיות בהזמנה.",
      });
      return;
    }

    if (totalGuests > 6) {
      setError("children", {
        type: "manual",
        message: 'סה"כ מספר האורחים לא יכול להיות יותר מ-6.',
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
          בחרו טווח תאריכים:
        </label>

        <div className='flex justify-center'>
          <div className='w-full max-w-lg bg-white rounded-lg p-4 shadow'>
            <Controller
              name='dateRange'
              control={control}
              rules={{ required: "יש לבחור טווח תאריכים" }}
              render={({ field }) => (
                <DatePicker
                  selectsRange
                  startDate={field.value?.[0]}
                  endDate={field.value?.[1]}
                  onChange={(update: [Date | null, Date | null]) => {
                    field.onChange(update);
                  }}
                  excludeDates={disabledDates}
                  inline
                  dateFormat='dd/MM/yyyy'
                  placeholderText='בחר טווח תאריכים'
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
        <label className='block mb-2 font-bold'>מבוגרים:</label>
        <input
          type='number'
          {...register("adults", { required: "יש לבחור מספר מבוגרים", min: 1 })}
          className='border p-2 w-full rounded'
          min={1}
          max={6}
          placeholder='הכנס מספר מבוגרים'
        />
        {errors.adults && (
          <p className='text-red-500'>{errors.adults.message}</p>
        )}
      </div>

      <div>
        <label className='block mb-2 font-bold'>ילדים:</label>
        <input
          type='number'
          {...register("children", { required: "יש לבחור מספר ילדים", min: 0 })}
          className='border p-2 w-full rounded'
          min={0}
          max={6}
          placeholder='הכנס מספר ילדים'
        />
        {errors.children && (
          <p className='text-red-500'>{errors.children.message}</p>
        )}
      </div>

      <button
        type='submit'
        className='bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded text-lg font-semibold w-full'
      >
        שלח הזמנה
      </button>
    </form>
  );
}
