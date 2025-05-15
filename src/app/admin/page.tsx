"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BookingsTable from "@/components/admin/BookingsTable";
import AddBookingForm from "@/components/admin/AddBookingForm";

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

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const isAdmin = document.cookie.includes("isAdmin=true");
    if (isAdmin) {
      setIsAuthorized(true);
      fetchBookings();
    } else {
      router.push("/");
    }
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

  if (!isAuthorized) return null;

  return (
    <main className='p-8'>
      <h1 className='text-3xl font-bold mb-6 text-center text-green-700'>
        ברוך הבא לפאנל הניהול
      </h1>

      <AddBookingForm onAddBooking={fetchBookings} />
      <BookingsTable
        bookings={bookings}
        loading={loading}
        onDelete={handleDeleteBooking}
      />
    </main>
  );
}
