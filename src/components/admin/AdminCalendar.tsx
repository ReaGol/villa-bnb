"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { DatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePicker = dynamic<DatePickerProps>(
  () =>
    import("react-datepicker").then(
      (mod) => mod.default as unknown as React.ComponentType<DatePickerProps>
    ),
  { ssr: false }
);

export default function AdminCalendar() {
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);

  useEffect(() => {
    async function fetchUnavailableDates() {
      try {
        const res = await fetch("/api/unavailable-dates");
        const data = await res.json();

        const dates: Date[] = [];
        data.forEach((booking: { checkIn: string; checkOut: string }) => {
          const start = new Date(booking.checkIn);
          const end = new Date(booking.checkOut);
          if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

          let current = new Date(start);
          while (current <= end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
        });

        setUnavailableDates(dates);
      } catch (err) {
        console.error("שגיאה בשליפת תאריכים תפוסים", err);
      }
    }

    fetchUnavailableDates();
  }, []);

  return (
    <div>
      <h2 className='text-xl font-semibold mb-4 text-center text-sky-700'>
        לוח השנה
      </h2>
      <DatePicker
        inline
        excludeDates={unavailableDates}
        dateFormat='dd/MM/yyyy'
        className='w-full'
        monthsShown={2}
      />
    </div>
  );
}
