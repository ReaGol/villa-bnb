import BookingForm from "@/components/BookingForm";

export default function BookingPage() {
  return (
    <main className='p-8'>
      <h1 className='text-4xl font-bold mb-8 text-center'>
        הזמינו את החופשה שלכם עכשיו
      </h1>
      <BookingForm />
    </main>
  );
}
