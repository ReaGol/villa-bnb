"use client";

import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface BookingFormData {
  dateRange: [Date | null, Date | null];
  adults: number;
  children: number;
  specialRequests: string;
}

export default function BookingForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BookingFormData>();

  const router = useRouter();

  const disabledDates = [
    new Date(2025, 4, 10),
    new Date(2025, 4, 15),
    new Date(2025, 4, 20),
  ];

  const onSubmit = (data: BookingFormData) => {
    console.log("Booking Data:", data);

    const query = new URLSearchParams({
      checkIn: data.dateRange[0]?.toISOString() || "",
      checkOut: data.dateRange[1]?.toISOString() || "",
      adults: data.adults.toString(),
      children: data.children.toString(),
      specialRequests: data.specialRequests || "",
    }).toString();

    router.push(`/booking/summary?${query}`);
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
          placeholder='הכנס מספר ילדים'
        />
        {errors.children && (
          <p className='text-red-500'>{errors.children.message}</p>
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
        שלח הזמנה
      </button>
    </form>
  );
}
