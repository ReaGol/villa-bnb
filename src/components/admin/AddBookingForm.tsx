"use client";

import { useForm } from "react-hook-form";

interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  specialRequests?: string;
}

interface AddBookingFormProps {
  onAddBooking: () => void;
}

export default function AddBookingForm({ onAddBooking }: AddBookingFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>();

  const onSubmit = async (data: BookingFormData) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkInDate = new Date(data.checkIn);
    const checkOutDate = new Date(data.checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      setError("checkIn", { message: "תאריכים לא תקינים" });
      return;
    }

    if (checkInDate < today || checkOutDate < today) {
      setError("checkIn", { message: "לא ניתן לבחור תאריכים שעברו" });
      return;
    }

    if (checkInDate > checkOutDate) {
      setError("checkOut", {
        message: "תאריך יציאה חייב להיות אחרי תאריך כניסה",
      });
      return;
    }

    const res = await fetch("/api/admin/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      onAddBooking();
      reset();
    } else if (res.status === 409) {
      alert(result.message || "יש חפיפה עם הזמנה קיימת.");
    } else {
      alert(result.message || "אירעה שגיאה בעת הוספת ההזמנה.");
    }
  };

  return (
    <div className='text-center'>
      <h2 className='text-xl font-semibold mb-4 text-green-700'>
        הוספת הזמנה חדשה
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='bg-white border p-6 rounded shadow space-y-4 max-w-xl mx-auto'
      >
        <input
          type='text'
          placeholder='שם מלא'
          {...register("fullName", { required: "יש להזין שם מלא" })}
          className='w-full border p-2 rounded'
        />
        {errors.fullName && (
          <p className='text-red-500'>{errors.fullName.message}</p>
        )}

        <input
          type='email'
          placeholder='אימייל'
          {...register("email", { required: "יש להזין אימייל" })}
          className='w-full border p-2 rounded'
        />
        {errors.email && <p className='text-red-500'>{errors.email.message}</p>}

        <input
          dir='rtl'
          type='tel'
          placeholder='טלפון'
          {...register("phone", { required: "יש להזין טלפון" })}
          className='w-full border p-2 rounded'
        />
        {errors.phone && <p className='text-red-500'>{errors.phone.message}</p>}

        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1'>
            <label className='block text-sm mb-1'>תאריך כניסה:</label>
            <input
              type='date'
              {...register("checkIn", { required: true })}
              min={new Date().toISOString().split("T")[0]}
              className='w-full border p-2 rounded'
            />
            {errors.checkIn && (
              <p className='text-red-500'>{errors.checkIn.message}</p>
            )}
          </div>
          <div className='flex-1'>
            <label className='block text-sm mb-1'>תאריך יציאה:</label>
            <input
              type='date'
              {...register("checkOut", { required: true })}
              min={new Date().toISOString().split("T")[0]}
              className='w-full border p-2 rounded'
            />
            {errors.checkOut && (
              <p className='text-red-500'>{errors.checkOut.message}</p>
            )}
          </div>
        </div>

        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1'>
            <label className='block text-sm mb-1'>מבוגרים:</label>
            <input
              type='number'
              {...register("adults", { required: true, min: 1 })}
              className='w-full border p-2 rounded'
            />
          </div>
          <div className='flex-1'>
            <label className='block text-sm mb-1'>ילדים:</label>
            <input
              type='number'
              {...register("children", { required: true, min: 0 })}
              className='w-full border p-2 rounded'
            />
          </div>
        </div>
        <textarea
          rows={3}
          placeholder='בקשות מיוחדות (לא חובה)'
          {...register("specialRequests")}
          className='w-full border p-2 rounded'
        />

        <button
          type='submit'
          className='bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded font-semibold w-full'
          disabled={isSubmitting}
        >
          {isSubmitting ? "מוסיף..." : "הוסף הזמנה"}
        </button>
      </form>
    </div>
  );
}


