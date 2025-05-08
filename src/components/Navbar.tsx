import Link from "next/link";

export default function Navbar() {
  return (
    <nav className='flex justify-center space-x-4 bg-gray-100 p-4 text-lg'>
      <Link href='/'>בית</Link>
      <Link href='/gallery'>גלריה</Link>
      <Link href='/contact'>צור קשר</Link>
      <Link href='/about'>אודות</Link>
      <Link href='/booking'>הזמנה</Link>
      <Link href='/recommendations'>המלצות</Link>
      <Link href='/admin'>ניהול</Link>
    </nav>
  );
}
