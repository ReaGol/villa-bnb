"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddBookingForm from "@/components/admin/AddBookingForm";
import BookingsTable from "@/components/admin/BookingsTable";
import AdminCalendar from "@/components/admin/AdminCalendar";
import AdminMessages from "@/components/admin/AdminMessages";
import { Booking } from "@/types/booking";
import AdminRecommendations from "@/components/admin/AdminRecommendations";
import Link from "next/link";

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/check-auth");
        if (res.ok) {
          setIsAuthorized(true);
          fetchBookings();
        } else {
          router.push("/admin/login");
        }
      } catch {
        router.push("/admin/login");
      }
    };
    checkAuth();
  }, [router]);

  const fetchBookings = async () => {
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

  const handleDeleteBooking = async (id: string) => {
    const confirmed = confirm("האם אתה בטוח שברצונך למחוק את ההזמנה?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/bookings?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b._id !== id));
      } else {
        alert("מחיקה נכשלה");
      }
    } catch (err) {
      console.error("שגיאה במחיקה:", err);
    }
  };

  if (!isAuthorized) return <p className='text-center p-6'>טוען...</p>;

  return (
    <main className='p-6'>
      <div className='flex justify-between mb-4'>
        <Link
          href='/'
          className='inline-block bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition'
        >
          חזרה לדף הבית
        </Link>
        <Link
          href='/api/admin/logout'
          className='inline-block bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition'
        >
          התנתק
        </Link>
      </div>
      <h1 className='text-3xl font-bold mb-6 text-center text-green-700'>
        ברוך הבא לפאנל הניהול
      </h1>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='bg-white border p-4 rounded shadow-lg'>
          <AdminCalendar />
        </div>
        <div className='bg-white border p-4 rounded shadow-lg'>
          <AddBookingForm onAddBooking={fetchBookings} />
        </div>
        <div className='bg-white border p-4 rounded shadow-lg'>
          <AdminMessages />
        </div>
        <div className='bg-white border p-4 rounded shadow-lg lg:col-span-3'>
          <BookingsTable
            bookings={bookings}
            loading={loading}
            onDelete={handleDeleteBooking}
          />
        </div>
        <div className='bg-white border p-4 rounded shadow-lg'>
          <AdminRecommendations />
        </div>
      </div>
    </main>
  );
}
