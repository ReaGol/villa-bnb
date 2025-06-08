import BookingForm from "@/components/BookingForm";
import { useTranslations } from "next-intl";

export default function BookingPage() {
  const t = useTranslations("booking");
  return (
    <main className='p-8'>
      <h1 className='text-4xl font-bold mb-8 text-center'>
        {t("title")}
      </h1>
      <BookingForm />
    </main>
  );
}
