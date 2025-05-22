"use client";

import { Booking } from "@/types/booking"; 
import { useState } from "react";

interface BookingsTableProps {
  bookings: Booking[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export default function BookingsTable({
  bookings,
  loading,
  onDelete,
}: BookingsTableProps) {
  const [sortBy, setSortBy] = useState("date");

  const sortedBookings = [...bookings].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.fullName.localeCompare(b.fullName);
      case "email":
        return a.email.localeCompare(b.email);
      case "date":
      default:
        return new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime();
    }
  });

  if (loading) return <p className='text-center py-6'>טוען הזמנות...</p>;

  if (sortedBookings.length === 0)
    return <p className='text-center py-6'>אין הזמנות להצגה.</p>;

  return (
    <div className='overflow-x-auto mt-6'>
      <div className='flex flex-row mb-4 w-full'>
        <label className='ml-2 font-semibold'>מיין לפי:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className='border p-1 rounded'
        >
          <option value='date'>תאריך כניסה</option>
          <option value='name'>שם</option>
          <option value='email'>אימייל</option>
        </select>
      </div>
      <table className='w-full border rounded text-right'>
        <thead className='bg-gray-100'>
          <tr>
            <th className='p-2'>שם מלא</th>
            <th className='p-2'>אימייל</th>
            <th className='p-2'>טלפון</th>
            <th className='p-2'>תאריכים</th>
            <th className='p-2'>אורחים</th>
            <th className='p-2'>בקשות</th>
            <th className='p-2'>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {sortedBookings.map((b) => (
            <tr key={b._id} className='border-t'>
              <td className='p-2'>{b.fullName}</td>
              <td className='p-2'>{b.email}</td>
              <td className='p-2'>{b.phone}</td>
              <td className='p-2'>
                {new Date(b.checkIn).toLocaleDateString("he-IL")} -{" "}
                {new Date(b.checkOut).toLocaleDateString("he-IL")}
              </td>
              <td className='p-2'>
                {b.adults} מבוגרים, {b.children} ילדים
              </td>
              <td className='p-2'>{b.specialRequests?.trim() || "—"}</td>
              <td className='p-2'>
                <button
                  onClick={() => onDelete(b._id)}
                  className='text-red-600 hover:underline'
                >
                  מחק
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
