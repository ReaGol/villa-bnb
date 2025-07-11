import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <main className='flex flex-col items-center text-center p-8 space-y-16'>
      <section
        className='w-full bg-cover bg-center relative min-h-[60vh] flex items-start justify-center pt-4 md:pt-24'
        style={{
          backgroundImage: `url(${
            process.env.NEXT_PUBLIC_BASE_PATH || ""
          }/villa.jpg)`,
        }}
      >
        <div className='text-white p-4 rounded text-center'>
          <h1 className='text-3xl md:text-5xl font-bold mb-4'>
            {t("heroTitle")}
          </h1>
          <p className='text-lg md:text-2xl'>{t("heroSubtitle")}</p>
        </div>
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
