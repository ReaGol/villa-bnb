"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

type FormData = {
  email: string;
  password: string;
};

export default function AdminLoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [loginError, setLoginError] = useState("");
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      const result = await res.json();
      setLoginError(result.error || "שגיאה בהתחברות");
    }
  };

  return (
    <main className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='bg-white p-8 rounded shadow max-w-sm w-full space-y-4'
      >
        <h1 className='text-2xl font-bold text-center mb-4 text-green-700'>
          התחברות מנהל
        </h1>

        <div>
          <label className='block mb-1 font-medium'>אימייל:</label>
          <input
            type='email'
            {...register("email", { required: "יש להזין אימייל" })}
            className='w-full border p-2 rounded'
            dir='ltr'
          />
          {errors.email && (
            <p className='text-red-500 text-sm'>{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className='block mb-1 font-medium'>סיסמה:</label>
          <input
            type='password'
            {...register("password", { required: "יש להזין סיסמה" })}
            className='w-full border p-2 rounded'
            dir='ltr'
          />
          {errors.password && (
            <p className='text-red-500 text-sm'>{errors.password.message}</p>
          )}
        </div>

        {loginError && <p className='text-red-600 text-center'>{loginError}</p>}

        <button
          type='submit'
          className='w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold'
        >
          התחבר
        </button>
      </form>
    </main>
  );
}
