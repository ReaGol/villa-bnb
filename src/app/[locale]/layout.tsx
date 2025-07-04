import { NextIntlClientProvider } from "next-intl";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HtmlDirection from "@/components/HtmlDirection";


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
      <HtmlDirection />
      <Navbar />
      <main className='flex-grow'>{props.children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
