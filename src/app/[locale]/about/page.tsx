import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("about");
  const subtitles: string[] = t.raw("subtitles");
  const descriptions: string[] = t.raw("descriptions");

  return (
    <main className='p-8 max-w-4xl mx-auto'>
      <section className='mb-10 text-center'>
        <h1 className='text-4xl font-bold mb-4'>{t("title")}</h1>
      </section>
      <section className='mt-0 mb-10'>
        <h2 className='text-2xl font-bold text-sky-700 mb-4 text-center'>
          {subtitles[5]}
        </h2>
        <div className='w-full h-72'>
          <iframe
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12396.028382132054!2d22.991707168023186!3d39.037957648992716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a749ea7110bd33%3A0xff6b1c917620b400!2samiram&#39;s%20house!5e0!3m2!1siw!2sil!4v1746602829490!5m2!1siw!2sil'
            title='Google Map'
            className='w-full h-full rounded-lg shadow'
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
          ></iframe>
        </div>
      </section>

      <section className='space-y-8 leading-relaxed text-gray-800'>
        {subtitles.slice(0, 5).map((subtitle, i) => (
          <div key={i}>
            <h2 className='text-2xl font-semibold text-sky-700 mb-2'>
              {subtitle}
            </h2>
            <p>{descriptions[i]}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
