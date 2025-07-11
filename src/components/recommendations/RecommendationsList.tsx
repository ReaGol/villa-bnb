"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import RecommendationCard from "./RecommendationCard";
import RecommendationForm from "./RecommendationForm";

export type Recommendation = {
  _id?: string;
  name: string;
  stars: number;
  message: {
    he: string;
    en?: string;
  };
};

export default function RecommendationsList() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const locale = useLocale();

  const fetchAndSetRecommendations = () => {
    fetch("/api/recommendations")
      .then((res) => res.json())
      .then((dbRecs) => {
        setRecommendations(dbRecs);
      })
      .catch(() => {
        setRecommendations([]);
        console.error("שגיאה בשליפת המלצות");
      });
  };

  useEffect(() => {
    fetchAndSetRecommendations();
  }, []);

  const handleAdd = async (rec: Recommendation) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const res = await fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rec),
    });

    if (res.ok) {
      setShowForm(false);
      setShowSuccess(true);
      fetchAndSetRecommendations();
      setTimeout(() => setShowSuccess(false), 4000);
    } else {
      alert("שגיאה בהוספת ההמלצה");
    }

    setIsSubmitting(false);
  };

  const skeletons = Array.from({ length: 3 }, (_, i) => (
    <div
      key={i}
      className='bg-gray-200 rounded shadow animate-pulse h-40'
    ></div>
  ));

  return (
    <div className='space-y-6 relative'>
      {showSuccess && (
        <div className='fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded shadow z-50 transition-opacity'>
          ✅ ההמלצה נשלחה בהצלחה! תודה רבה 💚
        </div>
      )}

      <div className='flex justify-center'>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className='bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-semibold'
        >
          {showForm
            ? locale === "he"
              ? "ביטול"
              : "Cancel"
            : locale === "he"
            ? "הוסיפו המלצה"
            : "Add Recommendation"}
        </button>
      </div>

      {showForm && <RecommendationForm onAdd={handleAdd} />}

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        {recommendations.length === 0 && skeletons}

        {recommendations.slice(0, visibleCount).map((rec, index) => (
          <RecommendationCard key={rec._id || index} recommendation={rec} />
        ))}
      </div>

      {visibleCount < recommendations.length && (
        <div className='flex justify-center'>
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className='mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded font-semibold'
          >
            {locale === "he" ? "טען עוד המלצות" : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
