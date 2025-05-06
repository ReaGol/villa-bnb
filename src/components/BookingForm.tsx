"use client";

import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


interface BookingFormData {
  checkIn: Date;
  checkOut: Date;
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

  const onSubmit = (data: BookingFormData) => {
    console.log("Booking Data:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-6 max-w-lg mx-auto bg-white p-6 rounded shadow'
    >
      <div>
        <label className='block mb-2 font-bold'>תאריך כניסה:</label>
        <Controller
          name='checkIn'
          control={control}
          rules={{ required: "יש לבחור תאריך כניסה" }}
          render={({ field }) => (
            <DatePicker
              placeholderText='בחר תאריך'
              className='border p-2 w-full'
              selected={field.value}
              onChange={field.onChange}
              dateFormat='dd/MM/yyyy'
            />
          )}
        />
        {errors.checkIn && (
          <p className='text-red-500'>{errors.checkIn.message}</p>
        )}
      </div>

      <div>
        <label className='block mb-2 font-bold'>תאריך יציאה:</label>
        <Controller
          name='checkOut'
          control={control}
          rules={{ required: "יש לבחור תאריך יציאה" }}
          render={({ field }) => (
            <DatePicker
              placeholderText='בחר תאריך'
              className='border p-2 w-full'
              selected={field.value}
              onChange={field.onChange}
              dateFormat='dd/MM/yyyy'
            />
          )}
        />
        {errors.checkOut && (
          <p className='text-red-500'>{errors.checkOut.message}</p>
        )}
      </div>

      <div>
        <label className='block mb-2 font-bold'>מבוגרים:</label>
        <input
          type='number'
          {...register("adults", { required: "יש לבחור מספר מבוגרים", min: 1 })}
          className='border p-2 w-full'
          min={1}
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
          className='border p-2 w-full'
          min={0}
        />
        {errors.children && (
          <p className='text-red-500'>{errors.children.message}</p>
        )}
      </div>

      <div>
        <label className='block mb-2 font-bold'>בקשות מיוחדות:</label>
        <textarea
          {...register("specialRequests")}
          className='border p-2 w-full'
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