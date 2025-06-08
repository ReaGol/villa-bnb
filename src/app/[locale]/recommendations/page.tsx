import RecommendationsList from "@/components/recommendations/RecommendationsList";
import { useTranslations } from "next-intl";

export default function RecommendationsPage() {
  const t = useTranslations("recommendations");
  return (
    <main className='p-8 max-w-5xl mx-auto'>
      <h1 className='text-4xl font-bold text-center mb-8'>
        {t("AddRecommendationTitle")}
      </h1>
      <RecommendationsList />
    </main>
  );
}
