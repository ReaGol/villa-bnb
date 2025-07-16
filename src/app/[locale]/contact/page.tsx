import ContactForm from "@/components/ContactForm";
import { FaPhoneAlt } from "react-icons/fa";
import { useTranslations, useLocale } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("contact");
  const locale = useLocale();

  const phones = t.raw("phones") as string[] | undefined;
  const email = t("email") || "goldintilda@gmail.com";

  const displayNumber = (num: string) => {
    if (num.startsWith("+972-")) {
      return "0" + num.slice(5);
    }
    return num;
  };

  const telNumber = (num: string) => num.replace(/-/g, "");

  return (
    <main className='flex flex-col items-center justify-start min-h-screen bg-gray-50 px-4 py-6'>
      <div className='w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg border border-gray-200'>
        <h1 className='text-3xl font-bold mb-6 text-center'>{t("title")}</h1>
        <p className='text-center text-gray-600 mb-6 text-lg'>
          {t("description")}
        </p>
        <ContactForm />
        <div className='mt-8 text-center text-sm text-gray-500 flex flex-col items-center gap-2'>
          {phones?.map((phone) => (
            <div
              key={phone}
              className={`flex items-center gap-2 ${locale === "he" ? "flex-row-reverse" : ""}`}
            >
              <FaPhoneAlt className='text-sky-600' />
              <a
                href={`tel:${telNumber(phone)}`}
                dir="ltr"
                className="underline hover:text-sky-700"
              >
                {displayNumber(phone)}
              </a>
            </div>
          ))}
          <div className='mt-2'>
            ✉️ <a href={`mailto:${email}`} className="underline hover:text-sky-700">{email}</a>
          </div>
        </div>
      </div>
    </main>
  );
}
