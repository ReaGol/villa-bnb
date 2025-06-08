import ContactForm from "@/components/ContactForm";
import { FaPhoneAlt } from "react-icons/fa";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("contact");
  return (
    <main className='flex flex-col items-center justify-start min-h-screen bg-gray-50 px-4 py-6'>
      <div className='w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg border border-gray-200'>
        <h1 className='text-3xl font-bold mb-6 text-center'>{t("title")}</h1>
        <p className='text-center text-gray-600 mb-6 text-lg'>
          {t("description")}
        </p>
        <ContactForm />
        <div className='mt-8 text-center text-sm text-gray-500 flex flex-col items-center gap-2'>
          <div className='flex items-center gap-2'>
            <FaPhoneAlt className='text-green-600' />
            <span>052-5344929</span>
          </div>
          <div className='flex items-center gap-2'>
            <FaPhoneAlt className='text-green-600' />
            <span>050-6209364</span>
          </div>
          <div className='mt-2'>✉️ goldintilda@gmail.com</div>
        </div>
      </div>
    </main>
  );
}
