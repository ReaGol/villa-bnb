import { FaFacebook, FaInstagram, FaPhone } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className='bg-gray-100 text-gray-700 py-6 mt-10'>
      <div className='container mx-auto flex flex-col md:flex-row items-center justify-between px-4'>
        <p className='text-sm mb-4 md:mb-0 text-center md:text-right'>
          &copy; {new Date().getFullYear()} רעות גולדין. כל הזכויות שמורות.
        </p>

        <div className='flex space-x-4 rtl:space-x-reverse gap-4 text-2xl'>
          <Link
            href='https://www.facebook.com/share/1B1JNbKBdc/?mibextid=wwXIfr'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Facebook'
            className='hover:text-green-600 transition-colors'
          >
            <FaFacebook />
          </Link>
          <Link
            href='https://www.instagram.com/YourProfile'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Instagram'
            className='hover:text-green-600 transition-colors'
          >
            <FaInstagram />
          </Link>
        </div>
      </div>
    </footer>
  );
}
