"use client";

import { useEffect, useState } from "react";

interface Recommendation {
  _id: string;
  name: string;
  message: string | { he?: string; en?: string };
  stars: number;
  createdAt: string;
}

export default function AdminRecommendations() {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecs = async () => {
    const res = await fetch("/api/recommendations");
    const data = await res.json();
    setRecs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecs();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = confirm("האם למחוק את ההמלצה?");
    if (!confirmed) return;

    const res = await fetch(`/api/recommendations?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchRecs();
    } else {
      alert("שגיאה במחיקה");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <span className="loader mr-2"></span>
        <span>טוען המלצות...</span>
      </div>
    );
  if (recs.length === 0) return <p>אין המלצות להצגה.</p>;

  return (
    <div className='bg-white border p-6 rounded shadow max-h-[500px] overflow-y-auto'>
      <h2 className='text-xl font-bold text-center mb-4 text-green-700'>
        המלצות אורחים
      </h2>
      <ul className='space-y-4'>
        {recs.map((rec) => (
          <li
            key={rec._id}
            className='border p-4 rounded shadow-sm relative bg-gray-50'
          >
            <p className='font-semibold'>{rec.name}</p>
            <p className='text-sm text-yellow-500'>⭐ {rec.stars} כוכבים</p>
            <p className='text-sm text-gray-700 mt-2 whitespace-pre-wrap'>
              {typeof rec.message === "string"
                ? rec.message
                : rec.message.he || rec.message.en || ""}
            </p>
            <button
              onClick={() => handleDelete(rec._id)}
              className='absolute top-2 left-2 text-red-500 hover:text-red-700 text-sm'
            >
              מחק ✖
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
