import ContactForm from "@/components/ContactForm";
import { FaPhoneAlt } from "react-icons/fa";


export default function ContactPage() {
  return (
    <main className='flex flex-col items-center justify-start min-h-screen bg-gray-50 px-4 py-6'>
      <div className='w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg border border-green-300'>
        <h1 className='text-3xl font-bold text-green-700 mb-6 text-center'>
          צור קשר
        </h1>
        <p className='text-center text-gray-600 mb-6'>
          יש שאלות? מלאו את הטופס ונחזור אליכם בהקדם!
        </p>
        <ContactForm />
        <div className='mt-8 text-center text-sm text-gray-500 flex flex-col items-center gap-2'>
          <div className='flex items-center gap-2'>
            <FaPhoneAlt className='text-green-600' />
            <span>050-1234567</span>
          </div>
          <div className='flex items-center gap-2'>
            <FaPhoneAlt className='text-green-600' />
            <span>050-7654321</span>
          </div>
          <div className='mt-2'>✉️ info@dreamvilla.com</div>
        </div>
      </div>
    </main>
  );
}
