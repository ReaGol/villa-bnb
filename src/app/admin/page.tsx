"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isAdmin = document.cookie.includes("isAdmin=true");
    if (isAdmin) {
      setIsAuthorized(true);
    } else {
      router.push("/"); 
    }
  }, [router]);

  if (!isAuthorized) return null;

  return (
    <main className='p-8'>
      <h1 className='text-3xl font-bold text-green-700 mb-6 text-center'>
        ברוך הבא לפאנל הניהול
      </h1>
      {/*TODO כרטיסיות ניהול*/}
    </main>
  );
}
