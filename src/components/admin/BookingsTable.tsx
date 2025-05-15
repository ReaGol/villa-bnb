"use client";

import { useEffect, useState } from "react";

type Booking = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  specialRequests?: string;
};

export default function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("שגיאה בשליפת הזמנות:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm("האם אתה בטוח שברצונך למחוק את ההזמנה?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/bookings?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBookings(bookings.filter((b) => b._id !== id));
      } else {
        alert("מחיקה נכשלה");
      }
    } catch (err) {
      console.error("שגיאה במחיקה:", err);
    }
  };

  if (loading) return <p className='text-center py-6'>טוען הזמנות...</p>;

  if (bookings.length === 0)
    return <p className='text-center py-6'>אין הזמנות להצגה.</p>;

  return (
    <div className='overflow-x-auto mt-6'>
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
          {bookings.map((b) => (
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
                  onClick={() => handleDelete(b._id)}
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
