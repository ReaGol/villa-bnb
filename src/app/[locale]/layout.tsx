// app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export default async function LocaleLayout(props: {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}) {
  const { locale } = await props.params;

  const messages = await import(`@/messages/${locale}.json`).then(
    (m) => m.default
  );

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Navbar />
      <main className='flex-grow'>{props.children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
