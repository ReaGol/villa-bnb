import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <main className='flex flex-col items-center text-center p-8 space-y-16'>
      <section
        className='w-full bg-cover bg-center relative h-[60vh] flex items-center justify-center'
        style={{
          backgroundImage: `url(${
            process.env.NEXT_PUBLIC_BASE_PATH || ""
          }/villa.jpg)`,
        }}
      >
        <div className='text-white p-8 rounded top-2 transform -translate-y-40'>
          <h1 className='text-4xl md:text-6xl font-bold mb-4'>
            {t("heroTitle")}
          </h1>
          <p className='text-lg md:text-2xl'>{t("heroSubtitle")}</p>
        </div>
      </section>

      <section className='max-w-3xl space-y-4'>
        <p>{t("description")}</p>
      </section>

      <section>
        <Link href='/booking'>
          <button className='bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded text-lg font-semibold'>
            {t("checkAvailability")}
          </button>
        </Link>
      </section>
    </main>
  );
}
