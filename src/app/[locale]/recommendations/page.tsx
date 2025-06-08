import RecommendationsList from "@/components/recommendations/RecommendationsList";

export default function RecommendationsPage() {
  return (
    <main className='p-8 max-w-5xl mx-auto'>
      <h1 className='text-4xl font-bold text-center mb-8'>המלצות אורחים</h1>
      <RecommendationsList />
    </main>
  );
}
