import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className='flex flex-col items-center text-center p-8 space-y-16'>
      <section
        className='w-full bg-cover bg-center relative h-[60vh] flex items-center justify-center'
        style={{ backgroundImage: "url('/villa.jpg')" }}
      >
        <div className='bg-black/50 text-white p-8 rounded'>
          <h1 className='text-4xl md:text-6xl font-bold mb-4'>
            נופש חלומי ביוון שלא הכרתם
          </h1>
          <p className='text-lg md:text-2xl'>המקום המושלם לחופשה בלתי נשכחת</p>
        </div>
      </section>

      <section className='max-w-3xl space-y-4'>
        <h2 className='text-3xl font-bold'>על הווילה</h2>
        <p>
          הווילה שלנו מציעה חווית אירוח ייחודית בלב הטבע. נוף עוצר נשימה, וחדרים
          נוחים שיבטיחו לכם חופשה מושלמת.
        </p>
      </section>

      <section>
        <Link href='/booking'>
          <button className='bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded text-lg font-semibold'>
            בדקו זמינות
          </button>
        </Link>
      </section>
    </main>
  );
}
